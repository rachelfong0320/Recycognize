import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
brands_table = dynamodb.Table("brandUser")

# Helper to convert Decimal to float for JSON
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    # Get brandId from path parameters
    user_id = event.get("pathParameters", {}).get("userId")
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "userId is required"})
        }
    
    try:
        response = brands_table.get_item(Key={"userId": user_id})
        item = response.get("Item")
        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "User not found"})
            }
        return {
            "statusCode": 200,
            "body": json.dumps(item, default=decimal_default)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
