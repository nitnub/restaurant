import IconButton from '@mui/material/IconButton';
import IconAdd from '@/components/Dish/IconAdd';
import IconSubtract from '@/components/Dish/IconSubtract';
import { useState, useEffect, useContext } from 'react';
import AppContext from '@/src/context/context';

export default function DishCounter({ dishProp }) {
  const [count, setCount] = useState(0);
  const { ctx } = useContext(AppContext);

  useEffect(() => {
    if (!dishProp) setCount(0);
    if (!dishProp.count) setCount(0);
  }, []);

  const index = ctx.cart.items.findIndex((item) => item.id === dishProp.id);

  return (
    <>
      <IconButton
        color="primary"
        sx={{ color: '#754d4d' }}
        aria-label="remove item from shopping cart"
      >
        <IconSubtract dishProp={dishProp} />
      </IconButton>

      <div>{ctx.cart.items[index] ? ctx.cart.items[index].count : 0}</div>
      <IconButton
        sx={{ color: '#4d7558' }}
        aria-label="add item to shopping cart"
      >
        <IconAdd dishProp={dishProp} />
      </IconButton>
    </>
  );
}
