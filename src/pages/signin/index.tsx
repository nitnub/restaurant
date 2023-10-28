import { Dispatch, useContext, useState } from 'react';
import Form from '@/components/Form';
import { Context, useMutation } from '@apollo/client';
import AppContext from '@/src/context/context';
import { Action, ActionPayload, ContextReducer } from '@/src/context/context.types';

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
import { SignInWithGoogleProps, googleSignInHandler } from '@/src/utils/signInHandlers/signIn.oAuth';
import { signInAuthServerHandler } from '@/src/utils/signInHandlers/signIn.auth';
import { useGetAddAppUserMutation } from '@/src/utils/customHooks';

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

// interface SignInProps extends SignInWithGoogleProps {
//   ctx: Context,
//   dispatch: ContextReducer,
//   addNewAppUser,
//   addItem,
//   updateError,
// }

export default function SignIn() {
  const [error, setError] = useState({ general: '', oAuth: '' });
  const [addItem, { error: errorLoading }] = useMutation(INCREMENT_CART);
  // const [addNewAppUser] = useMutation(ADD_APP_USER);
  const addNewAppUser = useGetAddAppUserMutation();
  const { ctx, dispatch }: Context = useContext(AppContext);
  const router = useRouter();

  const updateError = (type: SignInError, message: string) => {
    setError({ ...error, ...{ [type]: message } });
  };

  const signInProps: SignInWithGoogleProps = {
    ctx,
    dispatch,
    addNewAppUser,
    addItem,
    updateError,
  };

  const signInWithGoogle = async () => {
    const res = await googleSignInHandler(signInProps);
    res && setUIToUser(dispatch, router, res);
  };

  const signInWithEmail = async (userCreds: UserCredentials) => {
    const res = await signInAuthServerHandler({ ...signInProps, ...userCreds });
    res && setUIToUser(dispatch, router, res);
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

function setUIToUser(
  dispatch: Dispatch<ActionPayload>,
  router: NextRouter,
  res
) {
  updateCookieObject('cart', res.cart);

  dispatch({
    type: Action.UPDATE_UI_FOR_USER,
    payload: { avatar: res.photoURL, cart: res.cart },
  });

  routeUserToHomepage(router, res.email, res.newUser);
}
