import { Request, Response, Router } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import bodyParser from 'body-parser';
import authenticateToken from '../../middleware/authenticateToken';

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'users';

router.get(
  '/',
  authenticateToken,
  function (request: Request, response: Response) {
    return response.send(200);
  }
);

export default router;
