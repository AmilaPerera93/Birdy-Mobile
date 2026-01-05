// src/services/chat.js
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../config/firebase";

// 1. Get List of People I Matched With
export const fetchMatches = async (currentUserId) => {
  try {
    const matchesRef = collection(db, "matches");
    const q = query(matchesRef, where("users", "array-contains", currentUserId));
    
    const snapshot = await getDocs(q);
    
    const matches = await Promise.all(snapshot.docs.map(async (matchDoc) => {
      const matchData = matchDoc.data();
      const otherUserId = matchData.users.find(uid => uid !== currentUserId);
      
      // FETCH REAL USER DATA
      let name = "Unknown User";
      let photo = null;

      if (otherUserId) {
        const userSnap = await getDoc(doc(db, "users", otherUserId));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          name = userData.name || "No Name";
          photo = userData.profileImage || null;
        }
      }

      return {
        id: matchDoc.id,
        otherUserId: otherUserId,
        name: name,   
        photo: photo, 
        lastMessage: matchData.lastMessage
      };
    }));

    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

// 2. Send a Message
export const sendMessage = async (matchId, senderId, text) => {
  try {
    const messagesRef = collection(db, "matches", matchId, "messages");
    await addDoc(messagesRef, {
      text,
      user: { _id: senderId },
      createdAt: serverTimestamp()
    });
    
    // Optional: Update the "last message" on the main match document
    // const matchRef = doc(db, "matches", matchId);
    // await updateDoc(matchRef, { lastMessage: text });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};