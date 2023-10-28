import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SettingsForm from '@/components/Settings/SettingsForm';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styles from './AddStripeCard.module.css';
import CardHeader from '@mui/material/CardHeader';
import { useClientSecretQuery } from '@/src/utils/customHooks';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_TEST);

export default function AddStripeCard() {
  const { data, loading, error } = useClientSecretQuery();

  if (loading) {
    console.log('Loading Order History...');
    return <h1>Loading Order History...</h1>;
  }
  if (error) {
    console.log('Error loading Order History...');
    return <h1>Loading Order History...</h1>;
  }

  const { clientSecret } = data ? data.clientSecretResult : '';
  const options = { clientSecret };

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
