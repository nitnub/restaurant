import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { getCookie } from '@/utils/cookieHandler';

const URI = process.env.NEXT_PUBLIC_RESOURCE_URI;
const link = new HttpLink({
  uri: URI,
  // Additional options
});

if (typeof document !== 'undefined') {
  // const accessToken = getCookie('accessToken');
}

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

export default client;
