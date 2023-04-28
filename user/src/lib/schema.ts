import { model, Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { roleList } from './model';

export interface UserDoc extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneCode: number;
  phone: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  transform(): Transformed;
  getToken(): any;
}

interface UserModel extends Model<UserDoc> {
  checkDuplicateError(err: any): any;
}

const transformFields = [
  "id", "name", "email", "phoneCode", "phone", "role", "createdAt", "updatedAt"
] as const;

type Transformed = Pick<UserDoc, (typeof transformFields)[number]>

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneCode: { type: Number, required: true },
  phone: { type: Number, required: true, unique: true },
  role: { type: String, default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.index({ email: 1, phone: 1 }, { unique: true })

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12).catch((err) => next(err))
  }
  this.role = this.role.toUpperCase()
  if (!roleList.includes(this.role)) {
    return next(new Error(`${this.role} role is not allowed`))
  }
  return next()
})

userSchema.pre('findOneAndUpdate', async function(next) {
  let role = this.get('role')
  if (role) {
    role = role.toUpperCase()
    if (!roleList.includes(role)) {
      return next(new Error(`${role} role is not allowed`))
    }
    this.set({ role: role })
  }
  let password = this.get('password')
  if (password) {
    password = await bcrypt.hash(password, 12).catch((err) => next(err))
    this.set({ password: password })
  }
  this.set({ updatedAt: Date.now() })
  return next()
})

userSchema.methods.transform = function (): Transformed {
  const { id, name, email, phoneCode, phone, role, createdAt, updatedAt } = this;
  return { id, name, email, phoneCode, phone, role, createdAt, updatedAt };
}

userSchema.methods.getToken = function (): any {
  const { id, email, role } = this
  const token = jwt.sign({ id, email, role }, process.env.SECRET_KEY, {})
  return { token: token }
}

userSchema.statics = {
  checkDuplicateError(err: any) {
    if (err.code === 11000) {
      const error = new Error(`data already taken on ${Object.keys(err.keyValue)[0]}`);
      return error
    }
    return err
  },
};

export const User = model<UserDoc, UserModel>("User", userSchema)
