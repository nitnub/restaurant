import Logger from '../libs/logger';
import mongoose from 'mongoose';

const DB = process.env.MONGO_CONNECTION_STRING!;

mongoose.set('strictQuery', false);

mongoose.connection.on('error', (err) => {
  Logger.error(err);
});

mongoose.connection.on('disconnected', (err) => {
  Logger.error(err);
});

export default async function mongoConnect() {
  Logger.info('Connecting to mongoDB');

  mongoose
    .connect(DB)
    .then((e) => Logger.info(`Connected to ${e.connection.name} DB...`))
    .catch((err) => console.log(err));
}
