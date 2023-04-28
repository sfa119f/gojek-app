import { GopayModel } from "./model";
import { Gopay, GopayDoc } from "./schema";

export class GopayService {
  static async register(idUser: string): Promise<any> {
    try {
      const gopay = { idUser: idUser } as GopayModel
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
      const foundGopay: GopayDoc | void = await Gopay.findOne({ idUser: idUser })
      if (!foundGopay) {
        throw new Error('idUser not found')
      }
      return { data: foundGopay.transform(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async updateBalanceGopay(idUser: string, balance: number): Promise<any> {
    try {
      if (balance === 0) {
        throw new Error('no balance updates')
      }
      const foundGopay: GopayDoc | void = await Gopay.findOne({ idUser: idUser })
      if (!foundGopay) {
        throw new Error('idUser not found')
      }
      let newBalance = foundGopay.addBalanceGopay(balance)
      if (!newBalance) {
        throw new Error('insufficient balance')
      }
      const updateGopay: GopayDoc = 
        await Gopay.findOneAndUpdate( { idUser: idUser }, { gopay: newBalance }, { new: true })
      return { data: updateGopay.transform(), error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  static async updateToGopayPlus(idUser: string): Promise<any> {
    const foundGopay: GopayDoc | void = await Gopay.findOne({ idUser: idUser })
    if (!foundGopay) {
      throw new Error('idUser not found')
    }
    if (foundGopay.isGopayPlus) {
      throw new Error('already GopayPlus')
    }
    const updateGopay: GopayDoc = 
        await Gopay.findOneAndUpdate( { idUser: idUser }, { isGopayPlus: true }, { new: true })
      return { data: updateGopay.transform(), error: null }
  } 

  static async deleteOne(idUser: string): Promise<any> {
    try {
      const deleteGopay: GopayDoc | void = await Gopay.findOneAndDelete({ idUser: idUser })
      if (!deleteGopay) {
        throw new Error('idUser not found')
      }
      return { data: { deletedId: idUser }, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }
}
