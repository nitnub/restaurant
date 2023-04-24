import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import AppContext from '@/src/components/context';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Link from 'next/link';
import CheckoutList from '@/src/components/Checkout/CheckoutList';
import GET_CART from '@/queries/cart/GetCart';
import CLEAR_CART from '@/mutations/cart/ClearCart.mutation';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { convertToCurrency } from '@/libs/formatter';
import { getCookie } from '@/utils/cookieHandler';
import { useMutation, useQuery } from '@apollo/client';
import CREATE_STRIPE_PAYMENT from '@/mutations/payment/CreatePayment.mutation';

interface PaymentLabel {
  id: string;
  issuerLogo: string;
  last4: string;
}

export default function SubmitOrder({ props }) {
  const ctx = useContext(AppContext);

  const {
    checkoutState,
    setCheckoutState,
    // itemsVerified,
    styles,
    // orderConfirmed,
    // expanded,
    // checkoutTotal,
    // paymentMethod,
    handleChange,
    cartData,
    // ccVerified,
    // setOrderConfirmed,
  } = props;

  const {
    expanded,
    itemsVerified,
    ccVerified,
    orderConfirmed,
    checkoutTotal,
    paymentMethod,
  } = checkoutState;

  const PAYMENT_VARIABLES = {
    amount: cartData?.getCartResult.totalCost,

    path: '/',
    paymentMethodID: paymentMethod.id,
  };

  const PAYMENT_ARGS = {
    variables: PAYMENT_VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const [
    createStripePayment,
    { data: paymentData, loading: paymentLoading, error: paymentError },
  ] = useMutation(CREATE_STRIPE_PAYMENT, PAYMENT_ARGS);

  const CLEAR_CART_ARGS = {
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const [
    clearCartCache,
    { data: clearCartData, loading: clearCartLoading, error: clearCartError },
  ] = useMutation(CLEAR_CART, CLEAR_CART_ARGS);

  const submitPayment = async (e) => {
    e.preventDefault();
    const response = await createStripePayment();

    if (response.data.createPaymentResult.__typename !== 'StripeError') {
      // empty cart
      const freshCart = { items: [], totalCost: 0, totalCount: 0 };

      document.cookie = `cart=${JSON.stringify(freshCart)}`;
      ctx.setCart(freshCart);

      // clear out cart in redis
      await clearCartCache();
      // setOrderConfirmed(true);
      setCheckoutState({
        ...checkoutState,
        orderConfirmed: true,
      });
    }
  };

  if (paymentLoading) console.log('Loading official total...');
  if (paymentError)
    console.log('Error loading official total...', paymentError);

  const displaySubmitPayment = () => {
    return (
      <Button
        disabled={paymentData?.createPaymentResult.status === 'succeeded'}
        className={styles.submitButton}
        onClick={(e) => submitPayment(e)}
      >
        Submit Payment
      </Button>
    );
  };

  return (
    <Accordion
      expanded={expanded === 'panel3'}
      onChange={handleChange('panel3')}
    >
      <div className={orderConfirmed ? styles.verified : styles.pending}>
        <AccordionSummary
          className={orderConfirmed ? styles.verified : styles.pending}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Submit Order
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant={'div'}>
            <div>
              {orderConfirmed ? (
                <div
                  className={itemsVerified ? styles.verified : styles.pending}
                >
                  {' '}
                  Payment Submitted!
                </div>
              ) : (
                checkoutTotal && <div>{convertToCurrency(checkoutTotal)}</div>
              )}
            </div>
          </Typography>
        </AccordionSummary>
      </div>

      <AccordionDetails>
        <div className={styles.submitOrderPane}>
          {paymentData?.createPaymentResult.status === 'succeeded' && (
            <div className={styles.confirmation}>
              <div>Your order was successfully submitted!</div>
              {orderConfirmed ? (
                <div>Order Complete</div>
              ) : (
                <div>{`Total Charge: ${convertToCurrency(
                  paymentData.createPaymentResult.amountReceived || 0
                )}`}</div>
              )}
            </div>
          )}
          {paymentData?.createPaymentResult.message && (
            <div>
              <div>Unable to complete order. Please try again.</div>
            </div>
          )}

          {itemsVerified && ccVerified
            ? displaySubmitPayment()
            : `Please verify your items and method of payment before checking out.`}
          <Link className={styles.settingsLink} href={'/settings'}>
            Go to Settings to view Order History
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

function createCartLabel(count: string | number) {
  if (Number(count) === 1) return '1 Item';
  return `${count} items`;
}
