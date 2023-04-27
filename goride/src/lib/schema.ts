import { Document, Schema, model } from 'mongoose';
import { paymentList, statusList } from './model';

export interface GorideDoc extends Document {
  id: string;
  idUser: string;
  idDriver: string;
  from: string;
  to: string;
  tripFee: number;
  appFee: number;
  payment: string;
  status: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  transform(): Transformed;
  total(): number;
}

const transformFields = [
  'id', 'idUser', 'idDriver', 'from', 'to', 'total', 'payment', 'status'
] as const;

type Transformed = Pick<GorideDoc, (typeof transformFields)[number]>

const gorideSchema: Schema = new Schema({
  idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  idDriver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  from: { type: String, required: true },
  to: { type: String, required: true },
  tripFee: { type: Number, required: true },
  appFee: { type: Number, default: 3000 },
  payment: { type: String, default: 'CASH' },
  status: { type: String, default: 'LOOKING FOR DRIVER' },
  rating: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

gorideSchema.pre('save', async function (next) {
  this.payment = this.payment.toUpperCase()
  if (!paymentList.includes(this.payment)) {
    return next(new Error(`${this.payment} payment method is not allowed`))
  }
  this.status = this.status.toUpperCase()
  if (!statusList.includes(this.status)) {
    return next(new Error(`${this.status} status is not allowed`))
  }
  if (this.rating !== null && (this.rating < 1 || this.rating > 5)) {
    return next(new Error(`rating only accept number 1-5`))
  }
  return next()
})

gorideSchema.methods.transform = function (): Transformed {
  const { id, idUser, idDriver, from, to, payment, status } = this
  return { id, idUser, idDriver, from, to, total: this.total(), payment, status }
}

gorideSchema.methods.total = function (): Number {
  const { tripFee, appFee } = this
  return tripFee + appFee
}

export const Goride = model<GorideDoc>('Goride', gorideSchema)
