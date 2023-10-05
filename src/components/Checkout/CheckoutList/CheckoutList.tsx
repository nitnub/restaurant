import Link from 'next/link';
import List from '@mui/material/List';
import { useContext, useEffect, useState } from 'react';
import AppContext from '@/src/context/context';
import styles from './CheckoutList.module.css';
import { convertToCurrency } from '@/libs/formatter';
import { CartItem } from '@/types/cartTypes';
import Dish from '@/components/Dish/Dish';
import { getCookie } from '@/utils/cookieHandler';
import { RestaurantTuple } from '@/types/restaurantTypes';
import { Paper } from '@mui/material';
import { Action } from '@/src/context/context.types';
import { sortName, sortObjByName } from '@/src/utils/genUtils';

export default function CheckoutList() {
  const [hydro, setHydro] = useState(false);
  const { ctx, dispatch } = useContext(AppContext);

  const items = getCookie('cart')?.items;
  const headersList: RestaurantTuple[] = [];
  const headersObj = {};

  useEffect(() => {
    dispatch({ type: Action.UPDATE_CART_ITEMS, payload: items });
    setHydro(true);
  }, []);
  if (!hydro) {
    return null;
  }

  if (items != null && items.length > 0) {
    items.forEach((el: CartItem) => {
      headersObj[el.restaurant] = el.restaurantName;
    });
  }

  for (let key in headersObj) {
    headersList.push([Number(key), headersObj[key]]);
  }

  const totals = {};

  return (
    <>
      {[...headersList]
        .sort((a, b) => sortName(a[1], b[1]))
        .map((el, index) => {
          const [id, restaurantName] = el;
          return (
            <Paper
              key={index}
              className={styles.resContainer}
              elevation={5}
              component={'div'}
              sx={{
                m: 2,
              }}
            >
              <div key={id} className={styles.resGroup}>
                <h3 className={styles.header}>
                  <Link href={`/restaurants/${id}/${restaurantName}`}>
                    {restaurantName}
                  </Link>
                </h3>
                <List className={styles.productGroup}>
                  {items
                    .sort(sortObjByName)
                    .map((item: CartItem, index: number) => {
                      if (item.restaurantName === restaurantName) {
                        if (totals[restaurantName]) {
                          totals[restaurantName] += item.price * item.count;
                        } else {
                          totals[restaurantName] = item.price * item.count;
                        }
                        return (
                          <Dish key={item.id} dishProp={item} loading={false} />
                        );
                      }
                    })}
                  <div className={styles.subtotal}>
                    <b>Subtotal:</b>

                    {convertToCurrency(totals[restaurantName])}
                  </div>
                </List>
              </div>
            </Paper>
          );
        })}
    </>
  );
}
