import { render, screen } from '@testing-library/react';
import Home from '../index';
import '@testing-library/jest-dom';

import fetch from 'cross-fetch';
import {
  ApolloClient,
  ApolloProvider,
  ApolloServer,
  HttpLink,
  InMemoryCache,
  UserAPI,
} from '@apollo/client';

const options = {
  typePolicies: {
    Restaurant: {
      keyFields: [
        'upc',
        'id',
        'name',
        'description',
        'style',
        'rating',
        'image',
        'imageSm',
        'homePage',
        'dish',
      ],
    },
  },
};

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch }),
  cache: new InMemoryCache(options),
});

// import client from '@/dbConfigs/apollo.client';
import { useRouter } from 'next/router';

// mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// setup a new mocking function for push method
const pushMock = jest.fn();

// mock a return value on useRouter
useRouter.mockReturnValue({
  query: {},
  // return mock for push method
  push: pushMock,
  // ... add the props or methods you need
});

describe('Renders homepage ', () => {
  render(
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );

  it('renders load spinner', () => {
    const loadingContainer = screen.getByRole('loadingContainer');
    expect(loadingContainer).toBeVisible();
  });
});
