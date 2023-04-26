import * as dotenv from 'dotenv'
import express from 'express';
import { DBHelper } from '@gojek-app/database'
import cors from "cors";
import bodyParser from 'body-parser';
import { authRoute } from './routes/auth';
import { userRoute } from './routes/user';
import { gorideRoute } from './routes/goride';

dotenv.config();

DBHelper.init();

const host = process.env.APP_HOST ?? 'localhost';
const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3333;

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api/auth', authRoute)

app.use('/api/users', userRoute)

app.use('/api/goride', gorideRoute)

app.all('*', (req, res) => {
  res.status(404).json({ data: null, error: 'not found'})
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
