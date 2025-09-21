import json
import boto3
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
scan_table = dynamodb.Table("ScanRecords")

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    # Get query parameters
    params = event.get("queryStringParameters", {}) or {}
    brand = params.get("brand")

    # Build filter expression only for brand
    filter_expr = Attr("brand").eq(brand.lower()) if brand else None

    # Scan DynamoDB
    if filter_expr:
        resp = scan_table.scan(FilterExpression=filter_expr)
    else:
        resp = scan_table.scan()

    items = resp.get("Items", [])

    return {
        "statusCode": 200,
        "body": json.dumps(items, default=decimal_default)
    }
