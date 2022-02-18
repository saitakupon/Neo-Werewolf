import json
import boto3
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'role'

    cardNum = event['pathParameters']['card_num']
    playerId = event['pathParameters']['player_id']
    roomId = event['pathParameters']['room_id']
    current = event['pathParameters']['current']

    roles_res = dynamo_client.query(
        TableName=table_name,
        KeyConditionExpression='roleId = :partitionkeyval',
        ExpressionAttributeValues={
            ":partitionkeyval": {"S": roomId}
        },
        ScanIndexForward=False
    )
    roles_res = roles_res['Items']

    for role_res in roles_res:
        if int(role_res['cardNum']['N']) == int(cardNum):
            tmp = {
                'roleId': role_res['roleId'],
                'cardNum': role_res['cardNum'],
                'name': role_res['name'],
                'owner': {'S': playerId},
                'status': role_res['status'],
                'timestamp': role_res['timestamp']
            }
            dynamo_client.put_item(TableName=table_name, Item=tmp)
            room_res = dynamo_client.get_item(
                TableName='room',
                Key={'roomId': {'S': roomId}}
            )
            input_dict = room_res['Item']
            input_dict.update(
                {'status': {'N': str(int(input_dict['status']['N']) + 1)}})
            dynamo_client.put_item(TableName='room', Item=input_dict)

        else:
            if role_res['owner']['S'] == current:
                player_res = dynamo_client.get_item(
                    TableName='player',
                    Key={'playerId': {'S': current}}
                )
                input_dict = {
                    'playerId': player_res['Item']['playerId'],
                    'name': player_res['Item']['name'],
                    'room': player_res['Item']['room'],
                    'role': {'S': role_res['name']['S']},
                    'location': player_res['Item']['location'],
                    'status': {'N': str(-1 * int(player_res['Item']['status']['N']))},
                    'voted': player_res['Item']['voted'],
                }
                _ = dynamo_client.put_item(TableName='player', Item=input_dict)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    }
