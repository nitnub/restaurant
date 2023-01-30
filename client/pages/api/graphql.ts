import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import resolvers from '@/src/schema/Main.resolver';
import typeDefs from '@/src/schema/typeDefs.graphql';
import { addUser } from '@/src/middleware/auth.middleware';
import redisConnect from '@/configs/redis.connection';

redisConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, user: await addUser(req) }),
});
