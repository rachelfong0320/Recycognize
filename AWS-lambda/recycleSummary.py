import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource("dynamodb")
scan_table = dynamodb.Table("ScanRecords")

POINTS_PER_ITEM = 10

def lambda_handler(event, context):
    # Parse sessionId from request
    body_str = event.get("body")
    body = json.loads(body_str) if body_str else event

    session_id = body.get("sessionId")
    if not session_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing sessionId"})
        }

    # 1️⃣ Scan table for the sessionId, filter out "other_materials"
    response = scan_table.scan(
        FilterExpression=Attr("sessionId").eq(session_id) & Attr("material").ne("other_materials")
    )
    scans = response.get("Items", [])

    if not scans:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": f"No scans found for sessionId {session_id}"})
        }

    total_num = 0
    total_points = 0
    material_counts = {}

    # 2️⃣ Aggregate
    for scan in scans:
        material = scan.get("material", "unknown")
        total_num += 1
        total_points += POINTS_PER_ITEM
        if material not in material_counts:
            material_counts[material] = 0
        material_counts[material] += 1

    # 3️⃣ Build summary
    summary = {
        "sessionId": session_id,
        "totalNumItems": total_num,
        "totalPoints": total_points,
        "materialCounts": material_counts
    }

    return {
        "statusCode": 200,
        "body": json.dumps(summary)
    }
