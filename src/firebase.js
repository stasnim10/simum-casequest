import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCNdT3rmoZlQLHC5hrnedlI4lcK9A62BQ",
  authDomain: "casequest-62b9b.firebaseapp.com",
  projectId: "casequest-62b9b",
  storageBucket: "casequest-62b9b.firebasestorage.app",
  messagingSenderId: "329872421373",
  appId: "1:329872421373:web:828b8c247e79e1233d2994",
  measurementId: "G-ED7SRYX2XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;