import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import styles from './UserBanner.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppContext from '../context';
import Link from 'next/link';
import AuthorizationHandler from '@/utils/authorizationHandler';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import AccountBox from '@mui/icons-material/AccountBox';
import Logout from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import app from '@/utils/firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { getCookie } from '@/utils/cookieHandler';
import UserMenu from './UserMenu';

function UserBanner() {
  let profile = { email: '' };
  const ctx = useContext(AppContext);
  const authHandler = new AuthorizationHandler(ctx);

  if (typeof document !== 'undefined') {
    profile = authHandler.getProfile();
  }
  const avatar: string = getCookie('avatar');

  useEffect(() => {
    profile = authHandler.getProfile();
    const label = (profile.email as string) || 'Sign In';

    ctx.setEmail(label);
    ctx.setAvatar(avatar);
  }, [ctx.email]);

  console.log('CTX IS:');
  console.log(ctx);
  console.log('xxxxxxxxxxxxxxxxxxxxxxxx');
  console.log();
  console.log();

  console.log('avatar is...');
  console.log(avatar);

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const signOutHandler = async () => {
  //   const auth = getAuth(app);

  //   // Sign out
  //   authHandler.signOut(false);

  //   // Sign out firebase OAuth users
  //   // if (auth.currentUser?.emailVerified) {

  //   if (ctx.authProvider === 'google') {
  //     signOut(auth)
  //       .then(() => {
  //         ctx.setAuthProvider('standard');
  //         console.log('Signed out of firebase...');
  //       })
  //       .catch((error) => {
  //         console.log('Error signing out of firebase...');
  //       });
  //   }
  // };

  return ctx.email === 'Sign In' ? (
    <div className={styles.container}>
      {/* <AccountCircleIcon sx={{ width: 30, height: 30 }} /> */}
      <AccountBoxIcon sx={{ width: 30, height: 30 }} />
      <Link href="/signin" className={styles.link}>
        {ctx.email}
      </Link>
    </div>
  ) : (
    <div className={styles.container}>
      {avatar.startsWith('h') ? (
        <img
          className={styles.avatar}
          alt="An avatar image for the signed in user"
          src={avatar.toString()}
          referrerPolicy="no-referrer" // Required to eliminate inconsistent rendering in Chrome
        />
      ) : (
        <AccountBoxIcon sx={{ width: 30, height: 30 }} />
      )}

      <UserMenu authHandler={authHandler} context={ctx} />

      {/* <div >
        <Button
          className={styles.link}
         
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {ctx.email}
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
        <MenuItem>
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
      </Menu> */}
    </div>
  );
}

export default UserBanner;
