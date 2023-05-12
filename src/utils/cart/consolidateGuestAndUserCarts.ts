import { getCookie } from '@/utils/cookieHandler';
import { formatIncrementCartArgs } from '@/utils/incrementCart';

export default async (accessToken: string, addItem: Function) => {
  const prevCart = getCookie('cart')?.items || [];

  const incrementCartArgs = formatIncrementCartArgs(prevCart, accessToken);
  const updatedCart = await addItem(incrementCartArgs);
  const cart = updatedCart.data.incrementCartResult;

  if (typeof cart === 'undefined') {
    return null;
  }

  return cart;
};
