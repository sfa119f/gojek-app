import { UserModel } from "./model";
import { User, UserDoc } from "./schema";
import bcrypt from 'bcrypt';
import { GopayService } from '@gojek-app/gopay'

export class UserService {
  static async register(user: UserModel, withGopay: boolean): Promise<any> {
    try {
      const newUser: UserDoc = await User.create(user)
      const data = newUser.getToken()
      let newGopay = null
      if (withGopay && (newUser.role === 'USER' || newUser.role === 'DRIVER')) {
        newGopay = await GopayService.register(newUser.id) 
      }
      if (!newGopay) {
        data['withGopay'] = false
      } else {
        data['withGopay'] = true
      }
      return { data: data, error: null }
    } catch (err) {
      return { data: null, error: User.checkDuplicateError(err).message }
    }
  }

  static async login(email: string, password: string): Promise<any> {
    try {
      const foundUser: UserDoc = await User.findOne({ email: email })
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

  static async getAll(setSearch: any, setPage: any): Promise<any> {
    try {
      const selection = {}
      Object.keys(setSearch).forEach(key => {
        if (key.includes('phone')) {
          if (setSearch[key]) selection[key] = Number(setSearch[key])
        } else {
          selection[key] = new RegExp(setSearch[key], 'i')
        }
      })
      const orderBy = `${setPage.desc ? '-' : ''}${setPage.orderBy}`
      const users: UserDoc[] | void = 
        await User
          .find(selection)
          .skip((setPage.page - 1) * setPage.size)
          .limit(setPage.size)
          .sort(orderBy)
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

  static async updateOne(id: string, oldPassword: string, newData: any): Promise<any> {
    try {
      if (oldPassword && newData['password']) {
        const foundUser = await User.findById(id)
        const isMatch = bcrypt.compareSync(oldPassword, foundUser.password)
        if (!isMatch) {
          throw new Error('old password is not correct')
        }
        if (!newData['password']) {
          throw new Error('new password is required')
        }
      } else {
        delete newData['password']
      }
      if (Object.keys(newData).length === 0 && newData.constructor === Object) {
        throw new Error('no updated data')
      }
      const updatedUser: UserDoc = await User.findByIdAndUpdate(id, newData, { new: true })
      if (!updatedUser) {
        throw new Error()
      }
      return { data: { message: 'update successfully' }, error: null }
    } catch (err) {
      if (err.message === 'no updated data') {
        return { data: { message:  err.message }, error: null }
      }
      return { data: null, error: User.checkDuplicateError(err).message }
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
