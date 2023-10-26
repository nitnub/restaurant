import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import resolvers from '@/schema/Main.resolver';
import typeDefs from '@/schema/typeDefs.graphql';
import { addUser } from '@/middleware/auth.middleware';
import redisConnect from '@/dbConfigs/redis.connection';

redisConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, user: await addUser(req) }),
});
