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
      if (setSearch['paymentMin']) selection['payment']['$gte'] = setSearch['paymentMin']
      if (setSearch['paymentMax']) selection['payment']['$lte'] = setSearch['paymentMax']
      if (setSearch['updatedAt']) {
        const month = Number(setSearch['updatedAt'].substring(4))
        const year = Number(setSearch['updatedAt'].substring(0, 4))
        const nextMonth = month + 1 > 12 ? 1 : month + 1
        const nextYear = nextMonth === month + 1 ? year : year + 1
        selection['updatedAt']['gte'] = new Date(year, month, 1)
        selection['updatedAt']['lt'] = new Date(nextYear, nextMonth, 1)
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
}
