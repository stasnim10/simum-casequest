import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNFkmDBk0DIUhywKkhkphXpgtKBK7bfpA",
  authDomain: "casequest-app.firebaseapp.com",
  projectId: "casequest-app",
  storageBucket: "casequest-app.firebasestorage.app",
  messagingSenderId: "897643088053",
  appId: "1:897643088053:web:0c14e5d07a52f66d31d6fc",
  measurementId: "G-CMY2VDQ4VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
