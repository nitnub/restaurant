import {
  DocumentNode,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
import { getCookie } from './cookieHandler';
import { Dish } from '@/src/types/dishTypes';
import CLEAR_CART from '@/mutations/cart/ClearCart.mutation';
import CREATE_STRIPE_PAYMENT from '@/mutations/payment/CreatePayment.mutation';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import DECREMENT_CART from '@/mutations/cart/RemoveItemFromCart.mutation';
import GET_CART from '@/queries/cart/GetCart.query';
import GET_CLIENT_SECRET from '@/queries/payment/GetStripeClientSecret.query';
import GET_CUSTOMER_CART from '@/queries/cart/GetCart.query';
import GET_CUSTOMER_TRANSACTIONS from '@/queries/payment/GetCustomerTransactions.query';
import GET_PAYMENT_METHODS from '@/queries/payment/GetStripePaymentMethods.query';
import GET_RESTAURANT from '@/queries/restaurant/GetRestaurant.query';
import { useContext } from 'react';
import AppContext from '../context/context';

const BEARER_AUTH_ARGS = {
  context: {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`,
    },
  },
};

function getBearerAuthArgs(accessToken: string) {
  return {
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  };
}

export function createPaymentArgs(amount: string, paymentMethodID: string) {
  const PAYMENT_VARIABLES = {
    amount,
    path: '/',
    paymentMethodID,
  };

  const PAYMENT_ARGS = {
    variables: PAYMENT_VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  return PAYMENT_ARGS;
}

export const formatAppUserArgs = (
  email: string,
  id: string,
  accessToken: string
) => {
  const VARIABLES = {
    email,
    globalUserId: id,
  };

  return {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  };
};

// Finalized Queries
export function useCartQuery() {
  return useCustomQuery(GET_CUSTOMER_CART);
}

export function useClientSecretQuery() {
  return useCustomQuery(GET_CLIENT_SECRET);
}

export function useTransactionsQuery() {
  return useCustomQuery(GET_CUSTOMER_TRANSACTIONS);
}

export function usePaymentMethodQuery() {
  const queryKey = getCookie('accessToken');
  const ARGS = { ...BEARER_AUTH_ARGS, queryKey };

  return useQuery(GET_PAYMENT_METHODS, ARGS);
}

export function useRestaurantQuery(id: string) {
  const variables = { id: Number(id) };
  const ARGS = { ...BEARER_AUTH_ARGS, variables };

  return useQuery(GET_RESTAURANT);
}

// Finalized Mutations
export function useClearCartMutation() {
  return useMutation(CLEAR_CART, BEARER_AUTH_ARGS);
}

export function useCreateStripePaymentMutation(amount: string, id: string) {
  const variables = {
    amount,
    path: '/',
    paymentMethodID: id,
  };

  const ARGS = { ...BEARER_AUTH_ARGS, variables };

  return useMutation(CREATE_STRIPE_PAYMENT, ARGS);
}

export function useIncrementCartMutation(dishProp: Dish) {
  const itemVariable = getFormattedItem(dishProp);

  const variables = {
    accessToken: useContextToken(),
    items: [itemVariable],
  };

  const ARGS = { ...BEARER_AUTH_ARGS, variables };

  return useMutation(INCREMENT_CART, ARGS);
}

export function useGetIncrementCartMutation() {
  const [addItemRaw, { data, loading, error }] = useMutation(INCREMENT_CART);

  const addItem = (accessToken: string, prevCart: Dish[]) => {
    const variables = { accessToken, items: prevCart };
    const ARGS = { ...getBearerAuthArgs(accessToken), variables };

    return addItemRaw(ARGS);
  };

  return { addItem, data, loading, error };
}

export function useDecrementCartMutation(dishProp: Dish) {
  const variables = {
    accessToken: useContextToken(),
    id: dishProp.id,
  };

  const ARGS = { ...BEARER_AUTH_ARGS, variables };

  return useMutation(DECREMENT_CART, ARGS);
}

function useContextToken() {
  const { ctx } = useContext(AppContext);
  return ctx.accessToken ? ctx.accessToken : 'Guest';
}

export function useAddAppUserMutation() {
  return useMutation(ADD_APP_USER);
}

export function useGetAddAppUserMutation() {
  const [addNewAppUser] = useMutation(ADD_APP_USER);

  return (email: string, globalUserId: string, accessToken: string) => {

    console.log
    const variables = { email, globalUserId };

    const ARGS = { ...getBearerAuthArgs(accessToken), variables };

    addNewAppUser(ARGS);
  };
}



// Finalized LazyQueries

export function useLazyCartQuery() {
  const [cartQueryRaw, { data, loading, error }] = useLazyQuery(GET_CART);

  const cartQuery = (accessToken: string) => {
    const variables = { accessToken, items: [] };
    const ARGS = { ...getBearerAuthArgs(accessToken), variables };

    return cartQueryRaw(ARGS);
  };

  return { cartQuery, data, loading, error };
}

export function useLazyAddAppUserQuery() {}

//
//
//
//
//
//
//
//
//
//
//
//

function useCustomQuery(gqlString: DocumentNode) {
  return useQuery(gqlString, BEARER_AUTH_ARGS);
}

// export const formatCustomerTransactionsArgs = () => {
//   const ARGS = {
//     context: {
//       headers: {
//         Authorization: `Bearer ${getCookie('accessToken')}`,
//       },
//     },
//   };
//   return ARGS;
// };

// export const getClientSecretArgs = () => {
//   const ARGS = {
//     context: {
//       headers: {
//         Authorization: `Bearer ${getCookie('accessToken')}`,
//       },
//     },
//   };
//   return ARGS;
// };

function getFormattedItem(dishProp: Dish) {
  return {
    id: dishProp.id,
    name: dishProp.name,
    itemType: dishProp.type,
    description: dishProp.description,
    image: dishProp.image,
    price: dishProp.price,
    restaurant: dishProp.restaurant,
    restaurantName: dishProp.restaurantName,
    vegetarian: dishProp.vegetarian,
    vegan: dishProp.vegan,
    glutenFree: dishProp.glutenFree,
  };
}
