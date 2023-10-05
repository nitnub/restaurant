import '../styles/globals.css';
import { useReducer } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import AppContext, { contextValues } from '@/src/context/context';
import CartDrawer from '@/components/Cart/CartDrawer';
import { ApolloProvider } from '@apollo/client';
import client from '@/dbConfigs/apollo.client';
import contextReducer from '@/src/context/context.reducer';

export default function App({ Component, pageProps }: AppProps) {
  const [ctx, dispatch] = useReducer(contextReducer, contextValues);

  return (
    <div style={{ backgroundColor: '#f2f0f3', height: '100vh' }}>
      <AppContext.Provider value={{ ctx, dispatch }}>
        <ApolloProvider client={client}>
          <CartDrawer />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </AppContext.Provider>
    </div>
  );
}
