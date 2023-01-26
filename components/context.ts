
import { Cart, CartButtonSet } from '@/types/cartTypes';
import { createContext } from 'react';
import { DishObject } from '../models/dishModel';

const AppContext = createContext({
  // isAuthenticated: true,
  cart: { items: [], totalCost: 0, totalCount: 0 },
  setCart: (cart: Cart) => {},
  totalCost: 0,
  totalCount: 0,
  setTotalCost: (cost: number) => {},
  setTotalCount: (count: number) => {},
  cartButtons: [],
  setCartButtons: (buttons: CartButtonSet[]) => {},
  addToCart: (item: DishObject) => {},
  removeFromCart: (item: DishObject) => {},
  // cartCount: 0,
  // updateTest: () => {},
  setCartCount: (num) => {},
  email: '',
  setEmail: (email: 'string') => {},
  avatar: '',
  setAvatar: (avatar: 'string') => {},
  accessToken: '',
  setAccessToken: (token: string) => {},
  clientSecret: '',
  setClientSecret: (clientSecret: string) => {},
  customerID: '',
  setCustomerID: (clientID: string) => {},
  // addItem: () => {},
  // removeItem: () => {},
  // user: false,
  // setUser: () => {},
  checkoutTotal: 0,
  setCheckoutTotal: (checkoutTotal: number) => {},
  checkoutCart: { items: [], totalCost: 0, totalCount: 0 },
  setCheckoutCart: (checkoutCart: Cart) => {},
  loggedUser: {
    // GUID: '',
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
