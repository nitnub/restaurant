import Link from 'next/link';
import List from '@mui/material/List';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context';
import CartItem from '../CartItem';
import styles from './CartList.module.css';
import { convertToCurrency } from '@/libs/formatter';
import { CartItem as ICartItem } from '@/types/cartTypes';
import { getCookie } from '@/utils/cookieHandler';
import { RestaurantTuple } from '@/types/restaurantTypes';
import { sortName, sortObjByName } from '@/utils/genUtils';

export default function CartList() {
  const [hydro, setHydro] = useState(false);
  const [items, setItems] = useState<ICartItem[]>([]);
  const ctx = useContext(AppContext);
  useEffect(() => {
    let cartItems = getCookie('cart')?.items;
    if (cartItems) {
      setItems(() => cartItems);
    } else {
      setItems(() => []);
    }
    // setItems
    setHydro(true);
  }, [ctx]);
  if (!hydro) {
    return null;
  }

  const headersObj = {};
  items &&
    items.forEach((el: ICartItem) => {
      headersObj[el.restaurant] = el.restaurantName;
    });
  const headersList: RestaurantTuple[] = [];
  for (let key in headersObj) {
    headersList.push([Number(key), headersObj[key]]);
  }

  const totals = {};

  return (
    <>
      {[...headersList]
        .sort((a, b) => sortName(a[1], b[1]))
        .map((el) => {
          const [id, restaurantName] = el;
          return (
            <div key={id}>
              <h3 className={styles.header}>
                <Link href={`/restaurants/${id}/${restaurantName}`}>
                  {restaurantName}
                </Link>
              </h3>
              <List>
                {items
                  .sort(sortObjByName)
                  .map((item: ICartItem, index: number) => {
                    if (item.restaurantName === restaurantName) {
                      if (totals[restaurantName]) {
                        totals[restaurantName] += item.price * item.count;
                      } else {
                        totals[restaurantName] = item.price * item.count;
                      }
                      return <CartItem key={item.id} item={item} />;
                    }
                  })}
                <div className={styles.subtotal}>
                  <b>Subtotal:</b>

                  {convertToCurrency(totals[restaurantName])}
                </div>
              </List>
            </div>
          );
        })}
    </>
  );
}
