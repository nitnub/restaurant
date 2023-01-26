import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AppContext from '../../context';
import { convertToCurrency } from '../../../libs/formatter';
import styles from './Dish.module.css';
import DishCounter from '../DishCounter';
import { CartItem } from '@/types/cartTypes';

export default function Dish({ dishProp }: { dishProp: CartItem }) {
  const ctx = useContext(AppContext);
  const [count, setCount] = useState(0);

  const dish = dishProp;
  ctx.cart?.items.map((item: CartItem) => {
    if (item.id === dishProp.id) {
      dishProp.count = item.count;
    }
  });

  return (
    <Card className={styles.dishCard}>
      <CardMedia
        component="img"
        className={styles.dishImage}
        image={dishProp.image}
        alt={dish.description}
      />
      <Box className={styles.cardContent}>
        <CardContent className={styles.cardContent}>
          <Typography component={'span'} variant="h5">
            {dishProp.name}
          </Typography>
          <div>
            <div className={styles.innerContainer}>
              <div>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component={'span'}
                >
                  Vegetarian
                </Typography>
                <Typography className={styles.description}>
                  {dishProp.description}
                </Typography>
                <Typography>{convertToCurrency(dishProp.price)}</Typography>
              </div>

              <div className={styles.counterContainer}>
                <div className={styles.dishCounter}>
                  <div className={styles.addRemove}>
                    <DishCounter
                      // setCountVar={setCountVar}
                      dishProp={dishProp}
                      setCount={setCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Box>
    </Card>
  );
}
