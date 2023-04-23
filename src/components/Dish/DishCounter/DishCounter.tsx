import IconButton from '@mui/material/IconButton';
import IconAdd from '@/src/components/Dish/IconAdd';
import IconSubtract from '@/src/components/Dish/IconSubtract';
import { green, pink } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import { getCookie } from '@/utils/cookieHandler';
import { Dish } from '@/types/dishTypes';
export default function DishCounter({ dishProp }) {
  const [count, setCount] = useState(0);

  let initialCount: number = 0;
  const currentCart = getCookie('cart');
  const hasCart = Object.keys(currentCart).length > 0;

  hasCart &&
    currentCart.items?.forEach((el: Dish) => {
      if (Number(el.id) === Number(dishProp.id)) {
        initialCount = el.count;
      }
    });

  const dishIndex = currentCart.items?.findIndex((el) => {
    el.id === dishProp.id;
  });
  if (dishIndex === -1) {
  }
  useEffect(() => {
    if (!dishProp) setCount(0);
    if (!dishProp.count) setCount(0);
  });

  return (
    <>
      <IconButton
        color="primary"
        sx={{ color: '#754d4d' }}
        aria-label="remove item from shopping cart"
      >
        <IconSubtract dishProp={dishProp} setCount={setCount} />
      </IconButton>

      <div>{initialCount ? initialCount : count}</div>
      <IconButton
        sx={{ color: '#4d7558' }}
        aria-label="add item to shopping cart"
      >
        <IconAdd dishProp={dishProp} setCount={setCount} />
      </IconButton>
    </>
  );
}
