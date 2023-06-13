export interface Dish {
  id: string;
  name: string;
  itemType: string;
  description: string;
  image: string;
  price: number;
  restaurant: number;
  restaurantName?: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  count?: number;
}

export interface CartItem extends Dish {
  count: number
}

export interface Cart {
  items: CartItem[];
  totalCount?: number;
  totalCost?: number;
  total?: number;
}

export interface CartButtonSet {
  id: string;
  count: number;
  increment: () => {};
  decrement: () => {};
}
