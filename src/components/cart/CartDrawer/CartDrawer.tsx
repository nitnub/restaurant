import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppContext from '@/src/context/context';
import { cookieIsEmpty } from '@/utils/cookieHandler';
import { newGuestID } from '@/utils/newGuestID';

import Drawer from '@/components/Cart/CartDrawer/Drawer/Drawer';
import Main from '@/components/Cart/CartDrawer/Drawer/Main';
import Header from '@/components/Cart/CartDrawer/Drawer/Header';
import AppBar from '@/components/Cart/CartDrawer/Drawer/AppBar';
import { Action } from '@/src/context/context.types';

export default function CartDrawer() {
  const { dispatch } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  let guestID: string;
  if (cookieIsEmpty('accessToken')) {
    guestID = newGuestID();
    document.cookie = `accessToken=${guestID}`;
    dispatch({
      type: Action.UPDATE_PROPERTIES,
      payload: { accessToken: guestID },
    });
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar open={open} setOpen={setOpen} />
        <>
          <Main open={open}>
            <Header />
          </Main>
          <Drawer setOpen={setOpen} open={open} />
        </>
      </Box>
    </>
  );
}
