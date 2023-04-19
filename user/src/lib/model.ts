export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneCode: number;
  phone: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
