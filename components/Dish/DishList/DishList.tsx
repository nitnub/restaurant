import Dish from '../Dish';
import styles from './DishList.module.css';
import { DishObject } from '../../models/dishModel';

export default function DishList({ dishes, loading, query, restaurantName }) {
  const queryName = query.name || '';

  const dishList: DishObject[] = [];

  dishes.forEach((dish: DishObject, index: number) => {
    if (dish.name.toLowerCase().includes(queryName.toLowerCase())) {
      const modifiedDish = { ...dish, restaurantName };
      dishList.push(modifiedDish);
    }
  });

  if (dishList.length === 0) {
    return (
      <div className={styles.emptyText}>
        <h1>Oops! Unable to find anything. Please broaden your search...</h1>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {dishList.map((dish: DishObject, index: number) => {
        return <Dish key={dish.id} loading={false} dishProp={dish} />;
      })}
    </div>
  );
}
