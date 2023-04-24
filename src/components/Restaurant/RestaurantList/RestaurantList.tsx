import Restaurant from '@/components/Restaurant/Restaurant';
import { Restaurant as IRestaurant } from '@/types/restaurantTypes';
import styles from './RestaurantList.module.css';
import { sortName, sortObjByName } from '@/utils/genUtils';

export default function RestaurantList(props: any) {
  const { restaurants } = props;
  const { query } = props;
  const sortedRestaurants = [...restaurants].sort(sortObjByName);

  const restaurantList: IRestaurant[] = [];

  sortedRestaurants.forEach((restaurant: IRestaurant, index: number) => {
    const restaurantName = restaurant.name.toLowerCase();
    const restaurantStyle = restaurant.style.toLowerCase();

    const queryString = query.name?.toLowerCase();
    const queryList = query.styles.map((el: string) => el.toLowerCase());

    const styleWasSelected = queryList.includes(restaurantStyle);
    const selectionMade = queryList.length > 0;

    if (
      restaurantName.includes(queryString) &&
      ((selectionMade && styleWasSelected) || !selectionMade)
    ) {
      restaurantList.push(restaurant);
    }
  });

  if (restaurantList.length === 0) {
    return (
      <h1 className={styles.emptyText}>
        Oops! Unable to find any restaurants. Please broaden your search...
      </h1>
    );
  }

  return (
    <div className={styles.restaurants}>
      {restaurantList.map((restaurant: IRestaurant, index: number) => {
        return <Restaurant key={restaurant.id} restaurant={restaurant} />;
        
      })}
    </div>
  );
}
