import { CartItem } from "@/types/cartTypes";

export default function getFormattedCart(items: CartItem[]) {
  let totalCost = 0;
  let totalCount = 0;

  items.forEach((el: CartItem) => {
    totalCount += el.count;
    totalCost += el.price * el.count;
  });
  return { items, totalCost, totalCount };
}