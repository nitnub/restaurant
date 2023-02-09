export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  description: string;
  style: string;
  image: string;
}

export interface RestaurantQueryResult {
  name: string;
  styles: string[];
}

export type RestaurantTuple = [number, string];

export type FoodCategory =
  | 'American'
  | 'Southwest'
  | 'Italian'
  | 'Eclectic'
  | 'Fusion'
  | 'Pacific Northwest'
  | 'Fine Dining'
  | 'Oyster Bar'
  | 'Frenc'
  | 'Asian Fusion'
  | 'New American';