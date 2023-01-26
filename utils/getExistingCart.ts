import { GET_CART } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { Context, useContext } from 'react';
// import AppContext from '@/components/context';

async function getExistingCart(ctx: Context) {
  // const ctx = useContext(AppContext);
  const VARIABLES = {
    accessToken: ctx.accessToken,
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYWY1YjhjYjdkMjZjZWExMzk4MWM3MyIsImZpcnN0TmFtZSI6Ik1hcnkiLCJlbWFpbCI6InRlc3QxMTFAZ21haWwuY29tIiwiYXZhdGFyIjoiL2ltZy9waWMvbWFyeS5wbmciLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjcyNDM2NjIwLCJleHAiOjE2NzUwMjg2MjB9.IT1fmIsrmglWFJJeTBwhZn7Q2cj09qY7VrNIKQ14IO4',
  };

  const ARGS = { variables: VARIABLES };
  const [runQuery, { data, loading, error }] = useLazyQuery(GET_CART, ARGS);

  if (loading) return console.log(loading);
  if (error) return console.log(error);
  return await runQuery();
  // return data;
}

// const formattedCart = {
//   items: data.cart.items,
//   totalCost: data.cart.totalCost,
//   totalCount: data.cart.totalCount,
// };

export default getExistingCart;
