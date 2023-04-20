import * as mongoose from 'mongoose';

export class DBHelper {
  static init(): void {
    const host = process.env.MONGO_HOST
    const port = process.env.MONGO_PORT
    const dbName = process.env.DB_NAME
    mongoose.connect('mongodb://'+host+':'+port+'/'+dbName)
      .then(() => console.log('Connection to mongoDB successful'))
      .catch((e: Error) => console.log(`Could not connect to mongo.\n\n${e}`));
  }
}

export const pagination = (page, size, orderBy, desc) => {
  const setPage = {
    page: 1,
    size: 10,
    orderBy: 'createdAt',
    desc: false
  }
  if (page && !isNaN(page)) setPage.page = Number(page)
  if (size && !isNaN(size)) setPage.size = Number(size)
  if (orderBy) setPage.orderBy = orderBy
  if (desc) setPage.desc = desc.toLowerCase() === 'true'
  return setPage
}
