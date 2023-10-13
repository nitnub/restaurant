/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Dish from './Dish.active';
import '@testing-library/jest-dom';
import client from '@/test_resources/apolloConfig';
import { ApolloProvider } from '@apollo/client';
import React from 'react';

const dishProp = {
  id: '1',
  name: 'Apple Pie',
  description: 'A tasty apple pie!',
  count: 10,
  price: 1299,
  itemType: 'meal',
  vegetarian: true,
  vegan: true,
  glutenFree: true,
  image: '/images/dishes/td1.jpg',
  restaurant: 1,
};

const defaultCart = {
  items: [],
  totalCost: 0,
  totalCount: 0,
};

const defaultUser = {
  GUID: '',
  firstName: '',
  lastName: '',
  email: 'Sign In',
  password: '',
  avatar: 'TEST_AVATAR_STRING', //(getCookie('avatar') as string) || '',
  admin: null,
  active: null,
};

const contextValues = {
  cart: defaultCart,
  clientSecret: '',
  customerID: '',
  authProvider: 'standard',
  accessToken: '',
  user: defaultUser,
  checkoutTotal: 0,
  checkoutCart: defaultCart,
  profile: '',
  query: '',
};

jest.spyOn(React, 'useContext').mockImplementation(() => contextValues);

function setup() {
  render(
    <ApolloProvider client={client}>
      <Dish dishProp={dishProp} />
    </ApolloProvider>
  );
}

beforeEach(() => setup());

describe.skip('Renders Dish ', () => {
  // console.log(screen.debug());
  it('add/remove buttons', () => {
    const addButton = screen.getByLabelText('add item to shopping cart');
    const remButton = screen.getByLabelText('remove item from shopping cart');

    expect(addButton).toBeVisible();
    expect(remButton).toBeVisible();
  });

  it('display name', () => {
    const title = screen.getByRole('heading');

    expect(title).toHaveTextContent(dishProp.name);
    expect(title).toBeVisible();
  });

  it('display description', () => {
    const title = screen.getByRole('paragraph');

    expect(title).toHaveTextContent(dishProp.description);
  });

  it('display formatted price', () => {
    const dishPrice = screen.getByText('$12.99');

    expect(dishPrice).toBeVisible();
  });
});
