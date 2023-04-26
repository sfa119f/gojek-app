export interface GorideModel {
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
}

export const paymentList = [
  'CASH',
  'GOPAY',
  'GOPAYCOIN',
  'GOPAYLATER',
  'LINKAJA',
  'CARD'
]

export const statusList = [
  'LOOKING FOR DRIVER',
  'WAITING FOR DRIVER',
  'ON TRIP',
  'FINISHED',
  'CANCELED'
]
