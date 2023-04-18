import * as dotenv from 'dotenv'
import express from 'express';
import { DBHelper } from '@gojek-app/database'
import cors from "cors";
import bodyParser from 'body-parser';

dotenv.config();

DBHelper.init();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
