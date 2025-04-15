// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDf13C2ctwZfd0VdDvrneVAGb633-5gpOI",
    authDomain: "fitflow-9ba74.firebaseapp.com",
    projectId: "fitflow-9ba74",
    storageBucket: "fitflow-9ba74.firebasestorage.app",
    messagingSenderId: "626884014852",
    appId: "1:626884014852:web:f18b310cc99437a9fa9651"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
