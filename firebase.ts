import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase supplies that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfuvtQ-po607pRHAnm3llTTxXuYj10E2k",
  authDomain: "playertracers.firebaseapp.com",
  projectId: "playertracers",
  storageBucket: "playertracers.firebasestorage.app",
  messagingSenderId: "113243358280",
  appId: "1:113243358280:web:0d853b079d54631db8447d",
  measurementId: "G-GQXSWNWYYT",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
