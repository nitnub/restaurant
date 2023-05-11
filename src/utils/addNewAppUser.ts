import { GET_CART } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
async function addNewAppUser(
  email: string,
  globalUserId: string,
  accessToken: string
) {
  const VARIABLES = {
    email,
    globalUserId,
  };
  const ARGS = {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  };

  const [runQuery, { data, loading, error }] = useLazyQuery(ADD_APP_USER, ARGS);

  // return [runQuery, { data, loading, error }];
  // if (loading) return console.log(loading);
  // if (error) return console.log(error);
  return await runQuery();
}

export const formatAppUserArgs = (
  email: string,
  id: string,
  accessToken: string
) => {
  const VARIABLES = {
    email,
    globalUserId: id,
  };
  return {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  };
};

export default addNewAppUser;
