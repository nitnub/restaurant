import { DishObject } from '@/models/dishModel';

export default class LocalCart {
  private CART_KEY: string = 'cart';
  private COOKIE_LIFESPAN_DAYS: number = 30;
  constructor() {}
  private getCartObject() {
    try {
      const cookie = document.cookie;
      const cInitial = cookie.split(`${this.CART_KEY}=`)[1];
      const cFinal = cInitial.split(';')[0];
      const cart = JSON.parse(cFinal);

      return cart;
    } catch {
      return false;
    }
  }

  private setCartObject(cart) {
try {
  const date = new Date();
  date.setDate(date.getDate() + this.COOKIE_LIFESPAN_DAYS);

  const expirationDate = date.toUTCString();

  document.cookie = `${this.CART_KEY}=${JSON.stringify(
    cart
  )}; expires=${new Date(expirationDate)}`;

} catch {
  return false;
}


  }

  public initializeCart(userID: string) {
    const existingCart = this.getCartObject();
    if (!existingCart) {
      const emptyCart = { [userID]: { items: [], total: 0 } };
      this.setCartObject(emptyCart);
    } else if (!existingCart[userID]) {
      const newCart = { ...existingCart, [userID]: { items: [], total: 0 } };
      this.setCartObject(newCart);
    } else {
      return;
    }
  }

  public addCartItem(userID: string, item: DishObject) {
    this.initializeCart(userID);
    const cartGroup = this.getCartObject();
    const cart = cartGroup[userID];

    cart.total += item.price;

    const items = cart.items;
    const itemIndex = items.findIndex((el) => el.id === item.id);

    if (items.length === 0 || itemIndex === -1) {
      this.setCartObject({
        ...cartGroup,
        [userID]: {
          items: [...cart.items, { ...item, count: 1 }],
          total: cart.total + item.price,
        },
      });
    } else {
      const modifiedItem = cart.items.splice(itemIndex, 1)[0];
      const oldCount = modifiedItem.count;
      this.setCartObject({
        ...cartGroup,
        [userID]: {
          items: [...cart.items, { ...modifiedItem, count: oldCount + 1 }],
          total: cart.total + item.price,
        },
      });
    }
  }
  public removeCartItem(userID: string, item: DishObject) {
    this.initializeCart(userID);
    const cartGroup = this.getCartObject();
    const cart = cartGroup[userID];
    const items = cart.items;

    const itemIndex = items.findIndex((el) => el.id === item.id);

    if (items.length === 0 || itemIndex === -1) {
      return;
    } else {
      const modifiedItem = cart.items.splice(itemIndex, 1)[0];
      const oldCount = modifiedItem.count;

      this.setCartObject({
        ...cartGroup,
        [userID]: {
          items: [...cart.items, { ...modifiedItem, count: oldCount - 1 }],
          total: cart.total - item.price,
        },
      });
    }
  }

  public getItemCount(userID: string, item: DishObject) {
    this.initializeCart(userID);
    const cartGroup = this.getCartObject();
    const cart = cartGroup[userID];
    const items = cart.items;

    const itemIndex = items.findIndex((el) => el.id === item.id);
    if (itemIndex === -1) return 0;
    return items[itemIndex].count;
  }

  public getCartItems(userID: string) {

    this.initializeCart(userID);
    const cartGroup = this.getCartObject();
    const cart = cartGroup[userID];

    return cart.items || [];
  }
  public emptyCart() {}
  public DEBUG_emptyAllCarts() {
    document.cookie = `${this.CART_KEY}=null; expires=${new Date(
      0
    ).toUTCString()}`;
  }

}


