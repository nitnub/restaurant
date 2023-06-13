
import { Cart, CartButtonSet } from '@/types/cartTypes';
import { createContext } from 'react';
import { DishObject } from '@/types/dishTypes';

const AppContext = createContext({
  // isAuthenticated: true,
  cart: { items: [], totalCost: 0, totalCount: 0 },
  setCart: (cart: Cart) => {},
  cartButtons: [],
  setCartButtons: (buttons: CartButtonSet[]) => {},
  addToCart: (item: DishObject) => {},
  removeFromCart: (item: DishObject) => {},
  setCartCount: (num) => {},
  email: '',
  setEmail: (email: string) => {},
  authProvider: '',
  setAuthProvider: (authProvider: string) => {},
  avatar: '',
  setAvatar: (avatar: string) => {},
  accessToken: '',
  setAccessToken: (token: string) => {},
  clientSecret: '',
  setClientSecret: (clientSecret: string) => {},
  customerID: '',
  setCustomerID: (clientID: string) => {},
  checkoutTotal: 0,
  setCheckoutTotal: (checkoutTotal: number) => {},
  checkoutCart: { items: [], totalCost: 0, totalCount: 0 },
  setCheckoutCart: (checkoutCart: Cart) => {},
  loggedUser: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: '',
    admin: '',
    active: '',
  },
  profile: {
    id: '',
    firstName: '',
    email: '',
    avatar: '',
    admin: false,
    exp: '',
  },
  setProfile: (profile: object) => {},

  query: '',
});

export default AppContext;
