import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import AppContext from '@/components/context';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckoutList from '@/components/Checkout/CheckoutList';
import PaymentSelector from '@/components/Stripe/PaymentSelector';
import { clearCookie, getCookie } from '@/utils/cookieHandler';

import Button from '@mui/material/Button';
import Link from 'next/link';

import { convertToCurrency } from '@/libs/formatter';
import { CLEAR_CART, CREATE_STRIPE_PAYMENT } from '@/src/graphql/mutations';
import { GET_CART, GET_OFFICIAL_TOTAL } from '@/src/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import styles from './index.module.css';
import PaymentOption from '@/components/Stripe/PaymentOption';
import { Cart } from '@/types/cartTypes';
import Head from 'next/head';

export default function Checkout(props) {
  const ctx = useContext(AppContext);
  const CART_ARGS = {
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useQuery(GET_CART, CART_ARGS);

  const cartCookie = getCookie('cart');

  const [itemsVerified, setItemsVerified] = useState(false);
  const [ccVerified, setCcVerified] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [cartCount, setCartCount] = useState(
    ctx.cart.totalCount || cartCookie?.totalCount
  );

  const [expanded, setExpanded] = useState<string | false>(false);
  const [checkoutCart, setCheckoutCart] = useState<Cart>(
    ctx.cart || cartCookie?.cart
  );
  const [checkoutTotal, setCheckoutTotal] = useState<number>(
    ctx.cart.totalCost || cartCookie?.totalCost
  );

  const defaultPaymentLabel = {
    id: '',
    issuerLogo: '',
    last4: '',
  };

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentLabel>(defaultPaymentLabel);

  if (!checkoutCart) {
    return (
      <>
        <h1>Cart is empty!</h1>
        <Link href={'/'}>Click here to return to the Restaurants lists</Link>
      </>
    );
  }

  interface PaymentLabel {
    id: string;
    issuerLogo: string;
    last4: string;
  }

  interface FinalCheckout {
    amount: number;
  }

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    if (ctx.cart) {
      setCartCount(ctx.cart.totalCount);
      setCheckoutTotal(ctx.cart.totalCost);
    }
  }, [ctx.cart.items, cartData]);

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

  if (paymentLoading) console.log('Loading official total...');
  if (paymentError)
    console.log('Error loading official total...', paymentError);

  function panelOneChange() {
    handleChange('panel1');
  }
  const [hydro, setHydro] = useState(false);
  useEffect(() => {
    setHydro(true);
  });
  if (!hydro) {
    return null;
  }
  const submitPayment = async (e) => {
    e.preventDefault();
    const response = await createStripePayment();

    // empty cart
    const freshCart = { items: [], totalCost: 0, totalCount: 0 };
    // clearCookie('cart');
    document.cookie = `cart=${JSON.stringify(freshCart)}`;

    ctx.setCart(freshCart);

    // clear out cart in redis
    const tsc = await clearCartCache();
    setOrderConfirmed(true);
  };

  return (
    <>
      <Head>
        <title>Restaurant App | Check Out</title>
      </Head>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '1050px' }}>
          <Accordion
            expanded={expanded === 'panel1'}
            defaultExpanded={true}
            onChange={handleChange('panel1')}
          >
            <div className={itemsVerified ? styles.verified : styles.pending}>
              <AccordionSummary
                className={itemsVerified ? styles.verified : styles.pending}
                onClick={() => setItemsVerified(() => true)}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                disabled={orderConfirmed}
                id="panel1bh-header"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Order Summary
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  <div
                    className={itemsVerified ? styles.verified : styles.pending}
                  >
                    {orderConfirmed
                      ? 'Order Complete!'
                      : createCartLabel(cartCount)}
                  </div>
                </Typography>
              </AccordionSummary>
            </div>

            <AccordionDetails>
              <div>
                <CheckoutList />
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <div className={ccVerified ? styles.verified : styles.pending}>
              <AccordionSummary
                className={ccVerified ? styles.verified : styles.pending}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                disabled={orderConfirmed}
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  Confirm Payment Method
                </Typography>
                <Typography sx={{ color: 'text.secondary' }} variant={'div'}>
                  {paymentMethod.id ? (
                    <div>
                      <PaymentOption paymentProps={paymentMethod} />
                    </div>
                  ) : (
                    <div
                      className={ccVerified ? styles.verified : styles.pending}
                    >
                      Select Card
                    </div>
                  )}
                </Typography>
              </AccordionSummary>
            </div>

            <AccordionDetails>
              <div className={styles.paymentPane}>
                <PaymentSelector
                  setPaymentMethod={setPaymentMethod}
                  setCcVerified={setCcVerified}
                />
                <Link className={styles.settingsLink} href={'/settings'}>
                  Go to Settings to add a card
                </Link>
              </div>
            </AccordionDetails>
          </Accordion>
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
                        className={
                          itemsVerified ? styles.verified : styles.pending
                        }
                      >
                        {' '}
                        Payment Submitted!
                      </div>
                    ) : (
                      checkoutTotal && (
                        <div>{convertToCurrency(checkoutTotal)}</div>
                      )
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

                {itemsVerified && ccVerified ? (
                  <Button
                    disabled={
                      paymentData?.createPaymentResult.status === 'succeeded'
                    }
                    className={styles.submitButton}
                    onClick={(e) => submitPayment(e)}
                  >
                    Submit Payment
                  </Button>
                ) : (
                  `Please verify your items and method of payment before checking out.`
                )}
                <Link className={styles.settingsLink} href={'/settings'}>
                  Go to Settings to view Order History
                </Link>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
}

function createCartLabel(count: string | number) {
  if (Number(count) === 1) return '1 Item';
  return `${count} items`;
}

export async function getServerSideProps({ req, res }) {
  return { props: { data: req.headers.cookie } };
}
