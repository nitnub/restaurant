import { useState } from 'react';
import styles from './UserMenu.module.css';
import AccountBox from '@mui/icons-material/AccountBox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Logout from '@mui/icons-material/Logout';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { getAuth, signOut } from 'firebase/auth';
import app from '@/utils/firebaseConfig';
import AuthorizationHandler from '@/utils/authorizationHandler';
function UserMenu({authHandler, context}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const signOutHandler = async () => {
    handleClose()
    const auth = getAuth(app);

    // Sign out
    authHandler.signOut(false);

    // Sign out firebase OAuth users
    // if (auth.currentUser?.emailVerified) {

    if (context.authProvider === 'google') {
      signOut(auth)
        .then(() => {
          context.setAuthProvider('standard');
          console.log('Signed out of firebase...');
        })
        .catch((error) => {
          console.log('Error signing out of firebase...');
        });
    }
  };


  return (
    <>
      <div>
        <Button
          className={styles.link}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {context.email}
        </Button>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            className={styles.linkStyle}
            href={{
              pathname: '/settings',
            }}
          >
            <ListItemIcon>
              <AccountBox fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </Link>
        </MenuItem>

        <MenuItem onClick={signOutHandler}>
          <Link
            className={styles.linkStyle}
            href={{
              pathname: '/',
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
