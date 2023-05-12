import Form from '@/components/Form';
import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext from '@/components/context';
import AuthorizationHandler from '@/utils/authorizationHandler';
import {  updateCookieObject } from '@/utils/cookieHandler';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import { Cart } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import {  useRouter } from 'next/router';
import app from '@/utils/firebaseConfig';
import GoogleButton from 'react-google-button';
import { getAuth, , GoogleAuthProvider } from 'firebase/auth';
import Head from 'next/head';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
import { readToken } from '@/utils/token';
import { formatAppUserArgs } from '@/utils/addNewAppUser';
import confirmGoogleUser from '@/src/utils/signInHandlers/firebase/confirmGoogleUser';
import consolidateGuestAndUserCarts from '@/src/utils/cart/consolidateGuestAndUserCarts';
import routeUserToHomepage from '@/utils/routing/routeUserToHomepage';

// import googleSignInHandler from '@/src/utils/signInHandlers/signIn.oAuth';

const provider = new GoogleAuthProvider();

export default function SignIn() {
  let cart: Cart | null = {
    items: [],
    totalCount: 0,
    totalCost: 0,
  };

  const [oAuthError, setOAuthError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const ctx = useContext(AppContext);


  const Auth = new AuthorizationHandler(ctx);
  const router = useRouter();

  const [
    addItem,
    { data: addItemData, loading: addItemLoading, error: errorLoading },
  ] = useMutation(INCREMENT_CART);

  const [addNewAppUser] = useMutation(ADD_APP_USER);

  const googleSignInHandler = async () => {
    const googleAuth = getAuth(app);

    try {
      const { success, message, accessToken, photoURL } =
        await confirmGoogleUser(ctx, googleAuth, provider);

      if (message === 'invalid signature') {
        setOAuthError(() => 'Unable to identify user.');
        return;
      }

      if (!success) {
        setErrorMessage(() => message);
        return;
      }

      ctx.setAvatar(photoURL);

      // Add the App User
      const { email, id, newUser } = readToken(accessToken);
      const userArgs = formatAppUserArgs(email, id, accessToken);

      await addNewAppUser(userArgs);

      setErrorMessage(() => '');

      cart = await consolidateGuestAndUserCarts(accessToken, addItem);

      if (!cart) return;

      // If there are items in the cart response, populate the local cart
      updateCookieObject('cart', cart);

      if (cart.items.length > 0) {
        ctx.setCart(cart);
      }

      return routeUserToHomepage(router, email, newUser);
    } catch (error) {
      console.log(error);
    }
  };

  const signInAuthServerHandler = async ({ email, password }) => {
    try {
      const { success, message, accessToken } = (await Auth.signIn(
        email,
        password
      )) || { success: null, message: null, accessToken: null };

      if (!success) {
        setErrorMessage(() => message);
        return;
      }

      setErrorMessage(() => '');

      cart = await consolidateGuestAndUserCarts(accessToken, addItem);

      if (!cart) return;

      // If there are items in the cart response, populate the local cart
      updateCookieObject('cart', cart);

      if (cart.items.length > 0) {
        ctx.setCart(cart);
      }

      // return router.push('/');
      return routeUserToHomepage(router);
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

  const formFooter = {
    submitButton: { buttonText: ' Sign In' },
    link: { text: 'Create an account', url: '/create_account' },
  };

  if (errorLoading) console.log('ERROR LOADING ITEMS');
  if (errorLoading) return console.log(errorLoading);

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
