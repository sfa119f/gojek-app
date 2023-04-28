import { pagination } from '@gojek-app/database'
import { CustomRequest } from '@gojek-app/auth'
import { GopayService } from './service'
import { searchField } from './model'

export class GopayHandler {
  static async register(req: CustomRequest, res) {
    if (req.token['id'] !== req.params.idUser || (req.token['role'] !== 'USER' && req.token['role'] !== 'DRIVER')) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const temp = await GopayService.register(req.params.idUser)
    if (temp.error) {
      const errMessage = ['required', 'data already taken']
      if (errMessage.map((msg) => temp.error.includes(msg)).includes(true)) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(201).json(temp)
  }

  static async getAll(req: CustomRequest, res) {
    if (req.token['role'] !== 'ADMIN') {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const setSearch = {}
    searchField.forEach(el => {
      setSearch[el] = req.query[el]
    })
    const setPage = pagination(
      req.query.page,
      req.query.size,
      req.query.orderBy,
      req.query.desc
    )
    const temp = await GopayService.getAll(setSearch, setPage)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async getOne(req: CustomRequest, res) {
    if (req.token['role'] !== 'ADMIN' && req.token['id'] !== req.params.idUser) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    } 
    const temp = await GopayService.getOne(req.params.idUser)
    if (temp.error) {
      if (temp.error.includes('not found')) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async updateBalanceGopay(req: CustomRequest, res) {
    if (req.token['id'] !== req.body.idUser) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const temp = await GopayService.updateBalanceGopay(req.body.idUser, Number(req.body.balance))
    if (temp.error) {
      const errMessage = ['no balance updates', 'not found', 'insufficient balance']
      if (errMessage.map((msg) => temp.error.includes(msg)).includes(true)) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async updateToGopayPlus(req: CustomRequest, res) {
    if (req.token['id'] !== req.params.idUser) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const temp = await GopayService.updateToGopayPlus(req.params.idUser)
    if (temp.error) {
      const errMessage = ['not found', 'already GopayPlus']
      if (errMessage.map((msg) => temp.error.includes(msg)).includes(true)) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async deleteOne(req: CustomRequest, res) {
    if (req.token['id'] !== req.params.idUser) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const temp = await GopayService.deleteOne(req.params.idUser)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }
}
