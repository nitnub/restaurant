import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import styles from './Drawer.module.css';
import AppContext from '@/components/context';
import Header from '@/components/Cart/CartDrawer/Drawer/Header';
import Checkout from '@/components/Cart/CartDrawer/Links/Checkout';
import SignIn from '@/components/Cart/CartDrawer/Links/SignIn';
import CartComp from '@/components/Cart/CartComp';
import CartList from '@/components/Cart/CartList';
import { cookieDuster, getCookie } from '@/src/utils/cookieHandler';
import AuthorizationHandler from '@/src/utils/authorizationHandler';
import { convertToCurrency } from '@/libs/formatter';

const drawerWidth = 180;

export default function ({ open, setOpen }) {
  const [userIsGuest, setUserIsGuest] = useState();
  const [cartIsEmpty, setCartIsEmpty] = useState(true);
  const ctx = useContext(AppContext).context;
  const router = useRouter();
  const user = getCookie('accessToken') || 'guest';
  const cart = getCookie('cart') || [];
  const ah = new AuthorizationHandler(ctx);

  const uat = async () => {
    const result = await ah.updateAccessToken(ctx);
    let unchecked = true;

    if (unchecked && result.status === 'fail') {
      await ah.signOut(false);
    }

    return () => (unchecked = false);
  };

  useEffect(() => {
    setUserIsGuest(user.toLowerCase().startsWith('guest'));
    if (!cart.items) {
      setCartIsEmpty(() => true);
    } else {
      setCartIsEmpty(() => cart.items.length === 0);
    }

    router.pathname === '/checkout' ? setOpen(false) : null;
    cookieDuster('accessToken', uat, ctx);
  }, [user, ctx]);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={router.pathname !== '/checkout' && open}
    >
      <div className={styles.Header}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Header className={styles.cartSummary}>
            <div className={styles.cartSummaryContainer}>
              <div>
                <IconButton onClick={() => setOpen(false)}>
                  <CartComp />
                </IconButton>
              </div>
              <div className={styles.priceSummary}>
                <div className={styles.priceLabel}>Total:&nbsp;</div>
                <div className={styles.priceAmount}>
                  {convertToCurrency(ctx.cart.totalCost)}
                </div>
              </div>
            </div>
          </Header>
        </div>

        <div className={styles.headerCheckout}>
          {(userIsGuest && SignIn(ctx)) ||
            (cartIsEmpty && <div>Cart is empty...</div>) ||
            Checkout(ctx, () => setOpen(false))}
        </div>
      </div>
      <Divider />
      <CartList />
      <Divider />
      <div></div>
    </Drawer>
  );
}
