import { useContext } from 'react';
import AuthorizationHandler from '@/utils/authorizationHandler';
import AppContext from '@/src/context/context';
import { Action } from '@/src/context/context.types';
import { Cart } from '@/types/cartTypes';
import { useIncrementCartMutation } from '@/src/utils/customHooks';

const IconAdd = ({ dishProp }) => {
  const { ctx, dispatch } = useContext(AppContext);
  const ah = new AuthorizationHandler({ ctx, dispatch });

  const [addItem, { loading }] = useIncrementCartMutation(dishProp);

  const addHandler = async () => {
    const result = await addItem();
    const response = result.data.incrementCartResult;

    // If click is between timeout and token refresh, initiate a new refresh
    if (response?.nextTarget === 'auth-server') {
      const updateToken = await ah.updateAccessToken(ctx);

      if (updateToken.status === 'fail') {
        await ah.signOut(false);
        return console.log('Session expired; please log back in manually!');
      }
    }

    const newCart: Cart = {
      items: response.items || ctx.cart.items,
      totalCost: response.totalCost || ctx.cart.totalCost || 0,
      totalCount: response.totalCount || ctx.cart.totalCount || 0,
    };

    document.cookie = `cart=${JSON.stringify(newCart)}`;

    dispatch({ type: Action.UPDATE_CART, payload: newCart });
  };

  if (loading)
    return (
      <svg
        onClick={addHandler}
        xmlns="http://www.w3.org/2000/svg"
        height="40"
        width="40"
      >
        <path
          fill="currentcolor"
          d="M18.708 28.333h2.75V21.5h6.875v-2.792h-6.875v-7.041h-2.75v7.041h-7.041V21.5h7.041ZM20 36.667q-3.458 0-6.479-1.313-3.021-1.312-5.292-3.583t-3.583-5.292Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.583-5.292t5.292-3.562Q16.542 3.333 20 3.333t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.479q-1.312 3.021-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313Z"
        />
      </svg>
    );

  return (
    <>
      <svg
        onClick={addHandler}
        xmlns="http://www.w3.org/2000/svg"
        height="40"
        width="40"
      >
        <path
          fill="currentcolor"
          d="M18.708 28.333h2.75V21.5h6.875v-2.792h-6.875v-7.041h-2.75v7.041h-7.041V21.5h7.041ZM20 36.667q-3.458 0-6.479-1.313-3.021-1.312-5.292-3.583t-3.583-5.292Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.583-5.292t5.292-3.562Q16.542 3.333 20 3.333t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.479q-1.312 3.021-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313Z"
        />
      </svg>
    </>
  );
};
export default IconAdd;
