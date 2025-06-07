// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD75Y_mrVTEGRt-ixfolWVQPrQDHYwxIYI",
  authDomain: "formulario-registro-1edc8.firebaseapp.com",
  projectId: "formulario-registro-1edc8",
  storageBucket: "formulario-registro-1edc8.firebasestorage.app",
  messagingSenderId: "1034766354728",
  appId: "1:1034766354728:web:52e93db9b638659ac5e81d",
  measurementId: "G-DXHB80MN9L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };