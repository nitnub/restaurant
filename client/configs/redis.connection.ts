import { createClient } from 'redis';
import log from '@/libs/logger';

// export const client = createClient({
//   url: process.env.NEXT_PUBLIC_REDIS_URL,
// });


export const client = createClient()
export default async function redisConnect() {
  client
    .connect()
    .then((e) => {
      log.info('Connected to Redis...');
    })
    .catch((err) => {
      log.error(`Unable to connect to Redis`);
      log.error(err);
    });
  client.on('error', (err) => {
    log.error('Redis Client Error');
    log.error(err);
  });
}
