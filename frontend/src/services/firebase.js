// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ nécessaire

const firebaseConfig = {
  apiKey: "AIzaSyAaulUH_JqZc4Bur0jfo3Gz8tCTCqQnNmg",
  authDomain: "schoolapp-ef28f.firebaseapp.com",
  projectId: "schoolapp-ef28f",
  storageBucket: "schoolapp-ef28f.firebasestorage.app",
  messagingSenderId: "242882674528",
  appId: "1:242882674528:web:32501563d4bd6ea3fd6805",
  measurementId: "G-H9L185F18N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentification
const auth = getAuth(app);

// 🔥 Firestore
const firestore = getFirestore(app);

// ✅ Exporte auth + firestore
export { auth, firestore };