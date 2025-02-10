// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Importer FirebaseUI
// import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css"; // Importer le CSS de FirebaseUI


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const userInfoElement = document.getElementById("user-info");



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtIOcs0zHVfHiW872SUL3VKDHY7G0OlGQ",
  authDomain: "blick-tools-app.firebaseapp.com",
  projectId: "blick-tools-app",
  storageBucket: "blick-tools-app.firebasestorage.app",
  messagingSenderId: "704592955335",
  appId: "1:704592955335:web:8a78fc79dc59bce752bbe2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exporter l'authentification pour qu'il puisse être utilisé dans auth.js
export { auth };

