
import { client } from '@/dbConfigs/redis.connection';
// import { CartItem } from '@/types/cartTypes';
import { Dish, CartItem } from '@/types/cartTypes';
// import { Dish } from '@/types/dishTypes';
import { LoggedInUser } from '@/types/user.types';

const Cart = {
  addItem: async (user: LoggedInUser, item: Dish) => {
    return await Cart.updateItem(user, item, 'increment');
  },
  removeItem: async (user: LoggedInUser, itemId: string) => {
    return await Cart.updateItem(user, { id: itemId }, 'decrement');
  },

  getCart: async (user: LoggedInUser) => {
    if (user.id.startsWith('Guest')) {
      user = {
        ...user,
        firstName: 'Guest',
        email: 'Guest',
        avatar: '/images/avatars/av1.png',
        admin: false,
      };
    }

    if (!(await client.exists(user.id))) return [];

    // get all items for the user and create an object
    const resultAll = await client.hGetAll(user.id);
    const cachedCartRaw: CartItem[] = await JSON.parse(resultAll.items);

    // clean up cart in case things get out of sync
    const cachedCart = cachedCartRaw.filter((el: CartItem) => el.count > 0);
    if (cachedCart.length !== cachedCartRaw.length) {
      const cartString = JSON.stringify(cachedCart);
      await client.hSet(user.id, 'items', cartString);
    }

    return cachedCart;
  },

  clearCart: async (id: string) => {
    const deletedCount = await client.hDel(id, 'items');
    if (deletedCount > 0) return { success: true };

    const fieldExists = await client.hExists(id, 'items');
    if (!fieldExists) return { success: true };

    return { success: false };
    
  },
  updateItem: async <Dish>(user: LoggedInUser, item: CartItem, action: string) => {
    if (user.id.startsWith('Guest')) {
      user = {
        ...user,
        firstName: 'Guest',
        email: 'Guest',
        avatar: '/images/avatars/av1.png',
        admin: false,
      };
    }

    // check current cache for user entry
    const cacheExists = await client.exists(user.id);
    if (!cacheExists) {
      // if new user with an empty cart tries to decrement, return emtyy list. Should not be possible
      if (action === 'decrement') return [];

      // Create a  new entry for this user with a cart containing the item in the args and then return
      const newItem = { ...item, count: item.count || 1 };
      const itemList = JSON.stringify([newItem]);

      const cartUpdated = await client.hSet(user.id, 'items', itemList);
      // RETURN NEW CART OBJECT
      return cartUpdated && [newItem];
    }
  

    // get all items for the user and create an object
    const resultAll = await client.hGetAll(user.id);
    const cachedCartRaw = await JSON.parse(resultAll.items);

    // clean up cart in case things get out of sync
    const cachedCart = cachedCartRaw.filter((el: CartItem) => el.count > 0);

    // get item index, retur -1 if not present
    const itemIndex = cachedCart.findIndex(
      (element: CartItem) => Number(element.id) === Number(item.id)
    );

    // if item is not present, add the item.
    if (itemIndex === -1 && action === 'increment') {
      const newCart = [...cachedCart, { ...item, count: item.count || 1 }];
      const cartString = JSON.stringify(newCart);

      // set the field called "items" for username user.id to the cartString
      await client.hSet(user.id, 'items', cartString);
      return newCart;
    }
    if (itemIndex === -1 && action === 'decrement') {
      return cachedCart;
    }

    const targetItem = cachedCart.splice(itemIndex, 1)[0];

    // if item is present,increment or decrement accordingly...
    if (action === 'increment') targetItem.count += item.count || 1;
    else if (action === 'decrement') targetItem.count -= item.count || 1;

    // return updated cart
    const newCart =
      targetItem.count > 0 ? [...cachedCart, targetItem] : cachedCart;

    const cartString = JSON.stringify(newCart);
    await client.hSet(user.id, 'items', cartString);

    return newCart;
  },
  
  
};

export default Cart;
