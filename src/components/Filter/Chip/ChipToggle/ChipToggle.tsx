import { useState } from 'react';
import Chip from '@mui/material/Chip';
import { FoodCategory } from '../../../../models/dishModel';
import styles from './ChipToggle.module.css';

export default function ChipToggle({
  query,
  setQuery,
  foodStyle,
}: {
  foodStyle: FoodCategory;
}) {
  const [active, setActive] = useState(false);
  const handler = () => {
    setActive(() => !active);
    if (!active) {
      const qCopy = { ...query };
      const sCopy = qCopy.styles;
      sCopy.push(foodStyle);
      setQuery(() => {
        return { ...qCopy, styles: sCopy };
      });
    } else {
      const qCopy = { ...query };
      let sCopy = qCopy.styles;
      sCopy = sCopy.filter((el: FoodCategory) => el !== foodStyle);
      setQuery(() => {
        return { ...qCopy, styles: sCopy };
      });
    }
  };

  return (
    <Chip
      style={{ margin: '4px' }}
      className={styles.chipToggle}
      onClick={handler}
      variant={active ? 'filled' : 'outlined'}
      label={foodStyle}
      color="success"
      size="small"
    />
  );
}
