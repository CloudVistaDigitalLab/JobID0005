// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7rRrJplqK9jxkZP-tPTnGk4MbA3ueAfs",
  authDomain: "testdb-8ea15.firebaseapp.com",
  projectId: "testdb-8ea15",
  storageBucket: "testdb-8ea15.firebasestorage.app",
  messagingSenderId: "853738525470",
  appId: "1:853738525470:web:51956ce02cd6370b7def0f",
  measurementId: "G-LWSB7GZF7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;