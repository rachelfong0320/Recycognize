import json
import uuid
import os
import datetime
import boto3
import requests
import decimal

ROBOFLOW_API_KEY = os.environ["ROBOFLOW_API_KEY"]
ROBOFLOW_MODEL_ID = os.environ["ROBOFLOW_MODEL_ID"]  

dynamodb = boto3.resource("dynamodb")
scan_table = dynamodb.Table("ScanRecords")
sessions_table = dynamodb.Table("RvmSessions") 

def to_dynamodb_safe(v):
    """Convert floats to Decimal recursively (DynamoDB requires Decimal, not float)."""
    if isinstance(v, float):
        return decimal.Decimal(str(round(v, 6)))
    if isinstance(v, list):
        return [to_dynamodb_safe(x) for x in v]
    if isinstance(v, dict):
        return {k: to_dynamodb_safe(w) for k, w in v.items()}
    return v

MATERIALS = {"glass", "aluminum", "plastic", "other_materials"}
BRANDS    = {"cocacola", "unknown_brand"}
CAPS      = {"cap_on", "cap_off"}

def pick_top(preds: dict, allowed: set):
    best = {"label": "unknown", "confidence": 0.0}
    for cls, details in preds.items():
        if cls in allowed:
            conf = float(details.get("confidence", 0))
            if conf > best["confidence"]:
                best = {"label": cls, "confidence": conf}
    return best

def get_active_session_id():
    resp = sessions_table.scan(
        FilterExpression="attribute_exists(#s) AND #s = :active",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":active": "active"},
        Limit=1
    )
    items = resp.get("Items", [])
    if not items:
        return None
    return items[0]["sessionId"]

def lambda_handler(event, context):
    # Accept both direct dict events and API Gateway events
    body = event if isinstance(event, dict) else json.loads(event.get("body", "{}"))

    image_url  = body.get("imageUrl")
    session_id = body.get("sessionId")
    burst_id   = body.get("burstId") or str(uuid.uuid4())
    frame_idx  = int(body.get("frameIndex", 0))

    if not session_id:
        session_id = get_active_session_id()

    if not image_url or not session_id:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Missing imageUrl or sessionId"})
        }

    # Call Roboflow Hosted Inference
    infer_url = f"https://serverless.roboflow.com/{ROBOFLOW_MODEL_ID}"
    resp = requests.get(infer_url, params={"api_key": ROBOFLOW_API_KEY, "image": image_url})
    resp.raise_for_status()
    rf = resp.json()

    print("Roboflow raw response:", rf)

    preds = rf.get("predictions", {}) 

    top_material = pick_top(preds, MATERIALS)
    top_brand    = pick_top(preds, BRANDS)
    top_cap      = pick_top(preds, CAPS)

    item = {
        "scanId": str(uuid.uuid4()),
        "burstId": burst_id,
        "frameIndex": frame_idx,
        "sessionId": session_id,
        "userId": "demo-user",
        "imageUrl": image_url,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "material": top_material["label"],
        "brand":    top_brand["label"],
        "cap":      top_cap["label"],
        "confidence": to_dynamodb_safe({
            "material": top_material["confidence"],
            "brand":    top_brand["confidence"],
            "cap":      top_cap["confidence"],
        }),
    }

    if frame_idx == -1:
        scan_table.put_item(Item=item)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(item, default=str)
    }
