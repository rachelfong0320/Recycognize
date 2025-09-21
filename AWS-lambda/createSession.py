import json
import boto3
from datetime import datetime, timezone

# Initialize DynamoDB resource
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("RvmSessions")

def lambda_handler(event, context):
    # Parse JSON body from request
    try:
        body = json.loads(event.get("body", "{}"))
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON body"})
        }

    session_id = body.get("sessionId")
    rvm_id = body.get("rvmId")

    # Validate input
    if not session_id or not rvm_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing sessionId or rvmId"})
        }

    # Create item
    item = {
        "sessionId": session_id,
        "rvmId": rvm_id,
        "status": "active",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    # Insert into DynamoDB
    try:
        table.put_item(Item=item)
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Session created successfully",
            "session": item
        })
    }
