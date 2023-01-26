import { FoodCategory } from '@/models/dishModel';
import ChipToggle from '../ChipToggle/ChipToggle';
import styles from './ChipToggleContainer.module.css'
export default function ChipToggleContainer({ query, setQuery, foodStyles }) {
  return (
    <div className={styles.container}>
      {foodStyles.map((name: FoodCategory, index: number) => (
        <ChipToggle
          key={index}
          query={query}
          setQuery={setQuery}
          foodStyle={name}
        />
      ))}
    </div>
  );
}
