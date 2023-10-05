import React, { useEffect } from 'react';
import { useContext } from 'react';
import styles from './UserBanner.module.css';
import AppContext from '@/src/context/context';
import { Action } from '@/src/context/context.types';
import Link from 'next/link';
import AuthorizationHandler from '@/utils/authorizationHandler';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { getCookie } from '@/utils/cookieHandler';
import UserMenu from './UserMenu';

function UserBanner() {
  let profile = { email: '' };
  const { ctx, dispatch } = useContext(AppContext);
  const avatar: string = getCookie('avatar') || '';
  const authHandler = new AuthorizationHandler({ ctx, dispatch });

  if (typeof document !== 'undefined') {
    profile = authHandler.getProfile();
  }

  useEffect(() => {
    profile = authHandler.getProfile();
    const label = (profile.email as string) || 'Sign In';

    dispatch({ type: Action.UPDATE_USER, payload: { email: label, avatar } });
  }, [ctx.user.email]);

  return ctx.user.email === 'Sign In' ? (
    <div className={styles.container}>
      <AccountBoxIcon sx={{ width: 30, height: 30 }} />
      <Link href="/signin" className={styles.link}>
        {ctx.user.email}
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
      <UserMenu authHandler={authHandler} />
    </div>
  );
}

export default UserBanner;
