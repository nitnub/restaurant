import { GET_CART } from 'graphql/queries';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import { useLazyQuery } from '@apollo/client';

async function incrementCart(prevCart: [], accessToken: string) {
  const VARIABLES = {
    items: prevCart,
  };

  const ARGS = {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  };

  const [runQuery, { data, loading, error }] = useLazyQuery(
    INCREMENT_CART,
    ARGS
  );

  await runQuery();
  return data.incrementCartResult;

}

export const formatIncrementCartArgs = (prevCart: [], accessToken: string) => {
  const VARIABLES = {
    items: prevCart,
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

export default incrementCart;
