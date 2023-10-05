import { createContext } from 'react';
import { ContextReducer } from './context.types';
import { getCookie } from '@/utils/cookieHandler';

const AppContext = createContext<ContextReducer>(null);

export const defaultCart = {
  items: [],
  totalCost: 0,
  totalCount: 0,
};

export const defaultUser = {
  GUID: '',
  firstName: '',
  lastName: '',
  email: 'Sign In',
  password: '',
  avatar: (getCookie('avatar') as string) || '',
  admin: null,
  active: null,
};

export const contextValues = {
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

export default AppContext;
