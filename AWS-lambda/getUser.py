import boto3
import json

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")

def lambda_handler(event, context):
    user_id = event.get("queryStringParameters", {}).get("userId")

    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing userId"})
        }

    response = table.get_item(Key={"userId": user_id})

    if "Item" not in response:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "User not found"})
        }

    return {
        "statusCode": 200,
        "body": json.dumps(response["Item"])
    }
