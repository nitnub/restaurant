import { NextRouter } from 'next/router';

export default (
  router: NextRouter,
  email: string = '',
  newUser: boolean = false
) => {
  if (newUser) {
    return router.push(
      {
        pathname: '/',
        query: { newUser: true, email },
      },
      '/'
    );
  }

  return router.push('/');
};
