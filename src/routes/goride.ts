import express from 'express';
import { auth } from '@gojek-app/auth';
import { GorideHandler } from '@gojek-app/goride'

export const gorideRoute = express.Router()

gorideRoute.post('/', auth, GorideHandler.create)

gorideRoute.get('/', auth, GorideHandler.getAll)

gorideRoute.get('/:id', auth, GorideHandler.getOne)
