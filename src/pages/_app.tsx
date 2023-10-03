import '../styles/globals.css';
import { useReducer } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import AppContext, { Action, ActionPayload } from '@/components/context';
import CartDrawer from '@/components/Cart/CartDrawer';
import { ApolloProvider } from '@apollo/client';
import client from '@/dbConfigs/apollo.client';
import { getCookie } from '@/utils/cookieHandler';

export default function App({ Component, pageProps }: AppProps) {
  const defaultCart = {
    items: [],
    totalCost: 0,
    totalCount: 0,
  };

  const defaultUser = {
    GUID: '',
    firstName: '',
    lastName: '',
    email: 'Sign In',
    password: '',
    avatar: (getCookie('avatar') as string) || '',
    admin: null,
    active: null,
  };

  const contextValues = {
    cart: defaultCart,
    clientSecret: '',
    customerID: '',
    authProvider: 'standard',
    accessToken: '',
    user: defaultUser,
    checkoutTotal: 0,
    checkoutCart: defaultCart,
    profile: '',
    query: '',
  };

  const reducer = (state: AppContext, action: ActionPayload) => {
    const ctxCopy: AppContext = structuredClone(state);
    switch (action.type) {
      case Action.UPDATE_CART:
        ctxCopy.cart = action.payload;
        return ctxCopy;

      case Action.UPDATE_CART_ITEMS:
        ctxCopy.cart.items = action.payload;
        return ctxCopy;

      case Action.CLEAR_CART:
        ctxCopy.cart = defaultCart;
        return ctxCopy;

      case Action.UPDATE_USER:
        const updatedUser = { ...ctxCopy.user, ...action.payload };
        ctxCopy.user = updatedUser;
        return ctxCopy;

      case Action.UPDATE_UI_FOR_USER:
        const { avatar, cart } = action.payload;
        ctxCopy.user.avatar = avatar;
        if (cart.items.length > 0) {
          ctxCopy.cart = cart;
        }
        return ctxCopy;

      case Action.UPDATE_PROPERTIES:
        const updatedProps = action.payload;
        return { ...ctxCopy, ...updatedProps };

      case Action.SET_CHECKOUT_CART:
        const cartCopy = { ...ctxCopy.cart };
        ctxCopy.checkoutCart = cartCopy;
        return ctxCopy;

      case Action.SIGN_OUT:
        ctxCopy.cart = defaultCart;
        ctxCopy.user = defaultUser;
        ctxCopy.accessToken = action.payload.accessToken;
        return ctxCopy;

      default:
        return state;
    }
  };

  const [ctx, dispatch] = useReducer(reducer, contextValues);

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
