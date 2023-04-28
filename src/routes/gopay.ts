import express from 'express'
import { auth } from '@gojek-app/auth'
import { GopayHandler } from '@gojek-app/gopay'

export const gopayRoute = express.Router()

gopayRoute.post('/:idUser', auth, GopayHandler.register)

gopayRoute.get('/', auth, GopayHandler.getAll)

gopayRoute.get('/:idUser', auth, GopayHandler.getOne)

gopayRoute.put('/balance', auth, GopayHandler.updateBalanceGopay)

gopayRoute.put('/gopayPlus/:idUser', auth, GopayHandler.updateToGopayPlus)

gopayRoute.delete('/:idUser', auth, GopayHandler.deleteOne)
