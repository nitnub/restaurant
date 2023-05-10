import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CheckoutList from '@/src/components/Checkout/CheckoutList';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function OrderSummary({ props }) {
  const { checkoutState, styles, handleChange } = props;

  const { expanded, itemsVerified, orderConfirmed, cartCount } = checkoutState;

  return (
    <Accordion
      expanded={expanded === 'panel1'}
      defaultExpanded={true}
      onChange={handleChange('panel1')}
    >
      <div className={itemsVerified ? styles.verified : styles.pending}>
        <AccordionSummary
          className={itemsVerified ? styles.verified : styles.pending}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          disabled={orderConfirmed}
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Order Summary
          </Typography>
          <Typography sx={{ color: 'text.secondary' }} variant={'div'}>
            <div className={itemsVerified ? styles.verified : styles.pending}>
              {orderConfirmed ? 'Order Complete!' : createCartLabel(cartCount)}
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
  );
}

function createCartLabel(count: string | number) {
  if (Number(count) === 1) return '1 Item';
  return `${count} items`;
}
