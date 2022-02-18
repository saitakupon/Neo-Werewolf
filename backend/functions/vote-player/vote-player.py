import json
import boto3
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')

    playerId = event['pathParameters']['player_id']
    roomId = event['pathParameters']['room_id']

    if playerId != "hall":
        player_res = dynamo_client.get_item(
            TableName='player',
            Key={'playerId': {'S': playerId}}
        )
        input_dict = {
            'playerId': player_res['Item']['playerId'],
            'name': player_res['Item']['name'],
            'room': player_res['Item']['room'],
            'role': player_res['Item']['role'],
            'location': player_res['Item']['location'],
            'status': player_res['Item']['status'],
            'voted': {'N': str(int(player_res['Item']['voted']['N']) + 1)},
        }
        dynamo_client.put_item(TableName='player', Item=input_dict)
    room_res = dynamo_client.get_item(
        TableName='room',
        Key={'roomId': {'S': roomId}}
    )
    input_dict = room_res['Item']
    input_dict.update(
        {'status': {'N': str(int(input_dict['status']['N']) + 1)}})
    dynamo_client.put_item(TableName='room', Item=input_dict)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    }
