import express from 'express';
import { UserHandler } from '@gojek-app/user'

export const authRoute = express.Router()

authRoute.post('/register', UserHandler.register);

authRoute.post('/login', UserHandler.login);
