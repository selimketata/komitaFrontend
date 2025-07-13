import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NavbarBeforeLogin({ onLogin, language, switchLanguage, currentPath, content, loginButtonText, signupButtonText }) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const languageMenuRef = useRef(null);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  // Function to change language
  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-full h-70">
      <div className="flex items-center justify-between border-slate-300 shadow-md shadow-gray-200 py-2 px-5 lg:px-20">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <img src="/komita.png" alt={t('navbar.common.logo.alt')} className="w-12 md:w-20" />
            <div className="w-full h-[2px] mt-1 bg-red"></div>
            <div className="py-0 tracking-widest">
              <span className="text-red text-center font-bold text-lg md:text-xl font-calibri">K</span>
              <span className="md:text-xl text-lg font-calibri">omita</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end gap-10 flex-1 md:mr-10">
          <div className="flex gap-8">
            {content.beforeLogin.links.map((link) => (
              <Link to={link.path} key={link.id}>
                <div className={`text-lg md:text-xl cursor-pointer ${isActive(link.path) ? 'text-red font-semibold' : 'hover:text-red'}`}>
                  {t(link.label)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-1 px-3 py-2 text-lg text-black bg-gray-100 rounded-md hover:bg-gray-200 "
            >
              {language} <span className="hover:text-red cursor-pointer"> ▼ </span>
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div
                  onClick={() => handleLanguageChange("FR")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.fr}
                </div>
                <div
                  onClick={() => handleLanguageChange("EN")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.en}
                </div>
              </div>
            )}
          </div>

          <Link to="/signup">
            <button
              className="bg-black text-white rounded-lg px-4 py-2 text-lg md:text-xl hover:bg-gray-700"
            >
              {signupButtonText || t('auth.signup.signupButton')}
            </button>
          </Link>

          <Link to="/login">
            <button
              className="bg-red text-white rounded-lg px-4 py-2 text-lg md:text-xl hover:bg-red-600"
              onClick={onLogin}
            >
              {loginButtonText || t('auth.login.loginButton')}
            </button>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-1 px-3 py-2 text-lg text-black bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {language} ▼
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div
                  onClick={() => handleLanguageChange("FR")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.fr}
                </div>
                <div
                  onClick={() => handleLanguageChange("EN")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.en}
                </div>
              </div>
            )}
          </div>

          <button className="text-3xl" onClick={toggleMobileMenu}>
            &#9776;
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#eeeeee3d] w-full py-4 px-6 transition-all duration-300 ease-in-out">
          <div className="flex flex-col gap-4 text-center font-bold">
            {content.beforeLogin.links.map((link) => (
              <React.Fragment key={link.id}>
                <Link to={link.path}>
                  <div className={`text-lg md:text-xl cursor-pointer ${isActive(link.path) ? 'text-red font-semibold' : 'hover:text-red'}`}>
                    {t(link.label)}
                  </div>
                </Link>
                <hr />
              </React.Fragment>
            ))}
            <div className="flex xxs:flex-col xs:flex-row gap-2 w-full">
              <Link to="/signup" className="w-full">
                <button
                  className="bg-black text-white w-full rounded-lg px-4 py-2 text-lg hover:bg-gray-700"
                >
                  {signupButtonText || t('auth.signup.signupButton')}
                </button>
              </Link>
              <hr />
              <Link to="/login" className="w-full">
                <button
                  className="bg-red text-white w-full rounded-lg px-4 py-2 text-lg hover:bg-red-600"
                  onClick={onLogin}
                >
                  {loginButtonText || t('auth.login.loginButton')}
                </button>
              </Link>
            </div>
            <hr />
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarBeforeLogin;
