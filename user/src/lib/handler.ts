import { UserService } from "./service";
import { CustomRequest } from '@gojek-app/auth'

export class UserHandler {
  static async register(req, res) {
    const temp = await UserService.register(req.body)
    if (temp.error) {
      if (temp.error.includes("data already taken")) {
        return res.status(400).json(temp)
      }
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
      return res.status(500).json(temp)
    }
    return res.status(200).json(temp);
  }
}