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

export const roleList = [
  'ADMIN',
  'USER',
  'DRIVER',
  'PARTNER'
]

export const searchField = [
  'name',
  'email',
  'phoneCode',
  'phone',
  'role' 
]
