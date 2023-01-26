import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PaymentComplete() {
  const router = useRouter();

  const { payment_intent, payment_intent_client_secret, redirect_status } =
    router.query;

  return (
    <>
      <Head>
        <title>Restaurant App | Payment Complete</title>
      </Head>
      <h1>Payment Complete Page</h1>
      <p>This is the payment complete page.</p>
      <div>
        <h1>Payment Intent</h1>
        <div>{payment_intent}</div>

        <h1>Payment Intent Client Secret</h1>
        <div>{payment_intent_client_secret}</div>

        <h1>Redirect Status</h1>
        <div>{redirect_status}</div>
      </div>

    </>
  );
}
