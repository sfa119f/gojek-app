import { CustomRequest } from '@gojek-app/auth'
import { GopayService } from './service'
import { GopayModel } from './model'

export class GopayHandler {
  static async register(req: CustomRequest, res) {
    if (req.token['id'] !== req.params.idUser || (req.token['role'] !== 'USER' && req.token['role'] !== 'DRIVER')) {
      return res.status(401).json({ data: null, error: 'unauthorized' })
    }
    const data = { idUser: req.params.idUser } as GopayModel
    const temp = await GopayService.register(data)
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
}
