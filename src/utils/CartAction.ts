import { Cart, CartItem, Dish } from '@/types/cartTypes';

export class CartAction {
  cart: Cart;
  items: CartItem[];

  constructor(cart: Cart) {
    this.cart = cart;
    this.items = cart.items;
  }

  add(item: Dish) {
    return this.update(item);
  }

  remove(item: Dish) {
    return this.update(item, -1);
  }

  private update(item: Dish, increment = 1) {
    let tempCart: Cart;
    const itemIndex = this.items.findIndex((el) => el.id === item.id);

    if (this.items.length === 0 || itemIndex === -1) {
      if (increment === -1) {
        tempCart = this.cart;
      } else {
        tempCart = {
          items: [...this.cart.items, { ...item, count: 1 }],
          total: this.cart.total + item.price,
        };
      }
    } else {
      const modifiedItem = this.cart.items.splice(itemIndex, 1)[0];
      const oldCount = modifiedItem.count;

      tempCart = {
        items: [
          ...this.cart.items,
          { ...modifiedItem, count: oldCount + increment },
        ],
        total: this.cart.total - item.price,
      };
    }
    return tempCart;
  }
}
