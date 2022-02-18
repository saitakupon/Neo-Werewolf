import boto3
from boto3.dynamodb.conditions import Key
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'room'
    roomId = event['pathParameters']['room_id']

    room_res = dynamo_client.get_item(
        TableName=table_name,
        Key={'roomId': {'S': roomId}}
    )

    res = {
        'roomId': room_res['Item']['roomId']['S'],
        'createdBy': room_res['Item']['createdBy']['S'],
        'maxNum': room_res['Item']['maxNum']['N'],
        'playerNum': room_res['Item']['playerNum']['N'],
        'players': room_res['Item']['players']['SS'],
        'status': room_res['Item']['status']['N'],
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        },
        'body': json.dumps(res)
    }
