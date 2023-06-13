import React, { useState } from 'react';
import Meta from '@/components/Meta';
import Head from 'next/head';
import SearchBar from '@/components/Filter/SearchBar';
import RestaurantList from '@/components/Restaurant/RestaurantList';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Modal from '@/components/Modal';
import GET_ALL_RESTAURANTS from '@/queries/restaurant/GetAllRestaurants.query';
import { Restaurant, RestaurantQueryResult } from '@/types/restaurantTypes';
import ChipToggleContainer from '@/components/Filter/Chip/ChipToggleContainer';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home(props) {
  const defaultQueryResult: RestaurantQueryResult = {
    name: '',
    styles: [],
  };

  // Modal
  const [open, setOpen] = useState(false);
  const [modalBody, setModalBody] = useState(
    'Account was successfully created.'
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    router.push('/');
    setOpen(false);
  };
  const title = `Account Created`;
  const buttonText = `Let's Eat!`;

  // Router query for new accounts
  const router = useRouter();
  const { newUser, email } = router.query;

  useEffect(() => {
    if (newUser) {
      const body = email;
      setModalBody(body);
      handleOpen();
    }
  }, []);

  const [query, setQuery] = useState(defaultQueryResult);

  const { data, loading, error } = useQuery(GET_ALL_RESTAURANTS);
  if (loading) {
    return (
      <div role="loadingContainer" className="loadingContainer">
        <CircularProgress />
      </div>
    );
  }
  if (error) return console.log(error);

  const { restaurants } = data.restaurantsResult;

  if (data.restaurantsResult.__typename !== 'Restaurants') {
    return <div>Error loading page. Please try again!</div>;
  }

  let stylesListRaw = restaurants.map((el: Restaurant) => el.style);
  const foodStyles = [...new Set(stylesListRaw)];

  const searchPool =
    query.styles.length > 0
      ? restaurants.filter((el: Restaurant) => query.styles.includes(el.style))
      : restaurants;

  return (
    <>
      <Meta />
      <Head >
        <title role="title">Restaurant App | Welcome!</title>
      </Head>

      <Container className="parentContainer">
        <SearchBar
          role="homePageSearch"
          query={query}
          setQuery={setQuery}
          label="Find Restaurant"
          searchPool={searchPool}
        />
        <ChipToggleContainer
          query={query}
          setQuery={setQuery}
          foodStyles={foodStyles}
        ></ChipToggleContainer>
        <RestaurantList query={query} restaurants={restaurants} />
        <Modal
          open={open}
          handleClose={handleClose}
          title={title}
          email={email}
          buttonText={buttonText}
        />
      </Container>
    </>
  );
}
