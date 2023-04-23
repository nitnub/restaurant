import { GET_CART } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

async function getExistingCart(ctx) {
  const VARIABLES = {
    accessToken: ctx.accessToken,
  };

  const ARGS = { variables: VARIABLES };
  const [runQuery, { data, loading, error }] = useLazyQuery(GET_CART, ARGS);

  if (loading) return console.log(loading);
  if (error) return console.log(error);
  return await runQuery();
}

export default getExistingCart;
