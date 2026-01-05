// src/utils/seedData.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const addDummyUsers = async () => {
  const dummyUsers = [
    {
      uid: "user_001",
      name: "Sarah Connors",
      bio: "Love hiking and sci-fi movies. Looking for someone to save the world with.",
      profileImage: null, // We'll handle images later
      age: 28
    },
    {
      uid: "user_002",
      name: "Mike Ross",
      bio: "Lawyer by day, gamer by night. I have a photographic memory.",
      profileImage: null,
      age: 30
    },
    {
      uid: "user_003",
      name: "Jessica Pearson",
      bio: "Ambition is my middle name. Looking for an equal partner.",
      profileImage: null,
      age: 35
    }
  ];

  try {
    for (const user of dummyUsers) {
      await setDoc(doc(db, "users", user.uid), user);
    }
    alert("✅ 3 Dummy Users Added!");
  } catch (error) {
    alert("Error adding users: " + error.message);
  }
};