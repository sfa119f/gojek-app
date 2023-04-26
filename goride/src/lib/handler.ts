import { CustomRequest } from '@gojek-app/auth'
import { GorideService } from './service'

export class GorideHandler {
  static async create(req: CustomRequest, res) {
    if (!req.token['id']) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    if (req.token['role'] !== 'USER') {
      return res.status(401).json({ data: null, error: 'only accept USER role' })
    }
    const body = req.body
    body['id_user'] = req.token['id']
    const temp = await GorideService.create(req.body)
    if (temp.error) {
      console.error(temp.error)
      temp.error = 'something went wrong'
      return res.status(500).json(temp)
    }
    return res.status(201).json(temp)
  }
}
