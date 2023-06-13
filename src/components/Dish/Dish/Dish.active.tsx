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
import DietaryList from '@/components/AllergyBar';

export default function Dish({ dishProp }: { dishProp: CartItem }) {
  const ctx = useContext(AppContext);
  const [count, setCount] = useState(0);

  const dish = dishProp;
  ctx.cart?.items.map((item: CartItem) => {
    if (item.id === dishProp.id) {
      dishProp.count = item.count;
    }
  });

  const dietaryProps = {
    vegetarian: dishProp.vegetarian,
    vegan: dishProp.vegan,
    glutenFree: dishProp.glutenFree,
  };

  return (
    <Card className={styles.dishCard}>
      <div className={styles.dishImage}>
        <CardMedia
          component="img"
          className={styles.dishImage}
          image={`/images/dishes/${dishProp.image}`}
          alt={dish.description}
        />
      </div>
      <Box className={styles.cardContent}>
        <CardContent className={styles.cardContent}>
          <Typography role="heading" component={'span'} variant="h5">
            {dishProp.name}
          </Typography>
          <div>
            <div className={styles.innerContainer}>
              <div>
                <DietaryList dietaryProps={dietaryProps} />

                <Typography role="paragraph" className={styles.description}>
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
