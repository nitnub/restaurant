import Form from '@/components/Form';
import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext from '@/components/context';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { getCookie } from '@/utils/cookieHandler';
import GET_CART from '@/queries/cart/GetCart';
import { useLazyQuery } from '@apollo/client';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import { Cart } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useRouter } from 'next/router';
import app from '@/utils/firebaseConfig';

import GoogleButton from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Head from 'next/head';
import ADD_APP_USER  from '@/mutations/user/AddNewAppUser.mutation';
import verifyToken, { readToken } from '@/utils/token';

const provider = new GoogleAuthProvider();

export default function SignIn() {
  const [oAuthError, setOAuthError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const ctx = useContext(AppContext);
  const [cartQuery, { data, loading, error }] = useLazyQuery(GET_CART);

  const Auth = new AuthorizationHandler(ctx);
  const router = useRouter();

  const [
    addItem,
    { data: addItemData, loading: addItemLoading, error: errorLoading },
  ] = useMutation(INCREMENT_CART);

  const [addNewAppUser] = useMutation(ADD_APP_USER);

  const auth = getAuth(app);
  const googleSignInHandler = async () => {
    try {
      const prevUser = getCookie('accessToken');
      const prevCart = getCookie('cart')?.items || [];
      const result = await signInWithPopup(auth, provider);

      // The signed-in user info.
      const user = result.user;
      const idToken = await user.getIdToken();

      const { success, message, accessToken } = await Auth.signInOAuth(
        idToken,
        'www.google.com',
        { image: user.photoURL }
      );

      if (message === 'invalid signature') {
        setOAuthError(() => 'Unable to identify user.');
        return;
      }

      ctx.setAvatar(user.photoURL);

      // Add the App User
      const {
        email,
        id: globalUserId,
        newUser,
        authProvider,
      } = readToken(accessToken);

      const VARIABLES = {
        email,
        globalUserId,
      };
      const ARGS = {
        variables: VARIABLES,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      };

      const newAppUser = await addNewAppUser(ARGS);

      // // Generally, if profile is updated, should check the cookie state first

      setErrorMessage(() => '');

      let cart: Cart = {
        items: [],
        totalCount: 0,
        totalCost: 0,
      };
      if (prevUser.startsWith('Guest') && prevCart.length > 0) {
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

        const result = await addItem(ARGS);

        if (addItemLoading) console.log('LOADING ADD ITEM');
        if (errorLoading) console.log('ERROR LOADING ITEMS');

        if (addItemLoading) return console.log(loading);
        if (errorLoading) return console.log(error);

        cart = result.data.incrementCartResult;
      } else {
        const VARIABLES = {
          items: [],
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
        if (loading) console.log(loading);
        if (error) return console.log(error);

        cart = result.data.incrementCartResult;
      }

      if (typeof cart === 'undefined') {
        return;
      }

      // If there are items in the cart response, populate the local cart
      if (cart.items.length > 0) {
        document.cookie = `cart=${JSON.stringify(cart)}`;
        ctx.setCart(cart);
        ctx.setTotalCount(cart.totalCount);
        ctx.setTotalCost(cart.totalCost);
      }

      if (newUser) {
        
        return router.push(
          {
            pathname: '/',
            query: { newUser: true, email },
          },
          '/'
        );
      }

      return router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Auth Server...
   *
   */
  const signInAuthServerHandler = async ({ email, password }) => {
    try {
      const prevUser = getCookie('accessToken');
      const prevCart = getCookie('cart')?.items || [];

      const { success, message, accessToken } = (await Auth.signIn(
        email,
        password
      )) || { success: null, message: null, accessToken: null };

      if (!success) {
        setErrorMessage(() => message);
        return;
      }

      router.push('/');

      // Generally, if profile is updated, should check the cookie state first
      // Clear error message
      setErrorMessage(() => '');

      let cart: Cart;
      if (prevUser.startsWith('Guest') && prevCart.length > 0) {
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

        const result = await addItem(ARGS);
        // await addItem(ARGS);

        if (addItemLoading) console.log('LOADING ADD ITEM');
        if (errorLoading) console.log('ERROR LOADING ITEMS');

        if (addItemLoading) return console.log(loading);
        if (errorLoading) return console.log(error);

        cart = result.data.incrementCartResult;
      } else {
        const VARIABLES = {
          items: [],
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
        if (loading) return console.log(loading);
        if (error) return console.log(error);

        cart = result.data.incrementCartResult;
      }

      if (typeof cart === 'undefined') {
        return;
      }

      // If there are items in the cart response, populate the local cart
      if (cart.items.length > 0) {
        document.cookie = `cart=${JSON.stringify(cart)}`;
        ctx.setCart(cart);
        ctx.setTotalCount(cart.totalCount);
        ctx.setTotalCost(cart.totalCost);
      }
    } catch (err) {
      console.log(
        'There was an error logging into the application. Please try again later.'
      );
      return (
        <>
          <h1>Error</h1>
          <p>
            There was an error logging into the application. Please try again
            later.
          </p>
        </>
      );
    }
  };

  const signOutHandler = async () => {
    Auth.signOut(false);
  };

  const formFooter = {
    submitButton: { buttonText: ' Sign In' },
    link: { text: 'Create an account', url: '/create_account' },
  };

  return (
    <>
      <div className="formPageContainer">
        <Head>
          <title>Restaurant App | Sign In</title>
        </Head>
        <Card className="formCard">
          <CardContent className="formCardContent">
            <CardHeader title="Sign In" />
            <Form
              showEmail
              showPassword
              handler={signInAuthServerHandler}
              footer={formFooter}
            />
            <div>{errorMessage}</div>
          </CardContent>

          <div className="sectionBreak">&nbsp;or&nbsp;</div>
          <br />
          <GoogleButton
            style={{ width: '200px' }}
            onClick={googleSignInHandler}
          />

          {oAuthError ? (
            <div className="error-text">
              <div>{oAuthError}</div>
              <div>Please try again or create a new account.</div>
            </div>
          ) : (
            <div className="error-text">
              <br />
              <br />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
