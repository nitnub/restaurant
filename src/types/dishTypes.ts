import { FoodCategory } from '@/types/restaurantTypes';

export interface Dish {
  id: string;
  name: string;
  itemType: string;
  description: string;
  image: string;
  price: string;
  restaurant: number;
  restaurantName: string;
  vegetarian: string;
  vegan: string;
  glutenFree: string;
  count: number;
  type?: FoodCategory;
}

export type FoodType = 'Appetizer' | 'Meal' | 'Dessert' | 'Drink' | 'Spirit';

export interface DishObject {
  id: number;
  name: string;
  type: FoodCategory;
  description: string;
  image: string;
  price: number;
  restaurant: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

export interface CartItem extends DishObject {
  count?: number;
}
