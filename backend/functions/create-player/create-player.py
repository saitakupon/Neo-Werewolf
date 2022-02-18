import boto3
from boto3.dynamodb.conditions import Key
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'player'

    playerId = event['pathParameters']['player_id']
    room = event['pathParameters']['room_id']

    user_res = dynamo_client.get_item(
        TableName='user',
        Key={'uid': {'S': playerId}}
    )
    name = user_res['Item']['name']['S']
    location = user_res['Item']['name']['S'] + 'の部屋'
    voted = '0'

    room_res = dynamo_client.get_item(
        TableName='room',
        Key={'roomId': {'S': room}}
    )
    input_dict = room_res['Item']
    players = []
    if int(input_dict['playerNum']['N']) != 0:
        players = input_dict['players']['SS']
    players.append(playerId)
    input_dict.update(
        {'playerNum': {'N': str(int(input_dict['playerNum']['N']) + 1)}})
    input_dict.update({'players': {'SS': players}})

    role_res = dynamo_client.get_item(
        TableName='role',
        Key={
            'roleId': {'S': room},
            'cardNum': {'N': input_dict['playerNum']['N']}
        }
    )

    dynamo_client.put_item(
        TableName='role',
        Item={
            'roleId': role_res['Item']['roleId'],
            'cardNum': role_res['Item']['cardNum'],
            'name': role_res['Item']['name'],
            'owner': {'S': playerId},
            'status': role_res['Item']['status'],
            'timestamp': role_res['Item']['timestamp']
        }
    )

    if input_dict['playerNum']['N'] == "1":
        origin_role_res = dynamo_client.get_item(
            TableName='role',
            Key={
                'roleId': {'S': room},
                'cardNum': {'N': "0"}
            }
        )
        _ = dynamo_client.put_item(
            TableName='role',
            Item={
                'roleId': origin_role_res['Item']['roleId'],
                'cardNum': origin_role_res['Item']['cardNum'],
                'name': origin_role_res['Item']['name'],
                'owner': {'S': playerId},
                'status': origin_role_res['Item']['status'],
                'timestamp': origin_role_res['Item']['timestamp']
            }
        )

    item = {
        'playerId': {'S': playerId},
        'name': {'S': name},
        'room': {'S': room},
        'role': {'S': role_res['Item']['name']['S']},
        'location': {'S': location},
        'status': {'N': input_dict['playerNum']['N']},
        'voted': {'N': voted}
    }
    _ = dynamo_client.put_item(TableName=table_name, Item=item)

    if int(input_dict['playerNum']['N']) == int(input_dict['maxNum']['N']):
        input_dict.update({'status': {'N': '1'}})
    _ = dynamo_client.put_item(TableName='room', Item=input_dict)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    }
