import boto3
import json


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'player'
    roomId: str = event['pathParameters']['room_id']

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

    res = []
    for player_res in players_res:
        tmp = {
            'playerId': player_res['playerId']['S'],
            'name': player_res['name']['S'],
            'room': player_res['room']['S'],
            'role': player_res['role']['S'],
            'location': player_res['location']['S'],
            'status': player_res['status']['N'],
            'voted': player_res['voted']['N'],
        }
        res.append(tmp)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        },
        'body': json.dumps(res)
    }
