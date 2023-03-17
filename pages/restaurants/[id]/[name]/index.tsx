import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import AppContext from '@/components/context';
import Meta from '@/components/Meta';
import DishList from '@/components/Dish/DishList';
import { GET_RESTAURANT } from '@/src/graphql/queries';
import SearchBar from '@/components/Filter/SearchBar';
import { getCookie } from '@/utils/cookieHandler';
import Head from 'next/head';

const Restaurant: React.FunctionComponent = () => {
  const ctx = useContext(AppContext);
  const [query, setQuery] = useState('');



  const router = useRouter();

  // // Can now destructure any params from router.query
  const { name, id } = router.query;
  const VARIABLES = { id: Number(id) };
  const ARGS = {
    variables: VARIABLES,
    context: {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    },
  };

  const { data, loading, error } = useQuery(GET_RESTAURANT, ARGS);

  if (loading) {
    return (<div>Loading...</div>);
  }
  if (error) {
    return (<div>Unable to load page. Please try again!</div>);
  }
  const location = data.restaurantResult;

  if (!location) return;
  return (
    <>
      <Meta title={location.name} description={location.description} />
      <Head>
        <title>Restaurant App | {location.name}</title>
      </Head>

      <img className="headerImage" src={`/images/restaurants/lg/${location.image}`} alt={location.name} />
      <div className="headerBackgroundSpan" />
      <div className="mainBackground"></div>

      <div className="resInputContainer">
        <Container className="parentContainer">
          <div className="resTitleContainer">
            <div className="resTitleName">{location.name}</div>
            <div className="resTitleStyle">{location.style}</div>
            <div className="resTitleDescription">{location.description}</div>
          </div>
          <div className="headerImageSpacer"></div>
          <SearchBar
            setQuery={setQuery}
            searchPool={location.dish}
            label="Search menu"
          />
          <DishList
            dishes={location.dish}
            query={query}
            restaurantName={location.name}
            loading={false}
          />
     
        </Container>
      </div>
    </>
  );
};

export default Restaurant;
