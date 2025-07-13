// errorHandler.js
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fonction générique pour gérer les erreurs d'API
export const handleApiError = (error) => {
    let message = 'Une erreur inconnue est survenue. Veuillez réessayer.';
    let title = 'Erreur de connexion';
  
    if (error.response) {
      if (error.response.status === 401) {
        if (error.response.data === "User not found") {
          message = 'Utilisateur non trouvé';
        } else if (error.response.data === "User account is not active. Please verify your email first.") {
          message = 'Compte inactif, veuillez vérifier votre email';
        }
      } else if (error.response.status === 400) {
        if (error.response.data === "email address already exists") {
          message = 'Adresse email déjà existante';
        }
      } else if (error.response.status === 500) {
        message = 'Erreur du serveur. Veuillez réessayer plus tard.';
      }
  
      toast.error(`${title}: ${message}`);
    } else {
      toast.error('Erreur inconnue : Une erreur est survenue. Veuillez réessayer.');
    }
  
    console.error("Error:", error);
  };


// Fonction spécifique pour gérer les erreurs de connexion
export const handleLoginError = (error, attempts, setAttempts, setIsBlocked, setError, setBlockTime, setShowErrorMessage) => {
    setAttempts(attempts + 1);
    setError("Identifiants invalides");
    console.log("attempts",attempts)
  
    if (attempts >= 5) {
        setIsBlocked(true);
        toast.error("Trop de tentatives : Vous avez dépassé le nombre maximal de tentatives. Essayez à nouveau dans 20 secondes.");
    
        startBlockCountdown(setBlockTime, setIsBlocked, setAttempts, setShowErrorMessage);
    }
  
    if (error.response && error.response.data) {
      const errorMessage = error.response.data;
  
      if (errorMessage.includes("User account is not active")) {
        toast.error("Compte inactif : Veuillez vérifier votre email pour activer votre compte.");

      } else {
        toast.error("Connexion invalide : Veuillez vérifier vos identifiants.");
      }
    } else {
        toast.error("Erreur inconnue : Une erreur est survenue. Veuillez réessayer plus tard.");

    }
  };
  

// Fonction pour démarrer le compte à rebours du blocage
const startBlockCountdown = (setBlockTime, setIsBlocked, setAttempts, setShowErrorMessage) => {
  let remainingTime = 20;
  setBlockTime(remainingTime);
  setShowErrorMessage(true);

  const interval = setInterval(() => {
    remainingTime -= 1;
    setBlockTime(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(interval);
      setIsBlocked(false);
      setAttempts(0);
      setBlockTime(0);
      setShowErrorMessage(false);
    }
  }, 1000);
};


  export const handleGoogleFailure = (err) => {
    if (err.response && err.response.data) {
      const errorMessage = err.response.data;
  
      if (errorMessage.includes("User does not exist")) {
        toast.error('User does not exist. Please sign up first.');
      } else {
        toast.error('Google Sign-In Failed: Please try again later.');
      }
    } else {
      toast.error('Google Sign-In Failed: An unknown error occurred.');
    }
  };