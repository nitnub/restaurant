import Head from 'next/head';

interface MetaInputs {
  title?: string;
  keywords?: string;
  description?: string;
}
const Meta = ({ title, keywords, description }: MetaInputs) => {
  return (
    <Head>
      {/* accommode responsiveness */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
      {/* <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      /> */}
    </Head>
  );
};

// below allows default meta data. Note that the title is in here.
// can change the title in a given page by importing Meta and passing a single prop arg of, for instance <Meta title='Contact' />

Meta.defaultProps = {
  title: 'Restaurant App',
  keywords: 'food delivery, restaurant',
  description: 'Order food from your favorite restaurants',
};
export default Meta;
