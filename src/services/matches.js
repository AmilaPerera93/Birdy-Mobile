// src/services/matches.js
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebase";

export const getPotentialMatches = async (currentUserId) => {
  try {
    const usersRef = collection(db, "users");
    // In a real app, we would filter by gender/location here.
    // For now, we just get everyone and filter the current user out in JS.
    const q = query(usersRef);
    
    const snapshot = await getDocs(q);
    const profiles = snapshot.docs
      .map(doc => doc.data())
      .filter(profile => profile.uid !== currentUserId); // Don't show myself!

    return profiles;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};