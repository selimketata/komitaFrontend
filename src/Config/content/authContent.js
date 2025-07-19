/**
 * Configuration file for authentication pages content
 * This file centralizes all text content for easier management and localization
 */

const authContent = {
  // Login page content
  login: {
    title: "Connectez-vous à Komita",
    subtitle: "Un monde de services, un monde tunisien",
    emailLabel: "Adresse mail",
    emailPlaceholder: "Entrez votre adresse mail",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    loginButton: "Se connecter",
    googleLogin: "Se connecter avec Google",
    noAccount: "Pas encore inscrit ?",
    signupLink: "S'inscrire",
    errorMessages: {
      invalidCredentials: "Email ou mot de passe incorrect",
      serverError: "Une erreur est survenue, veuillez réessayer"
    }
  },

  // Sign up page content
  signup: {
    title: "Inscrivez-vous sur Komita !",
    subtitle: "Un monde de services, un monde tunisien",
    roleSelection: "Choisissez votre rôle :",
    roles: {
      user: "Utilisateur",
      professional: "Professionnel"
    },
    fields: {
      firstname: {
        label: "Nom",
        placeholder: "Nom"
      },
      lastname: {
        label: "Prénom",
        placeholder: "Prénom"
      },
      email: {
        label: "Adresse mail",
        placeholder: "Adresse mail"
      },
      password: {
        label: "Mot de passe",
        placeholder: "Mot de passe"
      },
      confirmPassword: {
        label: "Confirmez le mot de passe",
        placeholder: "Confirmez votre mot de passe"
      }
    },
    alreadyRegistered: "Déjà inscrit ?",
    signupButton: "S'inscrire",
    googleSignup: "S'inscrire avec Google",
    validationErrors: {
      invalidEmail: "Adresse email invalide.",
      weakPassword: "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
      passwordMismatch: "Les mots de passe ne correspondent pas."
    },
    successMessage: "Inscription réussie ! Un email vous a été envoyé pour activer votre compte."
  },

  // Forget password page content
  forgetPassword: {
    title: "Mot de passe oublié",
    subtitle: "Entrez votre adresse mail pour recevoir un lien de réinitialisation.",
    emailLabel: "Adresse mail",
    sendButton: "Envoyer le lien",
    sendingButton: "Envoi en cours...",
    successMessage: "Un lien de réinitialisation a été envoyé à votre adresse mail.",
    errorMessage: "Échec de l'envoi du lien. Veuillez réessayer plus tard."
  },

  // Reset password page content
  resetPassword: {
    title: "Réinitialiser le mot de passe",
    subtitle: "Entrez votre nouveau mot de passe ci-dessous.",
    newPasswordLabel: "Nouveau mot de passe",
    confirmPasswordLabel: "Confirmez le nouveau mot de passe",
    resetButton: "Réinitialiser",
    resettingButton: "Réinitialisation en cours...",
    successMessage: "Le mot de passe a été réinitialisé avec succès.",
    redirectMessage: "Vous serez redirigé vers la page de connexion dans",
    seconds: "secondes",
    errorMessages: {
      invalidToken: "Jeton de réinitialisation invalide ou manquant.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      serverError: "Échec de la réinitialisation du mot de passe. Veuillez réessayer plus tard."
    },
    passwordStrength: {
      strong: "Mot de passe fort",
      requirements: "Le mot de passe doit comporter au moins 8 caractères, inclure des majuscules, des minuscules, un chiffre et un caractère spécial."
    }
  }
};

export default authContent;