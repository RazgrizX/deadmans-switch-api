import { Router } from 'express';
import uuid4 from 'uuid4';
import md5 from 'md5';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import bodyParser from 'body-parser';
import generateAccessToken from '../../utils/generateAccessToken';
import { User } from '../../types/user';

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'users';

router.post('/login', async function (request, response) {
  if (!request.body.email || !request.body.password) {
    return response.sendStatus(422);
  }

  try {
    const existingUser = await dynamo
      .send(
        new QueryCommand({
          TableName: tableName,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :e',
          FilterExpression: 'password = :p',
          ExpressionAttributeValues: {
            ':e': request.body.email,
            ':p': md5(request.body.password),
          },
        })
      )
      .then((data) => {
        return data.Items?.[0] as User | undefined;
      });

    if (!existingUser) {
      return response.sendStatus(404);
    }

    const token = generateAccessToken(existingUser.id);
    return response.json(token);
  } catch (e) {
    response.status(500).send(e);
  }
});

router.post('/register', async function (request, response) {
  if (!request.body.email || !request.body.password) {
    return response.sendStatus(422);
  }

  try {
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
        return data.Items?.[0] as User | undefined;
      });

    if (existingUser) {
      return response.sendStatus(409);
    }

    const uuid = uuid4().toString();
    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: uuid,
          email: request.body.email,
          password: md5(request.body.password),
        },
      })
    );

    const token = generateAccessToken(uuid);
    return response.json(token);
  } catch (e) {
    return response.status(500).send(e);
  }
});

export default router;
