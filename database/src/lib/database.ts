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
