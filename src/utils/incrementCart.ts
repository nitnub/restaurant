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
  console.log('process.env.NODE_ENV');
  console.log(process.env.NODE_ENV);

  // return [runQuery, { data, loading, error }];
  // if (loading) return console.log(loading);
  // if (error) return console.log(error);
  await runQuery();

  console.log('incremen cart results:');
  console.log(data.incrementCartResult);
  return data.incrementCartResult;
  // return await runQuery();
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
