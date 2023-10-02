import IconButton from '@mui/material/IconButton';
import IconAdd from '@/components/Dish/IconAdd';
import IconSubtract from '@/components/Dish/IconSubtract';
import { green, pink } from '@mui/material/colors';
import { useState, useEffect, useContext } from 'react';
import { getCookie } from '@/utils/cookieHandler';
import AppContext from '@/components/context';
import { Dish } from '@/types/dishTypes';
export default function DishCounter({ dishProp }) {
  const [count, setCount] = useState(0);
  const { ctx } = useContext(AppContext);

  useEffect(() => {
    if (!dishProp) setCount(0);
    if (!dishProp.count) setCount(0);
  });

  const index = ctx.cart.items.findIndex((item) => item.id === dishProp.id);
  console.log('index:', index);

  return (
    <>
      <IconButton
        color="primary"
        sx={{ color: '#754d4d' }}
        aria-label="remove item from shopping cart"
      >

        <IconSubtract dishProp={dishProp}  />
      </IconButton>

      <div>
        {ctx.cart.items[index] ? ctx.cart.items[index].count : 0}
      </div>
      <IconButton
        sx={{ color: '#4d7558' }}
        aria-label="add item to shopping cart"
      >
        <IconAdd dishProp={dishProp}  />
      </IconButton>
    </>
  );
}
