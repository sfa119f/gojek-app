import { error } from "console";
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
      const foundUser = await User.findOne({ email: email })
      if (!foundUser) {
        throw new Error('email or password is not correct')
      }

      const isMatch = bcrypt.compareSync(password, foundUser.password)
      if (!isMatch) {
        throw new Error('email or password is not correct')
      }
      return { data: foundUser.getToken(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async getAll(): Promise<any> {
    try {
      const users: UserDoc[] | void = await User.find()
      const temp = (users || []).map((user: UserDoc) => user.transform())
      return { data: temp, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async getOne(id: string): Promise<any> {
    try {
      const foundUser: UserDoc | void = await User.findById(id);
      if (!foundUser) {
        throw new Error('id not found')
      }
      return { data: foundUser.transform(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async deleteOne(id: string): Promise<any> {
    try {
      const deleteUser: UserDoc | void = await User.findByIdAndDelete(id)
      if (!deleteUser) {
        throw new Error()
      }
      return { data: { deletedId: id }, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}
