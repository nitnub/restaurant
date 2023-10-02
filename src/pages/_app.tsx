import '../styles/globals.css';
import { useContext, useReducer, useState } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import AppContext, {
  Action,
  ActionType,
  // TAppContext,
} from '@/components/context';
import CartDrawer from '@/components/Cart/CartDrawer';
import { ApolloProvider } from '@apollo/client';
import client from '@/dbConfigs/apollo.client';
import { cookieDuster, getCookie } from '@/utils/cookieHandler';
import { Cart, CartButtonSet, CartItem } from '@/types/cartTypes';
import { Dish } from '@/types/dishTypes';
import Head from 'next/head';
import { getTableHeadUtilityClass } from '@mui/material';

export default function App({ Component, pageProps }: AppProps) {
  const ctx = useContext(AppContext);
  const [state, setState] = useState({ cartCount: 0 });
  const [totalCost, setTotalCost] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalCost: 0,
    totalCount: 0,
  });
  const [checkoutCart, setCheckoutCart] = useState<Cart>({
    items: [],
    totalCost: 0,
    totalCount: 0,
  });
  // const [email, setEmail] = useState(ctx.email || 'Sign In');
  // const [authProvider, setAuthProvider] = useState(
  //   ctx.authProvider || 'standard'
  // );
  // const [avatar, setAvatar] = useState(ctx.avatar || getCookie('avatar') || '');
  const [accessToken, setAccessToken] = useState('');
  const [profile, setProfile] = useState('');
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [customerID, setCustomerID] = useState('');

  // const contextValues = {
  const contextValues = {
    cart: {
      items: [],
      totalCost: 0,
      totalCount: 0,
    },
    // cartButtons: [],
    clientSecret: '',
    customerID: '',
    email: 'Sign In',
    authProvider: 'standard',
    avatar: (getCookie('avatar') as string) || '',
    accessToken: '',
    loggedUser: {
      GUID: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      avatar: '',
      admin: null,
      active: null,
    },
    checkoutTotal: 0,
    checkoutCart: {
      items: [],
      totalCost: 0,
      totalCount: 0,
    },
    profile: '',
    query: '',
  };
  const [contextState, setContext] = useState(contextValues);
  // setContext(contextValues);

  const reducer = (context: AppContext, action: Action) => {
    console.log(context);
    const contextCopy: AppContext = structuredClone(context);
    switch (action.type) {
      case ActionType.UPDATE_CART:
        contextCopy.cart = action.payload;
        return contextCopy;

      case ActionType.UPDATE_CART_ITEMS:
        contextCopy.cart.items = action.payload;
        return contextCopy;

      default:
        return context;
    }
  };

  const [context, dispatch] = useReducer(reducer, contextValues);

  return (
    <div style={{ backgroundColor: '#f2f0f3', height: '100vh' }}>
      {/* <AppContext.Provider value={contextValues}> */}
      {/* <AppContext.Provider value={{ context, setContext }}> */}
      <AppContext.Provider value={{ context, dispatch }}>
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
