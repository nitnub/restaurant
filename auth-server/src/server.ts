require('module-alias/register');
import 'dotenv/config';
import app from './app.js';
import mongoConnect from './connections/mongoConnect.js';
import Logger from './libs/logger.js';

const PORT = process.env.PORT || 4001;

mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
      Logger.info(`Listening on port ${PORT}...`);
    });
  })
  .catch(() => Logger.error(`Unable to start Mongo server`));
