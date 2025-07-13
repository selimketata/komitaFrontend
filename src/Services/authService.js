import {axiosInstance} from './../api/axios';
import { handleApiError, handleLoginError, handleGoogleFailure } from './errorHandler';

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Extrait de authService.js à modifier ou à compléter

export const loginUser = async (email, password, attempts, setAttempts, setIsBlocked, setBlockTime, setShowErrorMessage) => {
  // Si attempts est >= 5, bloquer l'utilisateur
  const MAX_ATTEMPTS = 5;
  const BLOCK_TIME = 30; // en minutes
  
  try {
    const response = await axiosInstance.post(`/auth/authenticate`, { email, password });
    
    // Réinitialiser les tentatives en cas de succès
    setAttempts(0);
    return response.data;
  } catch (error) {
    // Incrémenter le compteur de tentatives
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    // Vérifier si on a atteint le nombre max de tentatives
    if (newAttempts >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setBlockTime(BLOCK_TIME);
      setShowErrorMessage(true);
      
      // Stocker le temps de blocage dans localStorage
      const blockUntil = Date.now() + (BLOCK_TIME * 60 * 1000);
      localStorage.setItem('loginBlockedUntil', blockUntil);
      
      // Planifier le déblocage automatique (en option)
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
        setShowErrorMessage(false);
        localStorage.removeItem('loginBlockedUntil');
      }, BLOCK_TIME * 60 * 1000);
    }
    
    throw error;
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const response = await axiosInstance.post("/oauth2/loginWithGoogle", {
      token: credentialResponse.credential,
    });
    return response.data;
  } catch (err) {
    console.log("Oauth2 error", err);
    handleGoogleFailure(err);
  }
};

export const signUpWithGoogle = async (googleToken) => {
  try {
    const response = await axiosInstance.post('/oauth2/signUpWithGoogle', {
      token: googleToken.credential,
    });
    const userData = response.data; // Contient les informations de l'utilisateur

    return userData;
  } catch (error) {
    console.error('Google sign-up error', error);
    handleGoogleFailure(error);
  }
};
