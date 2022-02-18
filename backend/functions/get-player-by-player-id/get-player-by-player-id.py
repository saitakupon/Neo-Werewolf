import boto3
from boto3.dynamodb.conditions import Key
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'player'
    playerId = event['pathParameters']['player_id']

    player_res = dynamo_client.get_item(
        TableName=table_name,
        Key={'playerId': {'S': playerId}}
    )

    res = {
        'playerId': player_res['Item']['playerId']['S'],
        'name': player_res['Item']['name']['S'],
        'room': player_res['Item']['room']['S'],
        'role': player_res['Item']['role']['S'],
        'location': player_res['Item']['location']['S'],
        'status': player_res['Item']['status']['N'],
        'voted': player_res['Item']['voted']['N'],
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
