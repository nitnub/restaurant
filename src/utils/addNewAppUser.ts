// import { useLazyQuery } from '@apollo/client';
// import ADD_APP_USER from '@/mutations/user/AddNewAppUser.mutation';
// async function addNewAppUser(
//   email: string,
//   globalUserId: string,
//   accessToken: string
// ) {
//   const VARIABLES = {
//     email,
//     globalUserId,
//   };
//   const ARGS = {
//     variables: VARIABLES,
//     context: {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   };

//   const [runQuery] = useLazyQuery(ADD_APP_USER, ARGS);

//   return await runQuery();
// }

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

// export default addNewAppUser;
