import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyCJjxjDAKzknoU3nSvjN_uqWKwRGhn50Jg",
    authDomain: "project-f44e1.firebaseapp.com",
    projectId: "project-f44e1",
    storageBucket: "project-f44e1.appspot.com",
    messagingSenderId: "67335374201",
    appId: "1:67335374201:web:ce4b34f6ce59c319789ba8",
    databaseURL: "https://project-f44e1-default-rtdb.firebaseio.com/",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
