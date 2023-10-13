import DietaryIcon from './DietaryIcon';
import styles from './DietaryList.module.css';

interface DietaryProps {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}
export default function DietaryList({
  dietaryProps,
}: {
  dietaryProps: DietaryProps;
}) {
  if (dietaryProps === undefined || dietaryProps === null) {
    return <br />;
  }

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
    <div role="group" className={styles.allergyContainer}>
      {iconList.map((value, index) => {
        return <DietaryIcon key={index} icon={value} />;
      })}
    </div>
  );
}
