import Link from 'next/link';

export default function (ctx, handleDrawerClose) {
  return (
    <Link
      href="/checkout"
      // @ts-ignore
      variant="contained"
      color="success"
      size="small"
      onClick={async () => {
        handleDrawerClose();
        ctx.setCheckoutCart(ctx.cart);
      }}
    >
      Check Out
    </Link>
  );
}
