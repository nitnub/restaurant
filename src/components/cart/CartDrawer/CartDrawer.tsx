import { useContext, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CartComp from '@/components/cart/CartComp';
// import AppContext from '../../context';
import AppContext from '@/components/context';
import { convertToCurrency } from '@/libs/formatter';
import styles from './CartDrawer.module.css';
import UserBanner from '@/components/UserBanner';
import LocalCart from '@/utils/LocalCart';
import AuthorizationHandler from '@/utils/authorizationHandler';
import CartList from '@/components/cart/CartList';
import { cookieDuster, cookieIsEmpty, getCookie } from '@/utils/cookieHandler';
import { newGuestID } from '@/utils/newGuestID';
import { useRouter } from 'next/router';

const drawerWidth = 180;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function CartDrawer() {
  const router = useRouter();
  const [cartIsEmpty, setCartIsEmpty] = useState(true);
  // const [checkoutLabel, setCheckoutLabel] = useState('');
  // const theme = useTheme();
  const ctx = useContext(AppContext);
  const ah = new AuthorizationHandler(ctx);
  // const userID = ah.getProfile().id || 'guest';
  // const lc = new LocalCart();
  const [open, setOpen] = useState(false);
  const [userIsGuest, setUserIsGuest] = useState();
  const user = getCookie('accessToken') || 'guest';
  const cart = getCookie('cart') || [];

  // const hasCart = Object.keys(cart).length > 0;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setUserIsGuest(user.toLowerCase().startsWith('guest'));
    if (!cart.items) {
      setCartIsEmpty(() => true);
    } else {
      setCartIsEmpty(() => cart.items.length === 0);
    }
    const uat = async () => {
      const result = await ah.updateAccessToken(ctx);

      let unchecked = true;
      if (unchecked && result.status === 'fail') {
        await ah.signOut(false);
      }
      return () => {
        unchecked = false;
      };
    };
    // setOpen(() => router.pathname !== '/checkout');
    router.pathname === '/checkout' ? setOpen(false) : null;
    cookieDuster('accessToken', uat, ctx);
  }, [user, ctx]);

  let guestID: string;
  if (cookieIsEmpty('accessToken')) {
    guestID = newGuestID();
    document.cookie = `accessToken=${guestID}`;
    ctx.setAccessToken(guestID);
  }

  const goToSignIn = (
    <Link
      className="plainLink"
      href="/signin"
      // @ts-ignore
      variant="contained"
      color="success"
      disabled={cartIsEmpty}
      onClick={async () => {
        ctx.setCheckoutCart(ctx.cart);
      }}
    >
      {userIsGuest && 'Sign In To Order'}
    </Link>
  );
  const goToCheckout = (
    <Link
      href="/checkout"
      // @ts-ignore
      variant="contained"
      color="success"
      size="small"
      onClick={async () => {
        handleDrawerClose();
        ctx.setCheckoutCart(ctx.cart);
      }}
    >
      Check Out
    </Link>
  );
  const emptyLabel = <div>Cart is empty...</div>;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          className="header"
          position="fixed"
          open={open}
          style={{ background: '#4e4740' }} // Inline styling is needed as a result of docker errors / no loading of some CSS from the related module and/or global css file.
        >
          <Toolbar style={{ width: '100%' }}>
            <Typography
              component={'span'}
              variant="h6"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <nav>
                <Link className={styles.brand} href="/">
                  Restaurant App
                </Link>
              </nav>
            </Typography>
            <UserBanner />
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              disabled={router.pathname === '/checkout'}
              sx={{ ...(open && { display: 'none' }) }}
            >
              <CartComp />
            </IconButton>
          </Toolbar>
        </AppBar>

        <>
          <Main open={open}>
            <DrawerHeader />
          </Main>

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
            <div className={styles.drawerHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DrawerHeader className={styles.cartSummary}>
                  <div className={styles.cartSummaryContainer}>
                    <div>
                      <IconButton onClick={handleDrawerClose}>
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
                </DrawerHeader>
              </div>

              <div className={styles.headerCheckout}>
                {(userIsGuest && goToSignIn) ||
                  (cartIsEmpty && emptyLabel) ||
                  goToCheckout}
              </div>
            </div>
            <Divider />
            <CartList />
            <Divider />
            <div></div>
          </Drawer>
        </>
      </Box>
    </>
  );
}
