export interface GorideModel {
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

export const searchField = [
  'idUser',
  'idDriver',
  'tripFeeMin',
  'tripFeeMax',
  'updatedAt' // using YYYYMM format
]
