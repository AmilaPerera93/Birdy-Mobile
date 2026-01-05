// src/services/swipes.js
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const handleSwipe = async (currentUserId, targetUserId, action) => {
  try {
    // 1. Save the swipe (So we don't show this person again)
    // Structure: users -> {userId} -> swipes -> {targetId}
    await setDoc(doc(db, "users", currentUserId, "swipes", targetUserId), {
      action: action, // "like" or "pass"
      timestamp: serverTimestamp()
    });

    // 2. If it's a PASS, we are done.
    if (action === "pass") return { isMatch: false };

    // 3. If it's a LIKE, check if they liked us back!
    const targetSwipeRef = doc(db, "users", targetUserId, "swipes", currentUserId);
    const targetSwipeSnap = await getDoc(targetSwipeRef);

    if (targetSwipeSnap.exists()) {
      const data = targetSwipeSnap.data();
      if (data.action === "like") {
        // IT'S A MATCH! 🎉
        
        // Create a "Match" document (Chat Room)
        const matchId = [currentUserId, targetUserId].sort().join('_'); // Unique ID
        await setDoc(doc(db, "matches", matchId), {
          users: [currentUserId, targetUserId],
          timestamp: serverTimestamp(),
          lastMessage: "It's a Match! Say hello."
        });

        return { isMatch: true, matchId };
      }
    }

    return { isMatch: false };

  } catch (error) {
    console.error("Swipe Error:", error);
    return { isMatch: false };
  }
};