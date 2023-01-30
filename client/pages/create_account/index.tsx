import Form from '../../components/Form';
import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext from '../../components/context';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { getCookie } from '@/utils/cookieHandler';
import { GET_CART } from '@/src/graphql/queries';
import { ADD_APP_USER, INCREMENT_CART } from '@/src/graphql/mutations';
import { useLazyQuery } from '@apollo/client';
import { Cart, CartItem } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const ctx = useContext(AppContext);
  const [cartQuery, { data, loading, error }] = useLazyQuery(GET_CART);
  const router = useRouter();

  const Auth = new AuthorizationHandler(ctx);

  const [
    addItem,
    { data: addItemData, loading: addItemLoading, error: errorLoading },
  ] = useMutation(INCREMENT_CART);

  const [addNewAppUser] = useMutation(ADD_APP_USER);
  const handler = async ({ firstName, lastName, email, password }) => {
    const avatar = 'HARD-CODED-PATH-FOR-TESTING';
    const admin = false;
    const active = true;
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
          admin,
          active,
        }),
      }
    );
    const json = await response.json();
    const data = json.data.sanitizedUser;
    const accessToken = json.data.accessToken;

    const VARIABLES = {
      email: data.email,
      globalUserId: data.id,
    };

    const ARGS = {
      variables: VARIABLES,
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
    );

    if (!success) {
      setErrorMessage(() => message);
      return;
    }

    // Auth.setProfile(accessToken); //

    // // Generally, if profile is updated, should check the cookie state first

    setErrorMessage(() => '');

    let cart: Cart;
    if (prevUser.startsWith('Guest') && prevCart.length > 0) {
      const VARIABLES = {
        accessToken: accessToken,
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

      const result = await addItem(ARGS);

      // data: addItemData, loading: addItemLoading, error: errorLoading },
      if (addItemLoading) return console.log(loading);
      if (errorLoading) return console.log(error);

      cart = result.data.incrementCartResult;
    } else {
      // get all cart items in variable
      // move all items to logged in user's cart
      // clear old cart

      const VARIABLES = {
        accessToken: accessToken,
      };

      const ARGS = {
        variables: VARIABLES,
        context: {
          headers: {
            // Authorization: `Bearer ${getCookie('accessToken')}`,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      };

      const result = await cartQuery(ARGS);
      if (loading) return console.log(loading);
      if (error) return console.log(error);
      cart = result.data.getCartResult;
    }

    if (typeof cart === 'undefined') {
      return;
    }

    // If there are items in the cart response, populate the local cart
    if (cart.items.length > 0) {
      document.cookie = `cart=${JSON.stringify(cart)}`;
      ctx.setCart(() => cart);
      ctx.setTotalCount(cart.totalCount);
      ctx.setTotalCost(cart.totalCost);
    }
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
              // header={'Create Account'}
              footer={formFooter}
              // showName
              showFirstName
              // firstName
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
