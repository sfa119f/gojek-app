import express from 'express';
import { auth } from '@gojek-app/auth';
import { UserHandler } from '@gojek-app/user'

export const userRoute = express.Router()

userRoute.get('/:searchField?', auth, UserHandler.getAll)

userRoute.get('/:id', auth, UserHandler.getOne)

userRoute.put('/', auth, UserHandler.updateOne)

userRoute.delete('/:id', auth, UserHandler.deleteOne)
