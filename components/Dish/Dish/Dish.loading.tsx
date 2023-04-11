import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import styles from './Dish.module.css';

export default function DishLoading() {
  return (
    <Card className={styles.dishCardLoading}>
      <div className={styles.skeletonContainer}>
        <Skeleton variant="circular" className={styles.dishImageLoading} />

        <div className={styles.cardContentLoading}>
          <Skeleton className={styles.dishHeaderLoading} variant="rounded" />
          <Skeleton className={styles.disSubheaderLoading} variant="rounded" />
          <div className={styles.cardDetailsLoading}>
            <Skeleton className={styles.cardBlurbLoading} variant="rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
