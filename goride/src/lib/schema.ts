import { Document, Schema, model } from 'mongoose';
import { paymentList, statusList } from './model';

export interface GorideDoc extends Document {
  id: string;
  id_user: string;
  id_driver: string;
  from: string;
  to: string;
  trip_fee: number;
  app_fee: number;
  payment: string;
  status: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  transform(): Transformed;
  total(): number;
}

const transformFields = [
  'id', 'id_user', 'id_driver', 'from', 'to', 'total', 'payment', 'status', 'rating', 'createdAt', 'updatedAt'
] as const;

type Transformed = Pick<GorideDoc, (typeof transformFields)[number]>

const gorideSchema: Schema = new Schema({
  id_user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  id_driver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  from: { type: String, require: true },
  to: { type: String, require: true },
  trip_fee: { type: Number, require: true },
  app_fee: { type: Number, default: 3000 },
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
  const { id, id_user, id_driver, from, to, total, payment, status, rating, createdAt, updatedAt } = this
  return { id, id_user, id_driver, from, to, total, payment, status, rating, createdAt, updatedAt }
}

export const Goride = model<GorideDoc>('Goride', gorideSchema)
