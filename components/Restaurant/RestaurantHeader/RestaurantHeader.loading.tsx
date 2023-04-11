import Meta from '@/components/Meta';
import Head from 'next/head';
import styles from './RestaurantHeader.module.css'
import Container from '@mui/material/Container';
import Skeleton  from '@mui/material/skeleton';
import SearchBar from '@/components/Filter/SearchBar';
import DishList from '@/components/Dish/DishList';
const RestaurantHeaderLoading = () => {
  return (
    // <div className="loadingContainer">
    //   <CircularProgress />
    // </div>
    <>
      <Meta title={`location.name`} description={`location.description`} />
      <Head>
        <title>Loading...</title>
      </Head>
      <div className={styles.headerBackgroundSpanLoading}>

      {/* <div className={styles.headerImage} /> */}
      {/* <div className={styles.headerImageLoading} /> */}

      {/* <div className={styles.resInputConmainBackgroundtainer} /> */}

      <div className={styles.resInputContainerLoading}>
        <Container className={styles.parentContainerLoading} >
        {/* <Container  > */}
          <div className={styles.resTitleContainer}>
          
            {/* <div>vfdvdd</div> */}
            <Skeleton className={styles.headerTextLoading} variant="rounded" />
            {/* <div className="resTitleName">{`location.name`}</div> */}
            <Skeleton className={styles.styleTextLoading} variant="rounded" />
            {/* <div className="resTitleStyle">{`location.style`}</div> */}
            <Skeleton className={styles.descriptionTextLoading} variant="rounded" />
            {/* <div className="resTitleDescription">{`location.description`}</div> */}
          </div>
        </Container>
          <div className="headerImageSpacer"></div>
          {/* <SearchBar loading /> */}
          {/* <DishList loading /> */}
      </div>
      <div className={styles.imageSpacerLoading}></div>
      </div>
    </>
  );
};

export default RestaurantHeaderLoading;
