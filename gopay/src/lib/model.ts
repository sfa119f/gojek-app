export interface GopayModel {
  idUser: string;
  gopay: number;
  isGopayPlus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const searchField = [
  'gopayMin',
  'gopayMax',
  'isGopayPlus' 
]