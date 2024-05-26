import express from 'express';
import serverless from 'serverless-http';
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use('/', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', function (request, response) {
  response.send('Я живой!!!');
});

export const handler = serverless(app);
