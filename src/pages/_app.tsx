import '../styles/globals.css';
import { useContext, useReducer, useState } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import AppContext, {
  Action,
  ActionPayload,
  // ActionType,
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
  // const ctx = useContext(AppContext);
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
    // email: 'Sign In',
    authProvider: 'standard',
    // avatar: (getCookie('avatar') as string) || '',
    accessToken: '',
    user: {
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
        ctxCopy.cart = {
          items: [],
          totalCost: 0,
          totalCount: 0,
        };
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
