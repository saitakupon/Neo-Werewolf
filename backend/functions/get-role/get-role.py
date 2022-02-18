import json
import boto3


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'role'

    playerId = event['pathParameters']['player_id']
    roomId = event['pathParameters']['room_id']

    roles_res = dynamo_client.query(
        TableName=table_name,
        KeyConditionExpression='roleId = :partitionkeyval',
        ExpressionAttributeValues={
            ":partitionkeyval": {"S": roomId}
        },
        ScanIndexForward=False
    )
    roles_res = roles_res['Items']

    res = []
    for role_res in roles_res:
        if role_res['owner']['S'] == playerId:
            tmp = {
                'roleId': role_res['roleId']['S'],
                'cardNum': role_res['cardNum']['N'],
                'name': role_res['name']['S'],
                'owner': role_res['owner']['S'],
                'status': role_res['status']['N'],
                'timestamp': role_res['timestamp']['N']
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
