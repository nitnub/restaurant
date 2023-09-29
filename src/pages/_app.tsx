import '../styles/globals.css';
import { useContext, useState } from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import AppContext from '@/components/context';
import CartDrawer from '@/components/Cart/CartDrawer';
import { ApolloProvider } from '@apollo/client';
import client from '@/dbConfigs/apollo.client';
import { cookieDuster, getCookie } from '@/utils/cookieHandler';
import { Cart, CartButtonSet, CartItem } from '@/types/cartTypes';
import { Dish } from '@/types/dishTypes';
import Head from 'next/head';



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
  const [email, setEmail] = useState(ctx.email || 'Sign In');
  const [authProvider, setAuthProvider] = useState(
    ctx.authProvider || 'standard'
  );
  const [avatar, setAvatar] = useState(ctx.avatar || getCookie('avatar') || '');
  const [accessToken, setAccessToken] = useState('');
  const [profile, setProfile] = useState('');
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [customerID, setCustomerID] = useState('');

  // const contextValues = {
   const contextValues = {
    cart,
    setCart: (cart: Cart) => setCart(cart),
    cartButtons: [],
    setCartButtons: (buttons: CartButtonSet[]) => {},
    addToCart,
    removeFromCart,
    totalCost,
    totalCount,
    clientSecret,
    setClientSecret: (clientSecret: string) => setClientSecret(clientSecret),
    customerID,
    setCustomerID: (customerID: string) => setCustomerID(customerID),
    setTotalCost: (cost: number) => setTotalCost(cost),
    setTotalCount: (count: number) => setTotalCount(count),
    setCartCount: (count: number) => setState(count),
    email,
    setEmail: (email: string) => setEmail(email),
    authProvider,
    setAuthProvider: (authProvider: string) => setAuthProvider(authProvider),
    avatar,
    setAvatar: (avatar: string) => setAvatar(avatar),
    accessToken,
    setAccessToken: (accessToken: string) => setAccessToken(accessToken),
    loggedUser: {
      GUID: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      avatar: '',
      admin: '',
      active: '',
    },
    checkoutTotal,
    setCheckoutTotal: (checkoutTotal: number) =>
      setCheckoutTotal(checkoutTotal),
    checkoutCart,
    setCheckoutCart: (cart: Cart) => setCheckoutCart(cart),
    profile,
    setProfile: (profile) => setProfile(profile),
    query: '',
  };

  function addToCart(item: CartItem) {
    const items = cart.items;
    const itemIndex = items.findIndex((el) => el.id === item.id);

    if (items.length === 0 || itemIndex === -1) {
      setCart({
        items: [...cart.items, { ...item, count: 1 }],
        total: cart.total + item.price,
      });
    } else {
      const modifiedItem = cart.items.splice(itemIndex, 1)[0];
      const oldCount = modifiedItem.count;
      setCart({
        items: [...cart.items, { ...modifiedItem, count: oldCount + 1 }],
        total: cart.total + item.price,
      });
    }
  }

  function removeFromCart(item: Dish) {
    const items = cart.items;
    const itemIndex = items.findIndex((el) => el.id === item.id);

    if (items.length === 0 || itemIndex === -1) {
      return;
    } else {
      const modifiedItem = cart.items.splice(itemIndex, 1)[0];
      const oldCount = modifiedItem.count;

      setCart({
        items: [...cart.items, { ...modifiedItem, count: oldCount - 1 }],
        total: cart.total - item.price,
      });
    }
  }

  return (
    <div style={{ backgroundColor: '#f2f0f3', height: '100vh' }}>
      <AppContext.Provider value={contextValues}>
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

