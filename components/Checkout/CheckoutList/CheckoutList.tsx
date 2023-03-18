import Link from 'next/link';
import List from '@mui/material/List';
import { useContext, useEffect, useState } from 'react';
import AppContext from '@/components/context';
import styles from './CheckoutList.module.css';
import { convertToCurrency } from '@/libs/formatter';
import { CartItem as ICartItem } from '@/types/cartTypes';
import Dish from '@/components/Dish/Dish';
import { getCookie } from '@/utils/cookieHandler';
import { RestaurantTuple } from '@/types/restaurantTypes';
import { Paper } from '@mui/material';

export default function CheckoutList() {
  const ctx = useContext(AppContext);

  const items = getCookie('cart')?.items;
  const [hydro, setHydro] = useState(false);
  useEffect(() => {
    const cartCopy = ctx.cart;
    cartCopy.items = items;

    ctx.setCart(cartCopy);
    setHydro(true);
  });
  if (!hydro) {
    return null;
  }

  // separate items by restaurant
  const headersObj = {};
  items &&
    items.forEach((el) => {
      headersObj[el.restaurant] = el.restaurantName;
    });
  const headersList: RestaurantTuple[] = [];
  for (let key in headersObj) {
    headersList.push([Number(key), headersObj[key]]);
  }

  const sortName = (a: string, b: string) => {
    if (!a || !b) return;
    if (a.toLowerCase().startsWith('the ')) a = a.slice(4);
    if (b.toLowerCase().startsWith('the ')) b = b.slice(4);

    return a > b ? 1 : -1;
  };

  const sortObjByName = (a: ICartItem, b: ICartItem) =>
    sortName(a.name, b.name);

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
                    .map((item: ICartItem, index: number) => {
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
