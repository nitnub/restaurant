import Typography from '@mui/material/Typography';
import styles from './CartItem.module.css';
import { convertToCurrency } from '../../../libs/formatter';
import AppContext from '@/components/context';
import IconAdd from '@/components/Dish/IconAdd';
import IconSubtract from '../../Dish/IconSubtract';
import { useContext, useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookieHandler';
import { CartItem as ICartItem } from '@/types/cartTypes';

export default function CartItem({ item }) {
  const { ctx } = useContext(AppContext);

  if (!item) return;
  if (!item.count) return;

  let initialCount: number = 0;

  const currentCart = getCookie('cart');

  const hasCart = Object.keys(currentCart).length > 0;
  hasCart &&
    currentCart.items?.forEach((el: ICartItem) => {
      if (Number(el.id) === Number(item.id)) {
        initialCount = el.count;
      }
    });

  const ctxItem = ctx.cart.items.filter((el) => el.id === item.id)[0];

  return (
    <div className={styles.container}>
      <img
        src={`/images/dishes/${ctxItem.image}`}
        width="100%"
        height={128}
        alt={ctxItem.name}
      />
      <div className={styles.cartCounterContainer}>
        <div className={styles.cartCounter}>
          <IconSubtract dishProp={item} />

          <div className={styles.itemCount}>
            {initialCount ? initialCount : ctxItem.count}
          </div>
          <IconAdd dishProp={item} />
        </div>
        <div>
          <Typography className={styles.itemName}>{item.name}</Typography>
          <div className={styles.productDetails}>
            <div>
              {ctxItem.count > 1
                ? `${ctxItem.count} x ${convertToCurrency(ctxItem.price)}`
                : 'Price'}
            </div>
            <div>{convertToCurrency(ctxItem.count * ctxItem.price)}</div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}
