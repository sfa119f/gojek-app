import { pagination } from '@gojek-app/database'
import { CustomRequest } from '@gojek-app/auth'
import { GorideService } from './service'
import { searchField } from './model'

export class GorideHandler {
  static async create(req: CustomRequest, res) {
    if (!req.token['id']) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    if (req.token['role'] !== 'USER') {
      return res.status(401).json({ data: null, error: 'only accept USER role' })
    }
    const body = req.body
    body['idUser'] = req.token['id']
    const temp = await GorideService.create(req.body)
    if (temp.error) {
      if (temp.error.includes('required')) {
        return res.status(400).json(temp)
      }
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(201).json(temp)
  }

  static async getAll(req: CustomRequest, res) {
    if (!req.token['id']) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const setSearch = {}
    searchField.forEach(el => {
      setSearch[el] = req.query[el]
    })
    if (req.token['role'] === 'USER'){
      if (req.query['idUser'] && req.token['id'] !== req.query['idUser']) {
        return res.status(401).json({ data: null, error: 'unauthorized' })
      } else {
        setSearch['idUser'] = req.token['id']
        setSearch['idDriver'] = ''
      }
    } else if (req.token['role'] === 'DRIVER') {
      if (req.query['idDriver'] && req.token['id'] !== req.query['idDriver']) {
        return res.status(401).json({ data: null, error: 'unauthorized' })
      } else {
        setSearch['idUser'] = ''
        setSearch['idDriver'] = req.token['id']
      }
    }
    const setPage = pagination(
      req.query.page,
      req.query.size,
      req.query.orderBy,
      req.query.desc
    )
    const temp = await GorideService.getAll(setSearch, setPage)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp)
  }
}
