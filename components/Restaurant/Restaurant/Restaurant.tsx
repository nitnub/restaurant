import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Link from 'next/link';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Launch from '@mui/icons-material/Launch';
import styles from './Restaurant.module.css';
import StarRating from '../StarRating';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface RestaurantProfile {
  id?: number;
  name: string;
  description: string;
  style: string;
  rating: number;
  image: string;
  homePage?: string;
}

interface RestaurantProps {
   restaurant: RestaurantProfile
}

export default function Restaurant(props: RestaurantProps) {
  const { name, style, image, rating, description, id, homePage } =
    props.restaurant;

  return (
    <Card className={styles.card}>
      <Link
        href="restaurants/[id]/[name]"
        as={`/restaurants/${id}/${name?.replaceAll(' ', '-')}`}
      >
        <CardHeader className={styles.header} title={name} subheader={style} />
      </Link>
      <div className={styles.rating}>
        <StarRating rating={Number(rating)} />
      </div>
      <CardMedia
        className={styles.image}
        component="img"
        image={image}
        alt={name}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions
        className={styles.actionsContainer}
        disableSpacing
        sx={{ mt: 'auto' }}
      >
        <div className={styles.actions}>
          <IconButton
            aria-label={homePage}
            onClick={() => window.open(homePage)}
          >
            <Launch />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
