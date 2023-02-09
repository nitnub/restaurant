// export interface StripeError {
//   type?: string;
//   message?: string;
//   docUrl?: string;
//   statusCode?: number;
//   requestId?: string;
// }

export interface Restaurant {
  id: number | string;
  name: string;
  description: string;
  style: string;
  rating: string;
  image: string;
  homePage: string;
  dish: Dish[];
}

export interface RestaurantError {
  message: string;
}

export interface Restaurants {
  restaurants: Restaurant[];
}

export interface RestaurantsError {
  message: string;
}

export interface Dish {
  id: number | string;
  name: string;
  itemType: string;
  description: string;
  image: string;
  price: number;
  restaurant: number;
  restaurantName: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  count: number;
}

export interface DishInput {
  id: number | string;
  name: string;
  itemType: string;
  description: string;
  image: string;
  price: number;
  restaurant: number;
  restaurantName: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  count: number;
}

export interface Metadata {
  null: string;
}

export interface TransactionRecord {
  id: string;
  object: string;
  amount: number;
  application: string;
  created: number;
  currency: string;
  customer: string;
  description: string;
  invoice: string;
  livemode: string;
  metadata: Metadata;
  processing: string;
  review: string;
  shipping: string;
  source: string;
  status: string;
  amountCapturable: number;
  amountDetails: PaymentConfirmationTip;
  amountReceived: number;
  applicationFeeAmount: string;
  automaticPaymentMethods: string;
  canceledAt: string;
  cancellationReason: string;
  captureMethod: string;
  clientSecret: string;
  confirmationMethod: string;
  lastPaymentError: string;
  latestCharge: string;
  nextAction: string;
  onBehalfOf: string;
  paymentMethod: string;
  paymentMethodOptions: PaymentConfirmationCard;
  paymentMethodTypes: String[];
  receiptEmail: string;
  setupFutureUsage: string;
  statementDescriptor: string;
  statementDescriptorSuffix: string;
  transferData: string;
  transferGroup: string;
  cardId: string;
  cardName: string;
  cardType: string;
  expMonth: number;
  expYear: number;
  custId: string;
}

export interface TransactionHistory {
  object: string;
  dataFormatted: TransactionRecord[];
  hasMore: boolean;
  url: string;
}

export interface CustomerTransactionsError {
  message: string;
}

export interface StripeChecks {
  addressLine1Check: string;
  addressPostalCodeCheck: string;
  cvcCheck: string;
}

export interface StripeNetworks {
  available: String[];
  preferred: string;
}

export interface ThreeD {
  supported: boolean;
}

export interface StripeCard {
  brand: string;
  checks: StripeChecks;
  country: string;
  expMonth: number;
  expYear: number;
  fingerprint: string;
  funding: string;
  generatedFrom: string;
  last4: string;
  networks: StripeNetworks;
  threeDSecureUsage: ThreeD;
  wallet: string;
}

export interface StripeBillingAddress {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
}

export interface StripeBillingDetails {
  address: StripeBillingAddress;
  email: string;
  name: string;
  phone: string;
}

export interface PaymentMethod {
  id: string;
  billingDetails: StripeBillingDetails;
  card: StripeCard;
  customer: string;
  type: string;
}

export interface PaymentMethods {
  paymentMethods: PaymentMethod[];
}

export interface NotAuthorized {
  id: number;
  status: string;
  message: string;
  nextTarget: string;
}

export interface StripeError {
  type: string;
  message: string;
  docUrl: string;
  statusCode: number;
  requestId: string;
}

export interface ClientSecret {
  clientSecret: string;
}

export interface PaymentConfirmationTipAmount {
  amount: number;
}

export interface PaymentConfirmationTip {
  tip: PaymentConfirmationTipAmount;
}

export interface PaymentConfirmationCard {
  amountCapturable: number;
  installments: string;
  tip: string;
  mandateOptions: string;
  network: string;
  requestThreeDSecure: string;
}

export interface Payment {
  id: string;
  object: string;
  amount: number;
  application: string;
  created: number;
  currency: string;
  customer: string;
  description: string;
  invoice: string;
  livemode: string;
  processing: string;
  review: string;
  shipping: string;
  source: string;
  status: string;
  amountCapturable: number;
  amountDetails: PaymentConfirmationTip;
  amountReceived: number;
  applicationFeeAmount: string;
  automaticPaymentMethods: string;
  canceledAt: string;
  cancellationReason: string;
  captureMethod: string;
  clientSecret: string;
  confirmationMethod: string;
  lastPaymentError: string;
  latestCharge: string;
  nextAction: string;
  onBehalfOf: string;
  paymentMethod: string;
  paymentMethodOptions: PaymentConfirmationCard;
  paymentMethodTypes: String[];
  receiptEmail: string;
  setupFutureUsage: string;
  statementDescriptor: string;
  statementDescriptorSuffix: string;
  transferData: string;
  transferGroup: string;
}

export interface RegisteredUser {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserError {
  message: string;
}

export interface AppUser {
  id: number;
  globalUserId: string;
  email: string;
  stripeCustomerID: string;
  avatar: string;
  admin: boolean;
}

export interface AddAppUserError {
  message: string;
}

export interface VerifiedTotal {
  verifiedTotal: number;
}

export interface VerifiedTotalError {
  message: string;
}

export interface Cart {
  items: Dish[];
  totalCost: number;
  totalCount: number;
}

export interface CartError {
  message: string;
}

export interface CartUpdateError {
  message: string;
  type: string;
}

export interface ClearCart {
  success: boolean;
}

export interface ClearCartError {
  message: string;
}
