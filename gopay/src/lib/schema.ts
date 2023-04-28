import { model, Schema, Model, Document } from 'mongoose';

export interface GopayDoc extends Document {
  idUser: string;
  gopay: number;
  isGopayPlus: boolean;
  createdAt: Date;
  updatedAt: Date;
  transform(): Transformed;
  addBalanceGopay(balance): number;
}

interface GopayStaticFunc extends Model<GopayDoc> {
  checkDuplicateError(err: any): any;
}

const transformFields = [
  "idUser", "gopay", "isGopayPlus", "updatedAt"
] as const;

type Transformed = Pick<GopayDoc, (typeof transformFields)[number]>

const gopaySchema: Schema = new Schema({
  idUser: { type: String, required: true },
  gopay: { type: Number, default: 0 },
  isGopayPlus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

gopaySchema.index({ idUser: 1 }, { unique: true })

gopaySchema.methods.transform = function (): Transformed {
  const { idUser, gopay, isGopayPlus, updatedAt } = this;
  return { idUser, gopay, isGopayPlus, updatedAt }
}

gopaySchema.methods.addBalanceGopay = function (balance: number): number {
  return this.gopay += balance
}

gopaySchema.statics = {
  checkDuplicateError(err: any) {
    if (err.code === 11000) {
      const error = new Error(`data already taken on ${Object.keys(err.keyValue)[0]}`);
      return error
    }
    return err
  },
}

export const Gopay = model<GopayDoc, GopayStaticFunc>("Gopay", gopaySchema)
