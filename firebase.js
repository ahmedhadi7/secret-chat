import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwAUEgFXMZ2JiCrDEU3WBJt3tBzEoFX_c",
  authDomain: "fatimaali-39ef6.firebaseapp.com",
  projectId: "fatimaali-39ef6",
  storageBucket: "fatimaali-39ef6.firebasestorage.app",
  messagingSenderId: "873909987830",
  appId: "1:873909987830:web:aec5264a0d097643f73fd7",
  measurementId: "G-DF4K86QR5P"
};



const app = initializeApp(firebaseConfig);



const db = getFirestore(app);



export {
    addDoc, collection, db, doc,
    getDoc, onSnapshot, orderBy, query, serverTimestamp
};
