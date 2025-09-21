import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
points_table = dynamodb.Table("UserPoints")

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    print("📦 Full Event:", json.dumps(event))
    # Support path or query parameters
    user_id = (event.get("pathParameters") or {}).get("userId")
    if not user_id:
        user_id = (event.get("queryStringParameters") or {}).get("userId")

    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing userId"})
        }

    try:
        response = points_table.get_item(Key={"userId": user_id})
        item = response.get("Item")

        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": f"No points found for user {user_id}"})
            }

        # Return name + points + history
        return {
            "statusCode": 200,
            "body": json.dumps(item, default=decimal_default)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
