import { useMutation } from '@apollo/client';

import { GET_CLIENT_SECRET } from '../graphql/queries';


export default async function (customerId: string) {

  const  VARIABLES= {customerId};
  
  const ARGS = {
    variables: VARIABLES
  }
  const [getSecret, {data, loading, error}] = useMutation(GET_CLIENT_SECRET, ARGS)

  await getSecret()
  return data;
}
