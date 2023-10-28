import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './index.module.css';
import Container from '@mui/material/Container';
import Meta from '@/components/Meta';
import DishList from '@/components/Dish/DishList';
import SearchBar from '@/components/Filter/SearchBar';
import { useRestaurantQuery } from '@/src/utils/customHooks';
import Logger from '@/libs/logger';

const Restaurant: React.FunctionComponent = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // // Can now destructure any params from router.query
  let { id } = router.query;
  if (Array.isArray(id)) {
    id = id[0];
    Logger.warn('Received restaurant id argument of type Array.');
  }

  const { data, loading, error } = useRestaurantQuery(id);

  if (error) {
    return <div>Unable to load page. Please try again!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const location = data.restaurantResult;

  if (!location) return;
  return (
    <>
      <Meta title={location.name} description={location.description} />
      <Head>
        <title>Restaurant App | {location.name}</title>
      </Head>
      <img
        className="headerImage"
        src={`/images/restaurants/lg/${location.image}`}
        alt={location.name}
      />
      <div className="headerBackgroundSpan" />
      <div className="mainBackground" />
      <div className={styles.inputContainer}>
        <Container className={styles.parentContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.titleName}>{location.name}</div>
            <div className={styles.titleStyle}>{location.style}</div>
            <div className={styles.titleDescription}>
              {location.description}
            </div>
          </div>
          <div className="headerImageSpacer"></div>
          <div className={styles.searchContainer}>
            <SearchBar
              setQuery={setQuery}
              searchPool={location.dish}
              label="Search menu"
              loading={loading}
            />
          </div>

          <DishList
            dishes={location.dish}
            query={query}
            restaurantName={location.name}
            loading={loading}
          />
        </Container>
      </div>
    </>
  );
};

export default Restaurant;
