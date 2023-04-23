import { gql } from '@apollo/client';

export const GET_RESTAURANT = gql`
  query GetRestaurant($id: Int!) {
    restaurantResult(id: $id) {
      __typename
      ... on Restaurant {
        id
        name
        description
        style
        rating
        image
        imageSm
        dish {
          id
          name
          itemType
          description
          image
          price
          restaurant
          restaurantName
          vegetarian
          vegan
          glutenFree
        }
      }
      ... on RestaurantError {
        message
      }
    }
  }
`;

export const GET_ALL_RESTAURANTS = gql`
  query GetAllRestaurants {
    restaurantsResult {
      __typename
      ... on Restaurants {
        restaurants {
          id
          name
          description
          style
          rating
          image
          imageSm
          homePage
        }
      }
      ... on RestaurantsError {
        message
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCartResult {
      __typename
      ... on Cart {
        items {
          id
          name
          itemType
          description
          image
          restaurant
          vegetarian
          vegan
          glutenFree
          count
        }
        totalCost
        totalCount
      }
      ... on CartError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const GET_OFFICIAL_TOTAL = gql`
  query GetVerifiedCartPrice($dishes: [DishInput!]) {
    verifiedTotalResult(dishes: $dishes) {
      __typename
      ... on VerifiedTotal {
        verifiedTotal
      }
      ... on VerifiedTotalError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const GET_CLIENT_SECRET = gql`
  query GetStripeClientSecret {
    clientSecretResult {
      __typename
      ... on ClientSecret {
        clientSecret
      }
      ... on StripeError {
        type
        message
        docUrl
        statusCode
        requestId
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetStripePaymentMethods {
    paymentMethodsResult {
      __typename
      ... on PaymentMethods {
        paymentMethods {
          id
          billingDetails {
            address {
              city
              country
              line1
              line2
              postalCode
              state
            }
            email
            name
            phone
          }
          card {
            brand
            checks {
              addressLine1Check
              addressPostalCodeCheck
              cvcCheck
            }
            country
            expMonth
            expYear
            fingerprint
            funding
            generatedFrom
            last4
            networks {
              available
              preferred
            }
            threeDSecureUsage {
              supported
            }
            wallet
          }
          customer
          type
        }
      }
      ... on StripeError {
        type
        message
        docUrl
        statusCode
        requestId
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const GET_CUSTOMER_TRANSACTIONS = gql`
  query GetCustomerTransactions {
    customerTransactionsResult {
      __typename
      ... on CustomerTransactions {
        object
        dataFormatted {
          id
          amount
          created
          currency
          customer
          amountReceived
          clientSecret
          paymentMethod
          transferData
          transferGroup
          cardId
          cardName
          cardType
          expMonth
          expYear
          custId
        }
        hasMore
        url
      }
      ... on CustomerTransactionsError {
        message
      }
      ... on StripeError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;
