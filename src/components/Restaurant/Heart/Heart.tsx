import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import styles from './Heart.module.css';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Heart({ active }: { active: boolean }) {
  return (
    <div>
      <Checkbox
        className={styles.heart}
        sx={{
          '&.Mui-checked': {
            color: '#C70039',
          },
        }}
        {...label}
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
      />
    </div>
  );
}
