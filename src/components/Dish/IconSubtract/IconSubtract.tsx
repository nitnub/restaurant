import AuthorizationHandler from '@/utils/authorizationHandler';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import DECREMENT_CART from '@/mutations/cart/RemoveItemFromCart.mutation';
import AppContext from '../../context';
import { getCookie } from '@/utils/cookieHandler';
import { Cart, CartItem } from '@/types/cartTypes';


const IconSubtract = ({ dishProp, context, setCount}) => {
  // const ctx = useContext(AppContext);
  const ctx = context;
  const ah = new AuthorizationHandler(ctx);

  const VARIABLES = {
    accessToken: ctx.accessToken ? ctx.accessToken : 'Guest',
    id: dishProp.id,
  };

  const ARGS = {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const [removeItem, {loading }] = useMutation(
    DECREMENT_CART,
    ARGS
  );

  // const getDishTotal = (id: string, cart: Cart) => {
  //   const item: CartItem = cart.items?.filter(
  //     (el: CartItem) => Number(el.id) === Number(id)
  //   )[0];
  //   if (!item) return 0;

  //   return item.count;
  // };

  const removeHandler = async () => {
    const result = await removeItem();
    const response = result.data.decrementCartResult;

    // If click is between timeout and token refresh, initiate a new refresh
    if (response?.nextTarget === 'auth-server') {
      const updateToken = await ah.updateAccessToken(ctx);

      if (updateToken.status === 'fail') {
        await ah.signOut(false);
        return console.log('Session expired; please log back in manually!');
      }
    }

    // setCount(() => getDishTotal(dishProp.id, response));
    setCount(() => response.totalCount);
    const newCart: Cart = {
      items: response.items || ctx.cart.items,
      totalCost: response.totalCost || 0,
      totalCount: response.totalCount || 0,
    };

    // update with new cart state
    document.cookie = `cart=${JSON.stringify(newCart)}`;

    ctx.cart = newCart;
  };

  if (loading)
    return (
      <>
        <svg
          onClick={removeHandler}
          xmlns="http://www.w3.org/2000/svg"
          height="40"
          width="40"
        >
          <path
            fill="currentcolor"
            d="M11.667 21.292h16.666v-2.75H11.667ZM20 36.667q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.458 1.313-6.5 1.312-3.042 3.583-5.292t5.313-3.562Q16.583 3.333 20 3.333q3.458 0 6.5 1.313 3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5 0 3.417-1.313 6.458-1.312 3.042-3.562 5.313T26.5 35.354q-3.042 1.313-6.5 1.313Z"
          />
        </svg>
      </>
    );

  return (
    <>
      <svg
        onClick={removeHandler}
        xmlns="http://www.w3.org/2000/svg"
        height="40"
        width="40"
      >
        <path
          fill="currentcolor"
          d="M11.667 21.292h16.666v-2.75H11.667ZM20 36.667q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.458 1.313-6.5 1.312-3.042 3.583-5.292t5.313-3.562Q16.583 3.333 20 3.333q3.458 0 6.5 1.313 3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5 0 3.417-1.313 6.458-1.312 3.042-3.562 5.313T26.5 35.354q-3.042 1.313-6.5 1.313Z"
        />
      </svg>
    </>
  );
};
export default IconSubtract;
