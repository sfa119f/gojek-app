import * as mongoose from 'mongoose';

export class DBHelper {
  static init(): void {
    mongoose.connect(process.env.DB_URL)
      .then(() => console.log('Connection to mongoDB successful'))
      .catch((e: Error) => console.log(`Could not connect to mongo.\n\n${e}`));
  }
}
