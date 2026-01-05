// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// We import 'initializeAuth' instead of 'getAuth' to configure storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQEawZNfMP8XHYWOBHdtYxtJH15m9o4qY",
  authDomain: "birdy-mob.firebaseapp.com",
  projectId: "birdy-mob",
  storageBucket: "birdy-mob.firebasestorage.app",
  messagingSenderId: "415264984242",
  appId: "1:415264984242:web:82926ae967e84869210dab"
};
const app = initializeApp(firebaseConfig);

// Initialize Auth with Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

console.log("🔥 Birdy Firebase Connected Successfully!");

export { auth, db };

