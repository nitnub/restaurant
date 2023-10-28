import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AppContext from '@/src/context/context';
import { getCookie } from '@/utils/cookieHandler';

import GET_CART from '@/queries/cart/GetCart.query';
import { useQuery } from '@apollo/client';
import styles from './index.module.css';
import OrderSummary from '@/components/Checkout/CheckoutForm/OrderSummary';
import PaymentSummary from '@/components/Checkout/CheckoutForm/PaymentSummary';
import SubmitOrder from '@/components/Checkout/CheckoutForm/SubmitOrder';
import { useCartQuery } from '@/src/utils/customHooks';

export default function Checkout() {
  const { ctx } = useContext(AppContext);
  const user = getCookie('accessToken') || 'guest';

  const { data: cartData } = useCartQuery();

  const cartCookie = getCookie('cart');

  const defaultPaymentLabel = {
    id: '',
    issuerLogo: '',
    last4: '',
  };

  const defaultCheckoutState = {
    expanded: 'panel1', // set default to panel1 = expanded
    itemsVerified: true,
    ccVerified: false,
    orderConfirmed: false,
    cartCount: ctx.cart.totalCount || cartCookie?.totalCount,
    checkoutCart: ctx.cart || cartCookie?.cart,
    checkoutTotal: ctx.cart.totalCost || cartCookie?.totalCost,
    paymentMethod: defaultPaymentLabel,
  };

  const [checkoutState, setCheckoutState] = useState(defaultCheckoutState);
  useEffect(() => {
    if (ctx.cart) {
      setCheckoutState({
        ...checkoutState,
        cartCount: ctx.cart.totalCount,
        checkoutTotal: ctx.cart.totalCost,
      });
    }
  }, [ctx, user]);

  const [hydro, setHydro] = useState(false);
  useEffect(() => {
    setHydro(true);
  }, []);
  if (!hydro) {
    return null;
  }

  if (!defaultCheckoutState.checkoutCart) {
    return (
      <>
        <h1>Cart is empty!</h1>
        <Link href={'/'}>Click here to return to the Restaurants lists</Link>
      </>
    );
  }

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setCheckoutState({
        ...checkoutState,
        expanded: isExpanded ? panel : false,
      });
    };

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

export async function getServerSideProps({ req, res }) {
  return { props: { data: req.headers.cookie } };
}
