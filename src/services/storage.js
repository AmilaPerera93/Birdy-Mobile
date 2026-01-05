// src/services/storage.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// We now save the image DIRECTLY to the database as text (Base64)
export const saveUserProfile = async (userId, imageBase64, bio) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Create the update object
    const dataToUpdate = {};
    if (bio) dataToUpdate.bio = bio;
    if (imageBase64) dataToUpdate.profileImage = `data:image/jpeg;base64,${imageBase64}`;

    await updateDoc(userRef, dataToUpdate);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};