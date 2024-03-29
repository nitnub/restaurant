const typeDefs = `#graphql

   # Queries - Stripe
  union ClientSecretResult   = ClientSecret   | StripeError | NotAuthorized
  union CreatePaymentResult  = CreatePayment  | StripeError | NotAuthorized 
  union PaymentMethodsResult = PaymentMethods | StripeError | NotAuthorized
  union CustomerTransactionsResult = CustomerTransactions | CustomerTransactionsError | StripeError | NotAuthorized
  
  # Queries - Internal
  union VerifiedTotalResult = VerifiedTotal | VerifiedTotalError | NotAuthorized 
  union CartResult = Cart | CartError | CartUpdateError | NotAuthorized
  union RestaurantResult = Restaurant | RestaurantError
  union RestaurantsResult = Restaurants | RestaurantsError

  # Mutations - Stripe
  union RegisterUserResult = RegisteredUser | RegisterUserError | NotAuthorized

  # Mutations - Internal
  union AddAppUserResult = AddedAppUser | AddAppUserError | NotAuthorized
  union ClearCartResult = ClearCart | ClearCartError | NotAuthorized


  type Restaurant {
    id: ID
    name: String
    description: String
    style: String
    rating: String
    image: String
    imageSm: String 
    homePage: String
    dish: [Dish]
  }

  type RestaurantError {
    message: String
  }


  

  type Restaurants {
    restaurants: [Restaurant]
  }

  type RestaurantsError {
    message: String
  }

  type Dish {
    id: ID
    name: String
    itemType: String
    description: String
    image: String
    price: Int
    restaurant: Int
    restaurantName: String
    vegetarian: Boolean
    vegan: Boolean
    glutenFree: Boolean
    count: Int
  }

  input DishInput {
    id: ID
    name: String
    itemType: String
    description: String
    image: String
    price: Int
    restaurant: Int
    restaurantName: String
    vegetarian: Boolean
    vegan: Boolean
    glutenFree: Boolean
    count: Int
  }

  type Metadata {
    null: String
  }

  type TransactionRecord {
      id: String
      object: String
      amount: Int
      application: String
      created: Int
      currency: String
      customer: String
      description: String
      invoice: String
      livemode: String
      metadata: Metadata
      processing: String
      review: String
      shipping: String
      source: String
      status: String
      amountCapturable: Int
      amountDetails: PaymentConfirmationTip
      amountReceived: Int
      applicationFeeAmount: String
      automaticPaymentMethods: String
      canceledAt: String
      cancellationReason: String
      captureMethod: String
      clientSecret: String
      confirmationMethod: String
      lastPaymentError: String
      latestCharge: String
      nextAction: String
      onBehalfOf: String
      paymentMethod: String
      paymentMethodOptions: PaymentConfirmationCard
      paymentMethodTypes: [String]
      receiptEmail: String
      setupFutureUsage: String
      statementDescriptor: String
      statementDescriptorSuffix: String
      transferData: String
      transferGroup: String
      cardId: String
      cardName: String
      cardType: String
      expMonth: Int
      expYear: Int
      custId: String
  }

  type CustomerTransactions {
    object: String
    dataFormatted: [TransactionRecord]
    hasMore: Boolean
    url: String
  }

  type CustomerTransactionsError {
    message: String
  }

  type StripeChecks {
    addressLine1Check: String
    addressPostalCodeCheck: String
    cvcCheck: String
  }

  type StripeNetworks {
    available: [String]
    preferred: String
  }

  type ThreeD {
    supported: Boolean
  }

  type StripeCard {
    brand: String
    checks: StripeChecks
    country: String
    expMonth: Int
    expYear: Int
    fingerprint: String
    funding: String
    generatedFrom: String
    last4: String
    networks: StripeNetworks
    threeDSecureUsage: ThreeD
    wallet: String
  }


  type StripeBillingAddress {
    city: String
    country: String
    line1: String
    line2: String
    postalCode: String
    state: String
  }

  type StripeBillingDetails {
    address: StripeBillingAddress
    email: String
    name: String
    phone: String
  }

  type PaymentMethod {
    id: String
    billingDetails: StripeBillingDetails
    card: StripeCard
    customer: String
    type: String
  }

  type PaymentMethods {
    paymentMethods: [PaymentMethod]
  } 

  type NotAuthorized {
    id: Int
    status: String
    message: String
    nextTarget: String
  }

  type StripeError {
    type: String
    message: String
    docUrl: String
    statusCode: Int
    requestId: String
  }

  type ClientSecret {
    clientSecret: String
  }

  type PaymentConfirmationTipAmount {
    amount: Int
  }

  type PaymentConfirmationTip {
    tip: PaymentConfirmationTipAmount
  }

  type PaymentConfirmationCard {
    amountCapturable: Int
    installments: String
    tip: String
    mandateOptions: String
    network: String
    requestThreeDSecure: String
  }
    
  type CreatePayment {
    id: String
    object: String
    amount: Int
    application: String
    created: Int
    currency: String
    customer: String
    description: String
    invoice: String
    livemode: String
    processing: String
    review: String
    shipping: String
    source: String
    status: String
    amountCapturable: Int
    amountDetails: PaymentConfirmationTip
    amountReceived: Int
    applicationFeeAmount: String
    automaticPaymentMethods: String
    canceledAt: String
    cancellationReason: String
    captureMethod: String
    clientSecret: String
    confirmationMethod: String
    lastPaymentError: String
    latestCharge: String
    nextAction: String
    onBehalfOf: String
    paymentMethod: String
    paymentMethodOptions: PaymentConfirmationCard
    paymentMethodTypes: [String]
    receiptEmail: String
    setupFutureUsage: String
    statementDescriptor: String
    statementDescriptorSuffix: String
    transferData: String
    transferGroup: String
  }

  type RegisteredUser {
    success: Boolean
    message: String
    accessToken: String
    refreshToken: String
  }

  type RegisterUserError {
    message: String
  }

  type AddedAppUser {
    id: Int
    globalUserId: String
    email: String
    stripeCustomerID: String
    avatar: String
    admin: Boolean
  }

  type AddAppUserError {
    message: String
  }

  type VerifiedTotal {
    verifiedTotal: Int
  }

  type VerifiedTotalError {
    message: String
  }

  type Cart {
    items: [Dish]
    totalCost: Int
    totalCount: Int
  }

  type CartError {
    message: String
  }

  type CartUpdateError {
    message: String
    type: String
  }

  type ClearCart {
    success: Boolean
  }

  type ClearCartError {
    message: String
  }

  type Query {
    restaurantResult(id: Int!): RestaurantResult
    restaurantsResult: RestaurantsResult
    dishes: [Dish]
    dishesByRestaurant(id: Int!): [Dish]
    clientSecretResult: ClientSecretResult
    paymentMethodsResult: PaymentMethodsResult
    verifiedTotalResult(dishes: [DishInput]): VerifiedTotalResult
    getCartResult: CartResult
    customerTransactionsResult: CustomerTransactionsResult
  }

  type Mutation {
    createPaymentResult(paymentMethodID: String, amount: Int): CreatePaymentResult 
    addAppUserResult(
        email: String,
        globalUserId: String,
    ): AddAppUserResult
    registerUserResult(
      firstName: String
      lastName: String
      email: String
      avatar: String
      password: String
    ): RegisterUserResult
    incrementCartResult(items: [DishInput]): CartResult
    decrementCartResult(id: String): CartResult
    clearCartResult: ClearCartResult
  }
`;

export default typeDefs;