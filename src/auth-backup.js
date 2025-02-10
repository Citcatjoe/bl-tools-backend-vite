
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-sdk"; // Importer l'authentification depuis firebase-sdk.js

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const userInfoElement = document.getElementById("user-info");

// Initialiser FirebaseUI
//const ui = new firebaseui.auth.AuthUI(auth);



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
  
  
  // Liste des identifiants autorisés (exemple avec des emails spécifiques)
  //const allowedEmails = ["cesargreppin@gmail.com", "cesar.greppin@ringier.ch"]; 
  // CHECK SI DANS LA LISTE DES MAIL ACCEPTES
  // const uiConfig = {
  //   signInOptions: [
  //     "google.com",   // Connexion avec Google
  //     "password"      // Connexion avec email/mot de passe
  //   ],
  //   signInSuccessUrl: "/", // Redirection après connexion
  //   callbacks: {
  //     signInSuccessWithAuthResult: (authResult) => {
  //       console.log("Utilisateur connecté:", authResult.user);
  //       // Vérifier si l'email de l'utilisateur fait partie des emails autorisés
  //       const userEmail = authResult.user.email;
  //       if (allowedEmails.includes(userEmail)) {
  //         // L'email est autorisé
  //         return true;
  //       } else {
  //         // L'email n'est pas autorisé, déconnexion immédiate
  //         signOut(auth).then(() => {
  //           console.log("Utilisateur déconnecté car non autorisé");
  //           alert("Votre email n'est pas autorisé à se connecter.");
  //         }).catch((error) => {
  //           console.error("Erreur lors de la déconnexion:", error);
  //         });
  //         return false; // Empêche la redirection vers la page de succès
  //       }
  //     }
  //   }
  // };
  
  
  // Lancer FirebaseUI sur un élément HTML
  // export function startFirebaseUI() {
  //   ui.start("#firebaseui-auth-container", uiConfig);
  // }
  
  
  document.getElementById("logout").addEventListener("click", () => {
    signOut(auth)
      .then(() => console.log("Utilisateur déconnecté"))
      .catch((error) => console.error("Erreur de déconnexion", error));
  });
  
  
  
  // VERIFICATION USER CONNECTÉ AVEC UI
  
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log("Utilisateur connecté :", user);
  //     document.getElementById("user-info").innerText = `Connecté en tant que : ${user.email}`;
  //   } else {
  //     console.log("Aucun utilisateur connecté");
  //     document.getElementById("user-info").innerText = "Aucun utilisateur connecté";
  //   }
  // });
  
  // Vérifier l'état de la connexion
  
  // VERIFICATION USER CONNECTÉ AVEC EMAIL+MDP
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Utilisateur connecté :", user);
      userInfoElement.innerText = `Connecté en tant que : ${user.email}`;
    } else {
      console.log("Aucun utilisateur connecté");
      userInfoElement.innerText = "Aucun utilisateur connecté";
    }
  });