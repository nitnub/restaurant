// Note: This stripe workflow is largely standard boilerplate code from stripe.com.

import React, { useContext, useEffect, useState } from 'react';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import styles from './index.module.css';
import AppContext from '@/src/context/context';
import { Action } from '@/src/context/context.types';
import { getCookie } from '@/utils/cookieHandler';
import Head from 'next/head';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Wrapper = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentStatus {...props} />
  </Elements>
);

const PaymentStatus = (props) => {
  const { ctx, dispatch } = useContext(AppContext);
  const stripe = useStripe();
  const [cardTitle, setCardTitle] = useState('Verifying...');
  const [pageTitle, setPageTitle] = useState('Updating Payment Methods...');
  const [message, setMessage] = useState(null);

  const cart = getCookie('cart') || [];
  const hasCart = Object.keys(cart).length > 0;

  useEffect(() => {
    hasCart && dispatch({ type: Action.UPDATE_CART, payload: cart });
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "setup_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'setup_intent_client_secret'
    );

    // Retrieve the SetupIntent
    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      // Inspect the SetupIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (setupIntent.status) {
        case 'succeeded':
          setPageTitle('Payment Methods Updated!');
          setCardTitle('Success!');
          setMessage(
            'Success! Your payment method has been saved and will be available at checkout.'
          );
          break;

        case 'processing':
          setPageTitle('Updateing Payment Methods...');
          setCardTitle('Processing...');
          setMessage(
            "Processing payment details. We'll update you when processing is complete."
          );
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setPageTitle('Unable to Update Payment Methods');
          setCardTitle('Unable to Process');
          setMessage(
            'Failed to process payment details. Please try another payment method.'
          );
          break;
      }
    });
  }, [stripe]);

  return (
    <div className={styles.updateConfContainer}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className={styles.cardContainer}>
        <Card className={styles.updateCard}>
          <CardContent className={styles.formCardContent}>
            <CardHeader title={cardTitle} />
            {message}
            <Button>
              <Link href={'/'}>Go to restaurants</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wrapper;
