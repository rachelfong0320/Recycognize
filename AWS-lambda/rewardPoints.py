import json
import boto3
from decimal import Decimal
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb")
scan_table = dynamodb.Table("ScanRecords")
points_table = dynamodb.Table("UserPoints")

CONFIDENCE_THRESHOLD = 0.8   # 80%
POINTS_PER_ITEM = 10

def iso_now():
    return datetime.now(timezone.utc).isoformat()

def lambda_handler(event, context):
    session_id = event.get("sessionId")
    if not session_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing sessionId"})
        }

    # 1️⃣ Query ScanRecords by sessionId
    response = scan_table.query(
        IndexName="sessionId-index",  # assume you have a GSI on sessionId
        KeyConditionExpression=boto3.dynamodb.conditions.Key("sessionId").eq(session_id)
    )
    scans = response.get("Items", [])

    if not scans:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": f"No scans found for sessionId {session_id}"})
        }

    results = []
    for scan in scans:
        scan_id = scan["scanId"]
        material_conf = float(scan.get("confidence", {}).get("material", 0.0))
        material = scan.get("material", "unknown")
        user_id = scan.get("userId", "demo-user")

        if material_conf < CONFIDENCE_THRESHOLD:
            results.append({
                "scanId": scan_id,
                "accepted": False,
                "reason": f"Low confidence ({material_conf*100:.1f}%)"
            })
            continue

        # Accepted → add points
        points_table.update_item(
            Key={"userId": user_id},
            UpdateExpression="SET totalPoints = if_not_exists(totalPoints, :zero) + :p, "
                             "history = list_append(if_not_exists(history, :empty_list), :h)",
            ExpressionAttributeValues={
                ":p": Decimal(str(POINTS_PER_ITEM)),
                ":zero": Decimal("0"),
                ":empty_list": [],
                ":h": [{
                    "scanId": scan_id,
                    "brand": scan.get("brand", "unknown"),
                    "points": POINTS_PER_ITEM,
                    "timestamp": iso_now()
                }]
            }
        )

        results.append({
            "scanId": scan_id,
            "accepted": True,
            "material": material,
            "confidence": material_conf,
            "pointsAwarded": POINTS_PER_ITEM,
            "userId": user_id
        })

    return {
        "statusCode": 200,
        "body": json.dumps({
            "sessionId": session_id,
            "results": results
        })
    }
