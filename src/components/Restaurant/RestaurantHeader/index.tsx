import RestaurantHeader from './RestaurantHeader';

import RestaurantHeaderLoading from './RestaurantHeader.loading';

function RestaurantHeaderComponent(props) {
  if (props.loading) {
    return <RestaurantHeaderLoading props />;
  }

  return (
    <>
      <RestaurantHeader props={props} />
    </>
  );
}

export default RestaurantHeaderComponent;
