// src/services/auth.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// 1. Sign Up Function
export const signUpUser = async (email, password, name) => {
  try {
    // A. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // B. Create User Profile in Database (Firestore)
    // We create a document with the same ID as the Auth UID
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date(),
      isWingman: false, // Default settings for Birdy
      reliabilityScore: 100 // Starting score for Anti-Ghosting
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 2. Login Function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. Logout Function
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};