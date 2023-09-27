import Link from 'next/link';

export default function (ctx) {
  return (
    <Link
      className="plainLink"
      href="/signin"
      // @ts-ignore
      variant="contained"
      color="success"
      onClick={async () => {
        ctx.setCheckoutCart(ctx.cart);
      }}
    >
      Sign In To Order
    </Link>
  );
}
