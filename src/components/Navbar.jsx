import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./../Context/AuthContext";  // Import AuthContext
import { useLocation } from "react-router-dom"; // Import useLocation to track current page

import NavbarBeforeLogin from "./NavbarBeforeLogin";
import NavbarAfterLogin from "./NavbarAfterLogin";
import { useTranslation } from "react-i18next";
// Fix the import path for navbarContent
import { navbarContent } from "@config/content/navbarContent.js"; 

const Navbar = () => {
  const { i18n, t } = useTranslation(); // i18n for language switching
  const { token, user, login, logout } = useContext(AuthContext); // Consume token and logout from AuthContext
  const [language, setLanguage] = useState("FR");
  const location = useLocation(); // Get current location/path

  // Initialize the language from localStorage if it exists
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage.toLowerCase());
    }
  }, [i18n]);

  // Switch language function
  const switchLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    i18n.changeLanguage(newLang.toLowerCase());
  };

  // Ensure Navbar re-renders when token changes (this is automatically handled by context)
  useEffect(() => {
    // The component will re-render when token or user state changes due to the context update
  }, [token, user]);

  // Translate button texts
  const loginButtonText = t('auth.login.loginButton');
  const signupButtonText = t('auth.signup.signupButton');

  return (
    <div>
      {token ? (
        <NavbarAfterLogin
          onLogout={() => logout()}  
          language={language}
          switchLanguage={switchLanguage}
          currentPath={location.pathname}
          content={navbarContent}
        />
      ) : (
        <NavbarBeforeLogin
          onLogin={login} 
          language={language}
          switchLanguage={switchLanguage}
          currentPath={location.pathname}
          content={navbarContent}
          loginButtonText={loginButtonText}
          signupButtonText={signupButtonText}
        />
      )}
    </div>
  );
};

export default Navbar;
