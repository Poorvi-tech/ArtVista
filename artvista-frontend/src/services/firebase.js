// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDb-tD6w3TWqjn9UPAGzwqGl2CXmDBWgrQ",
  authDomain: "artvista-5c245.firebaseapp.com",
  projectId: "artvista-5c245",
  storageBucket: "artvista-5c245.firebasestorage.app",
  messagingSenderId: "661811526211",
  appId: "1:661811526211:web:6636318c648c6cd993f2f6",
  measurementId: "G-BTHRQKJ59X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);