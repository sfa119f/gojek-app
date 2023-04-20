import { pagination } from '@gojek-app/database'
import { UserModel, searchField } from "./model";
import { UserService } from "./service";
import { CustomRequest } from '@gojek-app/auth'

export class UserHandler {
  static async register(req, res) {
    const temp = await UserService.register(req.body)
    if (temp.error) {
      if (temp.error.includes("data already taken")) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(201).json(temp)
  }

  static async login(req, res) {
    const temp = await UserService.login(req.body.email, req.body.password)
    if (temp.error) {
      if (temp.error.includes("is not correct")) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async getAll(req: CustomRequest, res) {
    if (req.token['role'] !== 'ADMIN') {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    } 
    const field = req.params.searchField
    if (field && !searchField.includes(field)) {
      return res.status(400).json({ data: null, error: `cannot search for field ${field}` })
    }
    const setSearch = {
      field: field,
      qSearch: req.query.search
    }
    const setPage = pagination(
      req.query.page,
      req.query.size,
      req.query.orderBy,
      req.query.desc
    )
    const temp = await UserService.getAll(setSearch, setPage)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }

  static async getOne(req: CustomRequest, res) {
    if (req.token['role'] !== 'ADMIN' && req.token['id'] !== req.params.id) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    } 
    const temp = await UserService.getOne(req.params.id)
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

  static async updateOne(req: CustomRequest, res) {
    if (req.token['id'] !== req.body.id) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const newData: UserModel = req.body.newData
    Object.keys(newData).forEach(key => {
      if (!newData[key]) {
        delete newData[key]
      }
    });
    const temp = await UserService.updateOne(req.body.id, req.body.oldPassword, newData)
    if (temp.error) {
      const errMessage = ['password', 'role is not allowed', 'data already taken']
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
    if (req.token['id'] !== req.params.id) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const temp = await UserService.deleteOne(req.params.id)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }
}
