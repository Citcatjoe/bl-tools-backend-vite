
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-sdk"; // Importer l'authentification depuis firebase-sdk.js
import { showAddBtn, hideAddBtn, showLoginBox, hideLoginBox, showHeader, hideHeader, getElems, clearElems } from './app'; // Importer la fonction getElems depuis app.js



const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const userInfoElement = document.getElementById("user-info");





// Ajouter un événement sur le bouton de connexion
loginButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
  
    // Vérifier si l'email et le mot de passe sont valides
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Connexion réussie
        console.log("Utilisateur connecté:", userCredential.user);
        userInfoElement.innerText = `Connecté en tant que : ${userCredential.user.email}`;
      })
      .catch((error) => {
        // Erreur de connexion
        console.error("Erreur de connexion:", error.message);
        userInfoElement.innerText = "Email ou mot de passe incorrect.";
        alert("Email ou mot de passe incorrect. Veuillez vérifier vos informations.");
      });
  });
  
  
  
  //Options de connexion
  const uiConfig = {
    signInOptions: [
    
      "password", // Connexion par email/mot de passe
      "google.com"
    ],
    signInSuccessUrl: "/", // Redirection après connexion
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        console.log("Utilisateur connecté:", authResult.user);
  
        
        return true;
      }
    }
  };
  
  
  
  
  document.getElementById("logout").addEventListener("click", () => {
    signOut(auth)
      .then(() => console.log("Utilisateur déconnecté"))
      .catch((error) => console.error("Erreur de déconnexion", error));
  });
  
  
  
  
  // VERIFICATION USER CONNECTÉ AVEC EMAIL+MDP
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Utilisateur connecté :", user);
      userInfoElement.innerText = `Connecté en tant que : ${user.email}`;
      showHeader(); 
      hideLoginBox(); 
      showAddBtn();
      getElems();  
    } else { 
      console.log("Aucun utilisateur connecté");
      userInfoElement.innerText = "Aucun utilisateur connecté";
      hideHeader();
      showLoginBox();
      hideAddBtn();
      clearElems();
    }
  });

  