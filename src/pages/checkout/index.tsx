import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import AppContext from '@/src/components/context';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckoutList from '@/src/components/Checkout/CheckoutList';
import PaymentSelector from '@/src/components/Stripe/PaymentSelector';
import { clearCookie, getCookie } from '@/utils/cookieHandler';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { convertToCurrency } from '@/libs/formatter';
import CREATE_STRIPE_PAYMENT from '@/mutations/payment/CreatePayment.mutation';
import CLEAR_CART from '@/mutations/cart/ClearCart.mutation';
import GET_CART from '@/queries/cart/GetCart';
import { useMutation, useQuery } from '@apollo/client';
import styles from './index.module.css';
import PaymentOption from '@/src/components/Stripe/PaymentOption';
import { Cart } from '@/types/cartTypes';
import Head from 'next/head';
import OrderSummary from '@/components/Checkout/CheckoutForm/OrderSummary';
import PaymentSummary from '@/components/Checkout/CheckoutForm/PaymentSummary';
import SubmitOrder from '@/components/Checkout/CheckoutForm/SubmitOrder';

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
    checkoutTotal:ctx.cart.totalCost || cartCookie?.totalCost,
    paymentMethod: defaultPaymentLabel
  }

  const [checkoutState, setCheckoutState] = useState(defaultCheckoutState);


  const [itemsVerified, setItemsVerified] = useState(true);
  const [ccVerified, setCcVerified] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [cartCount, setCartCount] = useState(
    ctx.cart.totalCount || cartCookie?.totalCount
  );

  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [checkoutCart, setCheckoutCart] = useState<Cart>(
    ctx.cart || cartCookie?.cart
  );
  const [checkoutTotal, setCheckoutTotal] = useState<number>(
    ctx.cart.totalCost || cartCookie?.totalCost
  );

 

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentLabel>(defaultPaymentLabel);

  if (!defaultCheckoutState.checkoutCart) {
    return (
      <>
        <h1>Cart is empty!</h1>
        <Link href={'/'}>Click here to return to the Restaurants lists</Link>
      </>
    );
  }
  // if (!checkoutCart) {
  //   return (
  //     <>
  //       <h1>Cart is empty!</h1>
  //       <Link href={'/'}>Click here to return to the Restaurants lists</Link>
  //     </>
  //   );
  // }

  interface PaymentLabel {
    id: string;
    issuerLogo: string;
    last4: string;
  }

  interface FinalCheckout {
    amount: number;
  }

  // const handleChange =
  //   (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
  //     setExpanded(isExpanded ? panel : false);
  //   };
  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      // setExpanded(isExpanded ? panel : false);
      console.log('logs:')
      console.log({
        panel,
        event, isExpanded
      })
      setCheckoutState({...checkoutState, expanded: isExpanded ? panel : 'false'});
    };

  useEffect(() => {
    if (ctx.cart) {
      // setCartCount(ctx.cart.totalCount);
      // setCartCount(ctx.cart.totalCount);
      setCheckoutState({...checkoutState, cartCount: ctx.cart.totalCount });
      setCheckoutState({...checkoutState, checkoutTotal: ctx.cart.totalCost });
      
      
      // setCheckoutTotal(ctx.cart.totalCost);
    }
  // }, [ctx.cart.items, cartData]);
  }, [ctx.cart]);

  // function panelOneChange() {
  //   handleChange('panel1');
  // }
  const [hydro, setHydro] = useState(false);
  useEffect(() => {
    setHydro(true);
  });
  if (!hydro) {
    return null;
  }

  const orderSummaryProps = {
    checkoutState,
    setCheckoutState,
    // itemsVerified,
    styles,
    // orderConfirmed,
    // setItemsVerified,
    // cartCount,
    // expanded,
    handleChange,
  };

  const paymentSummaryProps = {
    checkoutState,
    setCheckoutState,
    // ccVerified,
    styles,
    // orderConfirmed,
    // paymentMethod,
    // setPaymentMethod,
    // setCcVerified,
    // expanded,
    handleChange,
  };

  const submitOrderProps = {
    checkoutState,
    setCheckoutState,
    // itemsVerified,
    styles,
    // orderConfirmed,
    // expanded,
    // checkoutTotal,
    handleChange,
    cartData,
    // ccVerified,
    // setOrderConfirmed,
    // paymentMethod,
  };

  // console.log(paymentMethod);
  return (
    <>
      <Head>
        <title>Restaurant App | Check Out</title>
      </Head>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '1050px' }}>
          <OrderSummary props={orderSummaryProps} />

          <PaymentSummary props={paymentSummaryProps} />

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
