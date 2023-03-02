import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SettingsForm from '@/components/Settings/SettingsForm';
import { useQuery } from '@apollo/client';
import { GET_CLIENT_SECRET } from '@/src/graphql/queries';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppContext from '@/components/context';
import { getCookie } from '@/utils/cookieHandler';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styles from './AddStripeCard.module.css';
import CardHeader from '@mui/material/CardHeader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_TEST);

export default function settings() {
  const ARGS = {
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };


  const { data, loading, error } = useQuery(GET_CLIENT_SECRET, ARGS);

  if (loading) {
    console.log('Loading Order History...', loading);
    return <h1>Loading Order History...</h1>;
  }
  if (error) {
    console.log('Error loading Order History...', error);
    return <h1>Loading Order History...</h1>;
  }

  const { clientSecret } = data ? data.clientSecretResult : '';

  const options = {
    clientSecret,
    // appearance: {
    //   /*...*/
    // },
  };

  return (
    data && (
      <>
        <div className={styles.cardContainer}>
          <Card className={styles.card}>
            <CardContent>
              <CardHeader
                title="Enter a payment method"
                subheader="(At least one card is required to complete an order)"
              />
              <Elements stripe={stripePromise} options={options}>
                <SettingsForm />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </>
    )
  );
}
