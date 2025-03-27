import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzmeJqUtF3YyA06fDEVb1kbdP28ZOXhNg",
  authDomain: "vigilaid-91857.firebaseapp.com",
  projectId: "vigilaid-91857",
  storageBucket: "vigilaid-91857.firebasestorage.app",
  messagingSenderId: "182528506634",
  appId: "1:182528506634:web:cc72a3f1cc94fd224258f3",
  measurementId: "G-DC3V6PRF31"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { firestore, auth };