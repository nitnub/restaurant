import AuthorizationHandler from './authorizationHandler';
import AppContext from '@/components/context';
import { useContext } from 'react';
import { Context } from '@apollo/client';

// const ctx = useContext(AppContext)
const ah = new AuthorizationHandler();

export const getCookie = (cookieName: string) => {
  if (typeof document === 'undefined') return;

  const cookie = document.cookie;

  try {
    const step1 = cookie.split(`${cookieName}=`)[1];

    const step2 = step1.split(';')[0];

    // return JSON.parse(step2)
    // check if string is object
    if (
      (step2.startsWith('{') && step2.endsWith('}')) ||
      (step2.startsWith('"') && step2.endsWith('"'))
    ) {
      return JSON.parse(step2);
    }

    return step2;
  } catch {
    return '';
  }
};

export const getCookieFromString = (cookieName: string, string: string) => {
  if (typeof document === 'undefined') return;

  const cookie = string;

  try {
    const step1 = cookie.split(`${cookieName}=`)[1];

    const step2 = step1.split(';')[0];

    // return JSON.parse(step2)
    // check if string is object
    if (
      (step2.startsWith('{') && step2.endsWith('}')) ||
      (step2.startsWith('"') && step2.endsWith('"'))
    ) {
      return JSON.parse(step2);
    }

    return step2;
  } catch {
    return '';
  }
};

export const cookieIsEmpty = (cookieName: string) => {
  if (typeof document === 'undefined') return;

  const cookie = getCookie(cookieName);
  // if (cookie === '' || Object.keys(cookie).length === 0);
  if (cookie === '') {
    return true;
  }
  return false;
  // return Object.keys(cookie).length === 0;
};

export const clearCookie = (cookieName: string) => {
  document.cookie = `${cookieName}=null; expires=${new Date(0).toUTCString()}`;
};

export const cookieDuster = (
  cookieName: string,
  fn: Function,
  context: Context,
  interval: number = 3000
) => {
  const event = setInterval(() => {
    const targetCookie = getCookie(cookieName);
    const empty = Object.keys(targetCookie).length === 0;
    if (empty) {
      console.log(`${cookieName} cookie is empty:`, empty);
      console.log(targetCookie);
      console.log('Remaining cookies:')
      console.log(document.cookie)
      fn();
    }
  }, interval);

  return () => clearInterval(event);
};
