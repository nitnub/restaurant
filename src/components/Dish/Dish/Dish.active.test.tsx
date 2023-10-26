/**
 * @jest-environment jsdom
 */
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { CartItem } from '@/types/cartTypes';

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
  avatar: 'TEST_AVATAR_STRING',
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

jest
  .spyOn(React, 'useContext')
  .mockImplementation(() => ({ ctx: contextValues }));

const testProps: CartItem = {
  id: 'someId',
  name: 'someName',
  itemType: 'someItemType',
  description: 'someDescription',
  image: '',
  price: 101,
  restaurant: 101,
  // restaurantName?: string;
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  count: 101,
};

describe.skip('Renders Dish', () => {
  it('displays add/remove buttons', () => {
    const addButton = screen.getByLabelText('add item to shopping cart');
    const remButton = screen.getByLabelText('remove item from shopping cart');

    expect(addButton).toBeVisible();
    expect(remButton).toBeVisible();
  });

  it('displays name', () => {
    const title = screen.getByRole('heading');

    expect(title).toHaveTextContent(dishProp.name);
    expect(title).toBeVisible();
  });

  it('displays description', () => {
    const title = screen.getByRole('paragraph');

    expect(title).toHaveTextContent(dishProp.description);
  });

  it('displays formatted price', () => {
    const dishPrice = screen.getByText('$12.99');

    expect(dishPrice).toBeVisible();
  });
});
