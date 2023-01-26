import DishActive from './Dish.active';
import DishLoading from './Dish.loading';

export default function DishComponent({ loading, dishProp }) {
  if (loading) {
    return <DishLoading />;
  }

  return (
    <>
      <DishActive dishProp={dishProp} />
    </>
  );
}
