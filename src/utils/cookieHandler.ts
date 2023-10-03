import { Context } from '@apollo/client';

export const getCookie = (cookieName: string) => {
  if (typeof document === 'undefined') return;
  const cookie = document.cookie;

  try {
    const step1 = cookie.split(`${cookieName}=`)[1];
    const step2 = step1.split(';')[0];

    // check if string is formatted as object
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

    // check if string is formatted as object
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

  if (cookie === '') {
    return true;
  }
  return false;
};

export const clearCookies = (...cookies: string[]) => {
  cookies.forEach((cookie) => {
    document.cookie = `${cookie}=null; expires=${new Date(0).toUTCString()}`;
  });
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
      fn();
    }
  }, interval);

  return () => clearInterval(event);
};

export const updateCookieObject = (cookieName: string, value: object) => {
  document.cookie = `${cookieName}=${JSON.stringify(value)}`;
};

export const setCookie = (
  cookieName: string,
  value: string | object,
  numericDate: number,
  useExpiration: boolean = true
) => {
  if (typeof value == 'object') {
    value = JSON.stringify(value);
  }

  if (!useExpiration) {
    document.cookie = `${cookieName}=${value};`;
  } else {
    document.cookie = `${cookieName}=${value}; expires=${new Date(
      numericDate * 1000
    ).toUTCString()}`;
  }
};
