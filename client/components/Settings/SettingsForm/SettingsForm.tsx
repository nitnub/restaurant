import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import styles from './SettingsForm.module.css';

export default function SettingsForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      // redirect: 'if_required',
      // redirect: 'if_required',
      confirmParams: {
        // redirect: 'if_required',
        // 
      return_url: process.env.NEXT_PUBLIC_STRIPE_UPDATE_STATUS_URL,
        // return_url: '/update_status',
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <PaymentElement />
      <div className={styles.submitContainer}>
        <Button
          className={styles.submitButton}
          variant="contained"
          size="large"
          disabled={!stripe}
          type="submit"
        >
          Submit
        </Button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
