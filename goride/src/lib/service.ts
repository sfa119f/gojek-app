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
}
