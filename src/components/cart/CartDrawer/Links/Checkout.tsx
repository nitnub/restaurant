import { Action, ActionPayload } from '@/components/context';
import Link from 'next/link';
import { Dispatch } from 'react';

export default function (dispatch: Dispatch<ActionPayload>, handleDrawerClose) {
  return (
    <Link
      href="/checkout"
      // @ts-ignore
      variant="contained"
      color="success"
      size="small"
      onClick={async () => {
        handleDrawerClose();
        dispatch({ type: Action.SET_CHECKOUT_CART });
      }}
    >
      Check Out
    </Link>
  );
}
