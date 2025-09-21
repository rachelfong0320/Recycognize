import json
import boto3
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb")
brands_table = dynamodb.Table("brandUser")

def iso_now():
    return datetime.now(timezone.utc).isoformat()

def lambda_handler(event, context):
    try:
        # Parse JSON body (API Gateway POST)
        body_str = event.get("body")
        body = json.loads(body_str) if body_str else event

        # Only required field
        if "userId" not in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required field: userId"})
            }

        # Add timestamps
        now = iso_now()
        body["createdAt"] = now
        body["updatedAt"] = now

        # Insert all fields as-is into DynamoDB
        brands_table.put_item(Item=body)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Brand user created",
                "brand": body
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
