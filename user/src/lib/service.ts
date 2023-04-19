import { UserModel } from "./model";
import { User, UserDoc } from "./schema";
import bcrypt from 'bcrypt';

export class UserService {
  static async register(user: UserModel): Promise<any> {
    try {
      const newUser: UserDoc = await User.create(user)
      const data = newUser.getToken()
      return { data: data, error: null }
    } catch (err) {
      return { data: null, error: User.checkDuplicateError(err).message }
    }
  }

  static async login(email: string, password: string): Promise<any> {
    try {
      const foundUser = await User.findOne({ email: email });
      if (!foundUser) {
        throw new Error('email or password is not correct')
      }

      const isMatch = bcrypt.compareSync(password, foundUser.password)
      if (isMatch) {
        const data = foundUser.getToken()
        return { data: data, error: null }
      } else {
        throw new Error('email or password is not correct')
      }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}