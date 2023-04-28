import { GorideModel } from "./model";
import { Goride, GorideDoc } from "./schema";

export class GorideService {
  static async create(goride: GorideModel): Promise<any> {
    try {
      const newGoride: GorideDoc = await Goride.create(goride)
      return { data: newGoride.transform(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async getAll(setSearch: any, setPage: any): Promise<any> {
    try {
      const selection = {}
      if (setSearch['idUser']) selection['idUser'] = setSearch['idUser']
      if (setSearch['idDriver']) selection['idDriver'] = setSearch['idDriver']
      if (setSearch['tripFeeMin']) {
        const gte = { $gte: Number(setSearch['tripFeeMin'])}
        selection['tripFee'] = { ...selection['tripFee'], ...gte }
      }
      if (setSearch['tripFeeMax']) {
        const lte = { $lte: Number(setSearch['tripFeeMax'])}
        selection['tripFee'] = { ...selection['tripFee'], ...lte }
      }
      if (setSearch['updatedAt']) {
        const month = Number(setSearch['updatedAt'].substring(4))
        const year = Number(setSearch['updatedAt'].substring(0, 4))
        const monthBefore = month - 1 < 1 ? 12 : month - 1
        const yearBefore = monthBefore === month - 1 ? year : year - 1
        const gt = { $gt: new Date(yearBefore, monthBefore)}
        selection['updatedAt'] = { ...selection['updatedAt'], ...gt }
        const lte = { $lte: new Date(year, month) }
        selection['updatedAt'] = { ...selection['updatedAt'], ...lte }
      }
      const orderBy = `${setPage.desc ? '-' : ''}${setPage.orderBy}`
      const gorides: GorideDoc[] | void = 
        await Goride
          .find(selection)
          .skip((setPage.page - 1) * setPage.size)
          .limit(setPage.size)
          .sort(orderBy)
      const temp = (gorides || []).map((goride: GorideDoc) => goride.transform())
      return { data: temp, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async getOne(id: string): Promise<any> {
    try {
      const foundGoride: GorideDoc | void = await Goride.findById(id)
      if (!foundGoride) {
        throw new Error('id not found')
      }
      const doc = { id: foundGoride['_id'], ...foundGoride['_doc'] }
      delete doc['_id']
      delete doc['__v']
      return { data: doc, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async updateOne(idUser: string, role: string, id: string, newData: any): Promise<any> {
    try {
      if (Object.keys(newData).length === 0 && newData.constructor === Object) {
        throw new Error('no updated data')
      }
      const updatedGoride: GorideDoc = await Goride.findByIdAndUpdate(id, newData, { new: true })
      if (!updatedGoride) {
        throw new Error()
      }
      if (role === 'USER') {
        if (idUser !== updatedGoride.idUser.toString()) {
          return new Error('unauthorized')
        }
      } else if (role === 'DRIVER') {
        if (idUser !== updatedGoride.idDriver.toString()) {
          return new Error('unauthorized')
        }
      }
      return { data: { message: 'update successfully' }, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async deleteOne(idUser: string, id: string): Promise<any> {
    try {
      const data: GorideDoc | void = await Goride.findById(id)
      if (!data) {
        throw new Error('id not found')
      }
      if (idUser !== data.idUser.toString()) {
        throw new Error('unauthorized')
      }
      const deleteGoride = await Goride.deleteOne({ _id: id })
      if (!deleteGoride) {
        throw new Error()
      }
      return { data: { deletedId: id }, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}
