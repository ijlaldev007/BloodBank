// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIdJYqTegR8_Q8Mmt2LhgZ_eQrCG8HHUE",
  authDomain: "bloodbank-3a944.firebaseapp.com",
  projectId: "bloodbank-3a944",
  storageBucket: "bloodbank-3a944.firebasestorage.app",
  messagingSenderId: "152517093783",
  appId: "1:152517093783:web:d46cccfb77b5c4c22b3cd2",
  measurementId: "G-N2LHPJ9MLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);