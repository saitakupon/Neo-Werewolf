import boto3
from boto3.dynamodb.conditions import Key
import json
import time
import random
import role_list


def lambda_handler(event, context):
    dynamo_client = boto3.client('dynamodb', region_name='ap-northeast-1')
    table_name = 'room'
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('role')
    roomId = str(int(time.time()))
    createdBy = event['pathParameters']['created_by']
    maxNum = event['pathParameters']['max_num']
    playerNum = '0'
    status = '0'
    timestamp = str(int(roomId) + 3600)
    roles = role_list.list
    if int(maxNum) == 3:
        roles.pop(4)
    else:
        roles = role_list.list
    random_roles = random.sample(roles, len(roles))
    with table.batch_writer() as batch:
        for i in range(len(random_roles)):
            tmp = {
                'roleId': roomId,
                'cardNum': i,
                'name': random_roles[i]['name'],
                'owner': "none",
                'status': random_roles[i]['status'],
                'timestamp': int(timestamp)
            }
            batch.put_item(Item=tmp)
    input_dict = {
        'roomId': {'S': roomId},
        'createdBy': {'S': createdBy},
        'maxNum': {'N': maxNum},
        'playerNum': {'N': playerNum},
        'status': {'N': status},
        'timestamp': {'N': timestamp}
    }
    dynamo_client.put_item(TableName=table_name, Item=input_dict)
    res = {
        'roomId': roomId
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
