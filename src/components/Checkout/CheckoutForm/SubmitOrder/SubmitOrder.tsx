import { useContext } from 'react';
import AppContext from '@/src/context/context';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { convertToCurrency } from '@/libs/formatter';
import { updateCookieObject } from '@/utils/cookieHandler';

import { Action } from '@/src/context/context.types';
import {
  useClearCartMutation,
  useCreateStripePaymentMutation,
} from '@/src/utils/customHooks';

interface PaymentLabel {
  id: string;
  issuerLogo: string;
  last4: string;
}

export default function SubmitOrder({ props }) {
  const { dispatch } = useContext(AppContext);

  const { checkoutState, setCheckoutState, styles, handleChange } = props;

  const {
    expanded,
    itemsVerified,
    ccVerified,
    orderConfirmed,
    checkoutTotal,
    paymentMethod,
  } = checkoutState;

  let [
    createStripePayment,
    { data: paymentData, loading: paymentLoading, error: paymentError },
  ] = useCreateStripePaymentMutation(checkoutTotal, paymentMethod.id);

  const [clearCartCache] = useClearCartMutation();

  const submitPayment = async (e) => {
    e.preventDefault();

    const response = await createStripePayment();

    if (response.data.createPaymentResult.__typename === 'StripeError') {
      return;
    }

    updateCookieObject('cart', { items: [], totalCost: 0, totalCount: 0 });
    await clearCartCache();

    setCheckoutState({
      ...checkoutState,
      orderConfirmed: true,
    });

    dispatch({ type: Action.CLEAR_CART });
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
