import boto3
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'user'
    input_dict = {
        'uid': {'S': event['request']['userAttributes']['sub']},
        'name': {'S': event['userName']}
    }
    dynamo_client.put_item(TableName=table_name, Item=input_dict)

    return event
