import { useContext, useState } from 'react';
import Form from '@/components/Form';
import { Context, useMutation } from '@apollo/client';
import AppContext from '@/components/context';
import { updateCookieObject } from '@/utils/cookieHandler';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { NextRouter, useRouter } from 'next/router';
import GoogleButton from 'react-google-button';
import Head from 'next/head';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';

import routeUserToHomepage from '@/utils/routing/routeUserToHomepage';
import { googleSignInHandler } from '@/src/utils/signInHandlers/signIn.oAuth';
import { signInAuthServerHandler } from '@/src/utils/signInHandlers/signIn.auth';

export enum SignInError {
  GENERAL = 'general',
  O_AUTH = 'oAuth',
}

interface UserCredentials {
  email: string;
  password: string;
}

const formFooter = {
  submitButton: { buttonText: ' Sign In' },
  link: { text: 'Create an account', url: '/create_account' },
};

export default function SignIn() {
  const [error, setError] = useState({ general: '', oAuth: '' });
  const [addItem, { error: errorLoading }] = useMutation(INCREMENT_CART);
  const [addNewAppUser] = useMutation(ADD_APP_USER);
  const ctx: Context = useContext(AppContext);
  const router = useRouter();

  const updateError = (type: SignInError, message: string) => {
    setError({ ...error, ...{ [type]: message } });
  };

  const signInProps = {
    ctx,
    addNewAppUser,
    addItem,
    updateError,
  };

  const signInWithGoogle = async () => {
    const res = await googleSignInHandler(signInProps);
    res && setUIToUser(ctx, router, res);
  };

  const signInWithEmail = async (userCreds: UserCredentials) => {
    const res = await signInAuthServerHandler({ ...signInProps, ...userCreds });
    res && setUIToUser(ctx, router, res);
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
              handler={signInWithEmail}
              footer={formFooter}
            />
            <div>{error.general}</div>
          </CardContent>

          <div className="sectionBreak">&nbsp;or&nbsp;</div>
          <br />
          <GoogleButton style={{ width: '200px' }} onClick={signInWithGoogle} />

          {error.oAuth ? (
            <div className="error-text">
              <div>{error.oAuth}</div>
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

function setUIToUser(ctx: Context, router: NextRouter, res) {
  updateCookieObject('cart', res.cart);

  ctx.setAvatar(res.photoURL);
  if (res.cart.items.length > 0) {
    ctx.setCart(res.cart);
  }

  routeUserToHomepage(router, res.email, res.newUser);
}
