import json
import boto3
import datetime

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table("Users")

def lambda_handler(event, context):
    # Cognito passes user attributes in the event
    user_id = event["userName"]        # Cognito sub
    email = event["request"]["userAttributes"]["email"]
    name = event["request"]["userAttributes"].get("name", "")
    role = "consumer"                  # default role
    
    users_table.put_item(Item={
        "userId": user_id,
        "email": email,
        "name": name,
        "role": role,
        "createdAt": datetime.datetime.utcnow().isoformat() + "Z"
    })
    
    return event  # Cognito needs this return for triggers
