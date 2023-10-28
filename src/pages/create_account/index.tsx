import Form from '@/components/Form';
import { useContext, useState } from 'react';
import AppContext from '@/src/context/context';
import { Action } from '@/src/context/context.types';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { getCookie } from '@/utils/cookieHandler';
import { Cart } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  useGetAddAppUserMutation,
  useGetIncrementCartMutation,
  useLazyCartQuery,
} from '@/src/utils/customHooks';
import { Dish } from '@/src/types/dishTypes';
export default function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const { ctx, dispatch } = useContext(AppContext);
  const { cartQuery, loading, error } = useLazyCartQuery();
  const router = useRouter();
  const Auth = new AuthorizationHandler({ ctx, dispatch });

  const {
    addItem,
    loading: addItemLoading,
    error: errorLoading,
  } = useGetIncrementCartMutation();

  const addNewAppUser = useGetAddAppUserMutation();
  const handler = async ({ firstName, lastName, email, password }) => {
    const avatar = 'HARD-CODED-PATH-FOR-TESTING';

    const response = await fetch(
      process.env.NEXT_PUBLIC_AUTH_SERVER_REGISTER_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          avatar,
          admin: false,
          active: true,
        }),
      }
    );
    const json = await response.json();
    const { sanitizedUser, accessToken } = json.data;

    await signInAuthServerHandler({ email, password })
      .then(() => {
        return addNewAppUser(
          sanitizedUser.email,
          sanitizedUser.id,
          accessToken
        );
      })
      .catch((err) => console.log('Sign In Error:', err));

    router.push(
      {
        pathname: '/',
        query: { newUser: true, email },
      },
      '/'
    );
  };

  /**
   * Auth Server...
   *
   */
  const signInAuthServerHandler = async ({ email, password }) => {
    const prevUser = getCookie('accessToken');
    const prevCart: Dish[] = getCookie('cart')?.items || [];

    const { success, message, accessToken } =
      (await Auth.signIn(email, password)) || null;

    if (!success) {
      setErrorMessage(() => message);
      return;
    }

    // // Generally, if profile is updated, should check the cookie state first
    setErrorMessage(() => '');

    let cart: Cart;
    if (prevUser.startsWith('Guest') && prevCart.length > 0) {
      const result = await addItem(accessToken, prevCart);

      if (addItemLoading) return console.log(loading);
      if (errorLoading) return console.log(error);

      cart = result.data.incrementCartResult;
    } else {
      const result = await cartQuery(accessToken);
      if (loading) return console.log(loading);
      if (error) return console.log(error);

      cart = result.data.getCartResult;
    }

    if (typeof cart === 'undefined' || cart.items.length === 0) {
      return;
    }

    // If there are items in the cart response, populate the local cart
    document.cookie = `cart=${JSON.stringify(cart)}`;
    // ctx.setCart(cart);

    dispatch({ type: Action.UPDATE_CART, payload: cart });
  };

  const formFooter = {
    submitButton: { buttonText: ' Create' },
    link: { text: 'Return to Sign In', url: '/signin' },
  };

  return (
    <>
      <Head>
        <title>Restaurant App | Create Account</title>
      </Head>
      <div className="formPageContainer">
        <Card className="formCard">
          <CardContent>
            <CardHeader title="Create Account" />
            <Form
              footer={formFooter}
              showFirstName
              showLastName
              showEmail
              showPassword
              handler={handler}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
