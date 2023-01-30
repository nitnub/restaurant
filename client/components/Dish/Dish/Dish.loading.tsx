import * as React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import styles from './Dish.module.css';

export default function Variants() {
  return (
    // <Stack spacing={1} className={styles.dishCard}>
    // </Stack>
    <Card spacing={1} className={styles.dishCardLoading}>
      <div className={styles.skeletonContainer}>
        {/* For variant="text", adjust the height via font-size */}
        {/* <Skeleton variant="circular" width={40} height={40} /> */}
        <Skeleton variant="circular" className={styles.dishImageLoading} />
        {/* <Skeleton variant="rounded" className={styles.skeletonTitle}  /> */}
        {/* <Skeleton variant="rounded" className={styles.skeletonTitle} width={210} height={60} /> */}
        <div>
          {/* <Skeleton variant="text" sx={{ fontSize: '2rem' }} /> */}
          {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> */}
          <Skeleton className={styles.dishHeaderLoading} variant="rounded"  />
          <Skeleton className={styles.disSubheaderLoading} variant="rounded"  />
          <div className={styles.cardContentLoading}>
          <Skeleton className={styles.cardBlurbLoading} variant="rounded" />
          {/* <Skeleton className={styles.dishCounterLoading} variant="text"  /> */}

          </div>
          {/* <Skeleton variant="text" width={210} height={30} /> */}

          {/* For other variants, adjust the size with `width` and `height` */}
          {/* <Skeleton variant="test" width={210} height={60} /> */}

          {/* <Skeleton variant="rounded" width={210} height={60} /> */}
        </div>
      </div>
    </Card>
  );
}
