import { Action, ActionPayload } from '@/components/context';
import Link from 'next/link';
import { Dispatch } from 'react';

export default function (dispatch: Dispatch<ActionPayload>) {
  return (
    <Link
      className="plainLink"
      href="/signin"
      // @ts-ignore
      variant="contained"
      color="success"
      onClick={async () => {
        dispatch({ type: Action.SET_CHECKOUT_CART });
      }}
    >
      Sign In To Order
    </Link>
  );
}
