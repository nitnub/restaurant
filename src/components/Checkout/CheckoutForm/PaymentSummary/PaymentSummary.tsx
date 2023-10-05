import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaymentOption from '@/components/Stripe/PaymentOption';
import PaymentSelector from '@/components/Stripe/PaymentSelector';
import Link from 'next/link';

export default function PaymentSummary({ props }) {
  const { checkoutState, setCheckoutState, styles, handleChange } = props;
  const { expanded, ccVerified, orderConfirmed, paymentMethod } = checkoutState;

  return (
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
              <div className={ccVerified ? styles.verified : styles.pending}>
                Select Card
              </div>
            )}
          </Typography>
        </AccordionSummary>
      </div>

      <AccordionDetails>
        <div className={styles.paymentPane}>
          <PaymentSelector
            checkoutState={checkoutState}
            setCheckoutState={setCheckoutState}
          />
          <Link className={styles.settingsLink} href={'/settings'}>
            Go to Settings to add a card
          </Link>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
