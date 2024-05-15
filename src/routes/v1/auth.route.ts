import { Router } from 'express';
import uuid4 from 'uuid4';
import md5 from 'md5';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import bodyParser from 'body-parser';

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'users';

router.post('/login', function (request, response) {
  return response.send(200);
});

router.post('/register', async function (request, response) {
  if (!request.body.email || !request.body.password) {
    return response.send(422);
  }

  const existingUser = await dynamo
    .send(
      new QueryCommand({
        TableName: tableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :e',
        ExpressionAttributeValues: { ':e': request.body.email },
      })
    )
    .then((data) => {
      console.log('data');
      console.log(data);
      return data.Items?.[0];
    })
    .catch((e) => {
      return response.status(500).send(e);
    });

  if (existingUser) {
    return response.send(409);
  }

  await dynamo
    .send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: uuid4().toString(),
          email: request.body.email,
          password: md5(request.body.password),
        },
      })
    )
    .catch((e) => {
      return response.status(500).send(e);
    });

  return response.send(200);
});

export default router;
