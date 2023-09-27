import DietaryIcon from './DietaryIcon';
import styles from './DietaryList.module.css';

export default function DietaryList({ dietaryProps }) {
  
  let iconList = [];
  const iconKeys = Object.keys(dietaryProps);

  iconKeys.forEach((k, v) => dietaryProps[k] && iconList.push(k));

  if (iconList.length === 0) {
    return <br />;
  }

  if (iconList.includes('vegetarian') && iconList.includes('vegan')) {
    iconList = iconList.filter((value) => value !== 'vegetarian');
  }

  return (
    <div className={styles.allergyContainer}>
      {iconList.map((value, index) => {
        return <DietaryIcon key={index} icon={value} />;
      })}
    </div>
  );
}
