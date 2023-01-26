import { useMutation, useQuery } from '@apollo/client';
import { getCookie } from './cookieHandler';
import { GET_OFFICIAL_TOTAL } from '../graphql/queries';
import { CartItem } from '@/types/cartTypes';

export default async function (dishes: CartItem[]) {
  const VARIABLES = {
    dishes,
  };

  const ARGS = {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const { data, loading, error } = useQuery(
    GET_OFFICIAL_TOTAL,
    ARGS
  );
    if (loading) console.log('Loading official total...')
    if (error) return console.log('Error loading official total...', error)

  return data;
}
