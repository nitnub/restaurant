import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppContext from '@/components/context';
import { getCookie } from '@/utils/cookieHandler';

import GET_CART from '@/queries/cart/GetCart.query';
import { useQuery } from '@apollo/client';
import styles from './index.module.css';
import OrderSummary from '@/components/Checkout/CheckoutForm/OrderSummary';
import PaymentSummary from '@/components/Checkout/CheckoutForm/PaymentSummary';
import SubmitOrder from '@/components/Checkout/CheckoutForm/SubmitOrder';

export default function Checkout() {
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

  const defaultPaymentLabel = {
    id: '',
    issuerLogo: '',
    last4: '',
  };

  const defaultCheckoutState = {
    expanded: 'panel1',
    itemsVerified: true,
    ccVerified: false,
    orderConfirmed: false,
    cartCount: ctx.cart.totalCount || cartCookie?.totalCount,
    checkoutCart: ctx.cart || cartCookie?.cart,
    checkoutTotal: ctx.cart.totalCost || cartCookie?.totalCost,
    paymentMethod: defaultPaymentLabel,
  };

  const [checkoutState, setCheckoutState] = useState(defaultCheckoutState);

  if (!defaultCheckoutState.checkoutCart) {
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
      setCheckoutState({
        ...checkoutState,
        expanded: isExpanded ? panel : false,
      });
    };

  useEffect(() => {
    if (ctx.cart) {
      setCheckoutState({
        ...checkoutState,
        cartCount: ctx.cart.totalCount,
        checkoutTotal: ctx.cart.totalCost,
      });
    }
  }, [ctx.cart]);

  const [hydro, setHydro] = useState(false);
  useEffect(() => {
    setHydro(true);
  });
  if (!hydro) {
    return null;
  }

  const checkoutProps = {
    checkoutState,
    setCheckoutState,
    styles,
    handleChange,
  };

  const submitOrderProps = {
    ...checkoutProps,
    cartData,
  };

  return (
    <>
      <Head>
        <title>Restaurant App | Check Out</title>
      </Head>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '1050px' }}>
          <OrderSummary props={checkoutProps} />
          <PaymentSummary props={checkoutProps} />
          <SubmitOrder props={submitOrderProps} />
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
