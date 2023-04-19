import express from 'express';
import { UserHandler } from '@gojek-app/user'

export const userRoute = express.Router()

userRoute.post('/register', UserHandler.register);

userRoute.post('/login', UserHandler.login);
