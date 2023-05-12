import Form from '@/components/Form';
import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext from '@/components/context';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { getCookie } from '@/utils/cookieHandler';
import GET_CART from '@/queries/cart/GetCart.query';
import { useLazyQuery } from '@apollo/client';
import INCREMENT_CART from '@/mutations/cart/AddItemsToCart.mutation';
import { Cart } from '@/types/cartTypes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useRouter } from 'next/router';
import app from '@/utils/firebaseConfig';
import addNewAppUser, { formatAppUserArgs } from '@/utils/addNewAppUser';
import GoogleButton from 'react-google-button';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Head from 'next/head';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
import verifyToken, { readToken } from '@/utils/token';
import OAauthHandler from '@/src/utils/OAuthHandler';
import incrementCart, { formatincrementCartArgs } from '../incrementCart';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const googleSignInHandler = async (ctx) => {
  const OAuth = new OAauthHandler(ctx);
  const GOOGLE_ID = 'www.google.com';

  try {
    const confirmGoogleUser = async (auth, provider) => {
      // Query Google Firebase
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;
      const { photoURL } = user;
      const idToken = await user.getIdToken();

      const { success, message, accessToken } = await OAuth.signInOAuth(
        idToken,
        GOOGLE_ID,
        { image: photoURL }
      );

      return { success, message, accessToken, photoURL };
    };

    const { success, message, accessToken, photoURL } = await confirmGoogleUser(
      auth,
      provider
    );

    if (message === 'invalid signature') {
      setOAuthError(() => 'Unable to identify user.');
      return;
    }

    // ctx.setAvatar(user.photoURL);
    ctx.setAvatar(photoURL);

    // Add the App User
    const { email, id, newUser } = readToken(accessToken);

    const userArgs = formatAppUserArgs(email, id, accessToken);

    await addNewAppUser(userArgs);

    setErrorMessage(() => '');

    let cart: Cart = {
      items: [],
      totalCount: 0,
      totalCost: 0,
    };

    const prevCart = getCookie('cart')?.items || [];

    const incrementCartArgs = formatincrementCartArgs(prevCart, accessToken);

    const result = await addItem(incrementCartArgs);

    cart = result.data.incrementCartResult;

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

// const googleSignInHandler = async (ctx) => {
//   const OAuth = new OAauthHandler(ctx);
//   const GOOGLE_ID = 'www.google.com';

//   try {
//     // const getIdToken = async () => {
//     //   const prevCart = getCookie('cart')?.items || [];
//     //   const result = await signInWithPopup(auth, provider);

//     //   // The signed-in user info.
//     //   const user = result.user;
//     //   // const idToken = await user.getIdToken();
//     //   const idToken = await user.getIdToken();
//     // };

//     const confirmGoogleUser = async (auth, provider) => {
//       // Query Google Firebase
//       const googleResponse = await signInWithPopup(auth, provider);
//       const user = googleResponse.user;
//       const { photoURL } = user;
//       const idToken = await user.getIdToken();

//       const { success, message, accessToken } = await OAuth.signInOAuth(
//         idToken,
//         GOOGLE_ID,
//         { image: photoURL }
//       );

//       return { success, message, accessToken, photoURL };
//     };

//     const { success, message, accessToken, photoURL } = await confirmGoogleUser(
//       auth,
//       provider
//     );

//     if (message === 'invalid signature') {
//       setOAuthError(() => 'Unable to identify user.');
//       return;
//     }

//     // ctx.setAvatar(user.photoURL);
//     ctx.setAvatar(photoURL);

//     // Add the App User
//     const { email, id, newUser } = readToken(accessToken);
//     // const {
//     //   email,
//     //   id: globalUserId,
//     //   newUser,
//     //   authProvider,
//     // } = readToken(accessToken);

//     // const VARIABLES = {
//     //   email,
//     //   globalUserId,
//     // };
//     // const ARGS = {
//     //   variables: VARIABLES,
//     //   context: {
//     //     headers: {
//     //       Authorization: `Bearer ${accessToken}`,
//     //     },
//     //   },
//     // };

//     // const newAppUser = await addNewAppUser(ARGS);
//     // const newAppUser = await addNewAppUser(email, globalUserId, accessToken);
//     await addNewAppUser(email, id, accessToken);

//     // // Generally, if profile is updated, should check the cookie state first

//     setErrorMessage(() => '');

//     let cart: Cart = {
//       items: [],
//       totalCount: 0,
//       totalCost: 0,
//     };

//     const prevUser = getCookie('accessToken');
//     const prevCart = getCookie('cart')?.items || [];

//     // if (prevUser.startsWith('Guest') && prevCart.length > 0) {

//       // const getIncrementItemArgs = (prevCart, accessToken) => {
//       //   const VARIABLES = {
//       //     items: prevCart,
//       //   };

//       //   const ARGS = {
//       //     variables: VARIABLES,
//       //     context: {
//       //       headers: {
//       //         Authorization: `Bearer ${accessToken}`,
//       //       },
//       //     },
//       //   };

//       // }

//       // const VARIABLES = {
//       //   items: prevCart,
//       // };

//       // const ARGS = {
//       //   variables: VARIABLES,
//       //   context: {
//       //     headers: {
//       //       Authorization: `Bearer ${accessToken}`,
//       //     },
//       //   },
//       // };

//       // const result = await incrementCart(prevCart, accessToken );
//       // const result = await addItem(ARGS);

//       // if (addItemLoading) console.log('LOADING ADD ITEM');
//       // if (errorLoading) console.log('ERROR LOADING ITEMS');

//       // if (addItemLoading) return console.log(loading);
//       // if (errorLoading) return console.log(error);

//       // cart = result.data.incrementCartResult;

//       cart = await incrementCart(prevCart, accessToken );
//     // } else {
//       // const VARIABLES = {
//       //   items: [],
//       // };

//       // const ARGS = {
//       //   variables: VARIABLES,
//       //   context: {
//       //     headers: {
//       //       Authorization: `Bearer ${accessToken}`,
//       //     },
//       //   },
//       // };

//       // const result = await addItem(ARGS);
//       // if (loading) console.log(loading);
//       // if (error) return console.log(error);

//       // cart = result.data.incrementCartResult;

//       // cart = await incrementCart([], accessToken);
//     // }

//     if (typeof cart === 'undefined') {
//       return;
//     }

//     // If there are items in the cart response, populate the local cart
//     if (cart.items.length > 0) {
//       document.cookie = `cart=${JSON.stringify(cart)}`;
//       ctx.setCart(cart);
//       ctx.setTotalCount(cart.totalCount);
//       ctx.setTotalCost(cart.totalCost);
//     }

//     if (newUser) {
//       return router.push(
//         {
//           pathname: '/',
//           query: { newUser: true, email },
//         },
//         '/'
//       );
//     }

//     return router.push('/');
//   } catch (error) {
//     console.log(error);
//   }
// };

export default googleSignInHandler;
