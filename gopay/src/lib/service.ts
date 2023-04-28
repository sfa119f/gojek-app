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
}
