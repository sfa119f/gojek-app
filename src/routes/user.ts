import express from 'express';
import { auth } from '@gojek-app/auth';
import { UserHandler } from '@gojek-app/user'

export const userRoute = express.Router()

userRoute.get('/', auth, UserHandler.getAll)
