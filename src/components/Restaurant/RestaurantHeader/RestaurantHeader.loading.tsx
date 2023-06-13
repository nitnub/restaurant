import Meta from '@/components/Meta';
import Head from 'next/head';
import styles from './RestaurantHeader.module.css';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/skeleton';
const RestaurantHeaderLoading = () => {
  return (
    <>
      <Meta title={`location.name`} description={`location.description`} />
      <Head>
        <title>Loading...</title>
      </Head>
      <div className={styles.headerBackgroundSpanLoading}>
        <div className={styles.resInputContainerLoading}>
          <Container className={styles.parentContainerLoading}>
            <div className={styles.resTitleContainer}>
              <Skeleton
                className={styles.headerTextLoading}
                variant="rounded"
              />
              <Skeleton className={styles.styleTextLoading} variant="rounded" />
              <Skeleton
                className={styles.descriptionTextLoading}
                variant="rounded"
              />
            </div>
          </Container>
          <div className="headerImageSpacer"></div>
        </div>
        <div className={styles.imageSpacerLoading}></div>
      </div>
    </>
  );
};

export default RestaurantHeaderLoading;
