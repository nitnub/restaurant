import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UserBanner from '@/components/UserBanner';
import styles from '../CartDrawer.module.css';
import CartComp from '@/components/Cart/CartComp';

const drawerWidth = 180;

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

export default function ({ open, setOpen }) {
  const router = useRouter();

  return (
    <AppBar
      className="header"
      position="fixed"
      open={open}
      style={{ background: '#4e4740' }} // Inline styling is needed as a result of docker errors / no loading of some CSS from the related module and/or global css file.
    >
      <Toolbar style={{ width: '100%' }}>
        <Typography component={'span'} variant="h6" noWrap sx={{ flexGrow: 1 }}>
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
          onClick={() => setOpen(true)}
          disabled={router.pathname === '/checkout'}
          sx={{ ...(open && { display: 'none' }) }}
        >
          <CartComp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
