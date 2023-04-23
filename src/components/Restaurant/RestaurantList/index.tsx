
import RestaurantList from './RestaurantList';


export default function RestauranComponent( props ) {

  return (
    <>
      <RestaurantList restaurants={props.restaurants} query={props.query} />
    </>
  );
}