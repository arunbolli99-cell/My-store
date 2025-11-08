import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getDatabase } from "firebase/database";   // For Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyEXAMPLE",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd1234",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Choose the database type:
const db = getFirestore(app); // for Firestore
// const db = getDatabase(app); // for Realtime Database

export { db };
