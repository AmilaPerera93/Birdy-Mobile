// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDQEawZNfMP8XHYWOBHdtYxtJH15m9o4qY",
  authDomain: "birdy-mob.firebaseapp.com",
  projectId: "birdy-mob",
  storageBucket: "birdy-mob.firebasestorage.app",
  messagingSenderId: "415264984242",
  appId: "1:415264984242:web:82926ae967e84869210dab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("Birdy Firebase Connected Successfully!");