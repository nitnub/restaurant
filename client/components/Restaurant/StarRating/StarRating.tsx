import * as React from 'react';
import Rating from '@mui/material/Rating';
// import Stack from '@mui/material/Stack';
import styles from './StarRating.module.css';
export default function StarRating({ rating }: { rating: number }) {
  return (
    <Rating
      className={styles.rating}
      name="size-small"
      defaultValue={rating}
      size="small"
      precision={0.25}
      readOnly
    />
  );
}
