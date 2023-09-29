import Typography from '@mui/material/Typography';
import styles from './CartItem.module.css';
import { convertToCurrency } from '../../../libs/formatter';
import IconAdd from '@/components/Dish/IconAdd';
import IconSubtract from '../../Dish/IconSubtract';
import { useState } from 'react';
import { getCookie } from '@/utils/cookieHandler';
import { CartItem as ICartItem } from '@/types/cartTypes';

export default function CartItem({ item }) {
  const [count, setCount] = useState(0);
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

  return (
    <div className={styles.container}>
      <img
        src={`/images/dishes/${item.image}`}
        width="100%"
        height={128}
        alt={item.name}
      />
      <div className={styles.cartCounterContainer}>
        <div className={styles.cartCounter}>
          <IconSubtract dishProp={item} setCount={setCount} />

          <div className={styles.itemCount}>
            {initialCount ? initialCount : count}
          </div>
          <IconAdd dishProp={item} setCount={setCount} />
        </div>
        <div>
          <Typography className={styles.itemName}>{item.name}</Typography>
          <div className={styles.productDetails}>
            <div>
              {item.count > 1
                ? `${item.count} x ${convertToCurrency(item.price)}`
                : 'Price'}
            </div>
            <div>{convertToCurrency(item.count * item.price)}</div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}
