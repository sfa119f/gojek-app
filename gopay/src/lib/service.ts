import { GopayModel } from "./model";
import { Gopay, GopayDoc } from "./schema";

export class GopayService {
  static async register(gopay: GopayModel): Promise<any> {
    try {
      const newGopay: GopayDoc = await Gopay.create(gopay)
      return { data: newGopay.transform(), error: null }
    } catch (err) {
      return { data: null, error: Gopay.checkDuplicateError(err).message }
    }
  }

  static async getAll(setSearch: any, setPage: any): Promise<any> {
    try {
      const selection = {}
      if (setSearch['gopayMin']) {
        const gte = { $gte: Number(setSearch['gopayMin'])}
        selection['gopay'] = { ...selection['gopay'], ...gte }
      }
      if (setSearch['gopayMax']) {
        const lte = { $lte: Number(setSearch['gopayMax'])}
        selection['gopay'] = { ...selection['gopay'], ...lte }
      }
      if (setSearch['isGopayPlus']) selection['isGopayPlus'] = setSearch['isGopayPlus']
      const orderBy = `${setPage.desc ? '-' : ''}${setPage.orderBy}`
      const gopays: GopayDoc[] | void = 
        await Gopay
          .find(selection)
          .skip((setPage.page - 1) * setPage.size)
          .limit(setPage.size)
          .sort(orderBy)
      const temp = (gopays || []).map((gopay: GopayDoc) => gopay.transform())
      return { data: temp, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async getOne(idUser: string): Promise<any> {
    try {
      const foundGopay: GopayDoc | void = await Gopay.findOne({ idUser: idUser });
      if (!foundGopay) {
        throw new Error('id not found')
      }
      return { data: foundGopay.transform(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}
