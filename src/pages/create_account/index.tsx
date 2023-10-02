import Form from '@/components/Form';
import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext, { Action } from '@/components/context';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { getCookie } from '@/utils/cookieHandler';
import GET_CART from '@/queries/cart/GetCart.query';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import { useLazyQuery } from '@apollo/client';
import { Cart } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const { ctx, dispatch } = useContext(AppContext);
  const [cartQuery, { data, loading, error }] = useLazyQuery(GET_CART);
  const router = useRouter();

  const Auth = new AuthorizationHandler({ ctx, dispatch });

  const [
    addItem,
    { data: addItemData, loading: addItemLoading, error: errorLoading },
  ] = useMutation(INCREMENT_CART);

  const [addNewAppUser] = useMutation(ADD_APP_USER);
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

    const ARGS = {
      variables: {
        email: sanitizedUser.email,
        globalUserId: sanitizedUser.id,
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    };

    await signInAuthServerHandler({ email, password })
      .then(() => {
        return addNewAppUser(ARGS);
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
    const prevCart = getCookie('cart')?.items || [];

    const { success, message, accessToken } = await Auth.signIn(
      email,
      password
    )!;

    if (!success) {
      setErrorMessage(() => message);
      return;
    }

    // // Generally, if profile is updated, should check the cookie state first
    setErrorMessage(() => '');

    const ARGS = {
      variables: {
        accessToken: accessToken,
        items: [],
      },
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    };

    let cart: Cart;
    if (prevUser.startsWith('Guest') && prevCart.length > 0) {
      ARGS.variables.items = prevCart;
      const result = await addItem(ARGS);

      if (addItemLoading) return console.log(loading);
      if (errorLoading) return console.log(error);

      cart = result.data.incrementCartResult;
    } else {
      const result = await cartQuery(ARGS);
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
