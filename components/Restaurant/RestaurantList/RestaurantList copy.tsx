import Restaurant from '../Restaurant/Restaurant';
import { Restaurant as IRestaurant } from '@/types/restaurantTypes';
import styles from './RestaurantList.module.css';
import { sortName, sortObjByName } from '@/utils/genUtils';

export default function RestaurantList(props: any) {
  const { restaurants } = props;
  const { query } = props;

  // sort a copy so as not to impact state.
  const sortedRestaurants = [...restaurants].sort(sortObjByName);
  return (
    <div className={styles.restaurants}>
      {sortedRestaurants.map((restaurant: IRestaurant, index: number) => {
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
          return (
            <>
              <Restaurant key={restaurant.id} restaurant={restaurant} />
            </>
          );
        }
        return;
      })}
    </div>
  );
}
