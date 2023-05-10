import { getApp, initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwch-_22nhgpcE8NYltiqSfq8rtytREgc",
  authDomain: "restaurant-app-673c9.firebaseapp.com",
  projectId: "restaurant-app-673c9",
  storageBucket: "restaurant-app-673c9.appspot.com",
  messagingSenderId: "736006982645",
  appId: "1:736006982645:web:fc88439ab0693238f92ebc",
  measurementId: "G-GGDRB919K2"
};

function initializeAppIfNecessary() {
  try {
    return getApp();
  } catch (any) {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
    return initializeApp(firebaseConfig);
  }
}

const app = initializeApp(firebaseConfig);

export default app;
