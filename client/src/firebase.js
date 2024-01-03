// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-e4a3b.firebaseapp.com",
  projectId: "mern-estate-e4a3b",
  storageBucket: "mern-estate-e4a3b.appspot.com",
  messagingSenderId: "724777103803",
  appId: "1:724777103803:web:6a137ea983a7651ebdd49e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);