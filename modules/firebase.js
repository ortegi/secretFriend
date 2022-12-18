// Import the functions you need from the SDKs you need
import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0-T2PPdgXEChDJPedpdnRDqzscS4gLEs",
  authDomain: "secretfriend-44c50.firebaseapp.com",
  projectId: "secretfriend-44c50",
  storageBucket: "secretfriend-44c50.appspot.com",
  messagingSenderId: "602318742541",
  appId: "1:602318742541:web:cc842c2139413bdcaf2144"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)