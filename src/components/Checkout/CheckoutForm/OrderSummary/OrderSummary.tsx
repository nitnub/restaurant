import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CheckoutList from '@/src/components/Checkout/CheckoutList';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function OrderSummary({ props }) {
  // const orderSummaryProps = {
  //   itemsVerified,
  //   styles
  // }

  const {
    checkoutState,
    setCheckoutState,
    // itemsVerified,
    styles,
    // orderConfirmed,
    // setItemsVerified,
    // cartCount,
    // expanded,
    handleChange,
  } = props;

  const { expanded, itemsVerified, orderConfirmed, cartCount } = checkoutState;
  console.log('expanded: ', expanded);
  return (
    <Accordion
      expanded={expanded === 'panel1'}
      defaultExpanded={true}
      onChange={handleChange('panel1')}
    >
      <div className={itemsVerified ? styles.verified : styles.pending}>
        <AccordionSummary
          className={itemsVerified ? styles.verified : styles.pending}
          // onClick={() => setItemsVerified(() => true)}
          onClick={() =>
            setCheckoutState({ ...checkoutState, itemsVerified: true })
          }
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          disabled={orderConfirmed}
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Order Summary
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
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
