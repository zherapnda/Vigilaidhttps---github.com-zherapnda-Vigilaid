import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzmeJqUtF3YyA06fDEVb1kbdP28ZOXhNg',
  authDomain: 'vigilaid-91857.firebaseapp.com',
  projectId: 'vigilaid-91857',
  storageBucket: 'vigilaid-91857.appspot.com',
  messagingSenderId: '182528506634',
  appId: '1:182528506634:web:cc72a3f1cc94fd224258f3',
  measurementId: 'G-DC3V6PRF31',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
