import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import PaymentOption from '@/components/Stripe/PaymentOption';
import styles from './PaymentSelector.module.css';
import GET_PAYMENT_METHODS from '@/queries/payment/GetStripePaymentMethods';
import { useQuery } from '@apollo/client';
import { getCookie } from '@/utils/cookieHandler';

export default function PaymentSelector({
  // setPaymentMethod,
  // setCcVerified,
  setCheckoutState,
  checkoutState,
}) {
  const ARGS = {
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const { data, loading, error } = useQuery(GET_PAYMENT_METHODS, ARGS);
  if (loading) {
    // console.log('Loading payment options...');
    return <h3>Loading...</h3>;
  }

  let paymentMethods;
  if (data && data.paymentMethodsResult) {
    paymentMethods = data.paymentMethodsResult.paymentMethods;
  }
  if (error) {
    console.log('Loading Payment Error...', error);
    return (
      <>
        <h3>Error processing payment...</h3>
        <p>{JSON.stringify(error)}</p>
      </>
    );
  }

  const handler = (option, expYear: number, expMonth: number) => {
    const paymentMethod = {
      id: option.id,
      brand: option.card.brand,
      last4: option.card.last4,
      expYear,
      expMonth,
    };
    setCheckoutState({ ...checkoutState, paymentMethod, ccVerified: true });
    // setCcVerified(true);
    // setPaymentMethod({
    //   id: option.id,
    //   brand: option.card.brand,
    //   last4: option.card.last4,
    //   expYear,
    //   expMonth,
    // });
  };

  return (
    <FormControl>
      <FormLabel id="radio-group-label">Available Cards</FormLabel>
      <RadioGroup
        aria-labelledby="radio-group-label"
        name="radio-buttons-group"
      >
        {paymentMethods &&
          paymentMethods.map((option, index) => {
            const { brand, expMonth, expYear, last4 } = option.card;
            const paymentProps = { brand, expMonth, expYear, last4 };
            return (
              <div key={index} className={styles.selection}>
                <Radio
                  value={option.id}
                  onClick={() => handler(option, expYear, expMonth)}
                  // onClick={() => {
                  //   setCcVerified(true);
                  //   setPaymentMethod({
                  //     id: option.id,
                  //     brand: option.card.brand,
                  //     last4: option.card.last4,
                  //     expYear,
                  //     expMonth,
                  //   });
                  // }}
                />
                <PaymentOption paymentProps={paymentProps} />
              </div>
            );
          })}
      </RadioGroup>
    </FormControl>
  );
}
