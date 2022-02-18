import boto3
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'player'
    roomId: str = event['pathParameters']['room_id']

# ---------------------------------------------------------------
    players_res = dynamo_client.query(
        TableName=table_name,
        IndexName='room-index',
        KeyConditionExpression='room = :partitionkeyval',
        ExpressionAttributeValues={
            ":partitionkeyval": {"S": roomId}
        },
        ScanIndexForward=False
    )
    players_res = players_res['Items']
    players = []
    for player_res in players_res:
        tmp = {
            'playerId': player_res['playerId']['S'],
            'name': player_res['name']['S'],
            'room': player_res['room']['S'],
            'role': player_res['role']['S'],
            'location': player_res['location']['S'],
            'status': int(player_res['status']['N']),
            'voted': int(player_res['voted']['N']),
        }
        players.append(tmp)
# ---------------------------------------------------------------
    room_res = dynamo_client.get_item(
        TableName='room',
        Key={'roomId': {'S': roomId}}
    )
    hallVoted = int(room_res['Item']['maxNum']["N"])
    max = {
        'playerId': '',
        'location': '',
        'voted': 0,
        'role': ''
    }
    for player in players:
        hallVoted = hallVoted - player['voted']
        if player['voted'] > max['voted']:
            max.update({
                'playerId': player['playerId'],
                'location': player['location'],
                'voted': player['voted']
            })
    if hallVoted > max['voted']:
        max.update({
            'playerId': 'hall',
            'location': '集会場',
            'voted': hallVoted
        })

# ---------------------------------------------------------------
    roles_res = dynamo_client.query(
        TableName='role',
        KeyConditionExpression='roleId = :partitionkeyval',
        ExpressionAttributeValues={
            ":partitionkeyval": {"S": roomId}
        },
        ScanIndexForward=False
    )
    roles_res = roles_res['Items']

    roles = []
    for role_res in roles_res:
        if role_res['owner']['S'] == max['playerId']:
            tmp = {
                'roleId': role_res['roleId']['S'],
                'cardNum': int(role_res['cardNum']['N']),
                'name': role_res['name']['S'],
                'owner': role_res['owner']['S'],
                'status': int(role_res['status']['N']),
                'timestamp': int(role_res['timestamp']['N'])
            }
            roles.append(tmp)

    result = ""
    if roles[0]['status'] == 1:
        result = "村人側の勝利！"
    else:
        result = "人狼側の勝利！"

    res = {
        'location': max['location'],
        'role': roles[0]['name'],
        'result': result
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
