import express from 'express'
import { auth } from '@gojek-app/auth'
import { GopayHandler } from '@gojek-app/gopay'

export const gopayRoute = express.Router()

gopayRoute.post('/:idUser', auth, GopayHandler.register)

gopayRoute.get('/', auth, GopayHandler.getAll)
