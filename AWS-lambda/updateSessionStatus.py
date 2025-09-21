import json
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("RvmSessions")

def iso_now():
    return datetime.now(timezone.utc).isoformat()

def lambda_handler(event, context):
    try:
        # Parse JSON body
        body_str = event.get("body")
        body = json.loads(body_str) if body_str else event

        # Required fields
        session_id = body.get("sessionId")
        if not session_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required field: sessionId"})
            }

        # Optional: allow updating status dynamically, default to 'complete'
        status = body.get("status", "complete")

        # Update the DynamoDB item
        response = table.update_item(
            Key={"sessionId": session_id},
            UpdateExpression="SET #s = :status, updatedAt = :ts",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":status": status,
                ":ts": iso_now()
            },
            ReturnValues="ALL_NEW"
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": f"Session {session_id} updated to {status}",
                "session": response.get("Attributes")
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
