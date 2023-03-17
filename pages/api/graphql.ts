import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import resolvers from '@/src/schema/Main.resolver';
import typeDefs from '@/src/schema/typeDefs.graphql';
import { addUser } from 'middleware/auth.middleware';
import redisConnect from '@/configs/redis.connection';
import allowCors from '@/utils/cors';
// import cors from 'cors';

redisConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, user: await addUser(req) }),
});

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req, res) => ({ req, res, user: await addUser(req) }),
// });

// export default allowCors(handler);
