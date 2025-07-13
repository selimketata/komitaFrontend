import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "/utilisateur.png";
import { AuthContext } from "./../Context/AuthContext";
import { getProfileImage } from "./../Services/profileService";
import { updateUserRole } from "./../Services/userService";
import { toast } from "react-toastify";

function NavbarAfterLogin({ onLogout, language, switchLanguage, currentPath, content }) {
  const { t } = useTranslation();
  const { token, user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileImg);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const languageMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  // Function to fetch profile image
  const fetchProfileImage = async (userId) => {
    try {
      const imageData = await getProfileImage(userId);
      const imageUrl = URL.createObjectURL(imageData);
      setProfilePhoto(imageUrl);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle case when user has no profile image
        console.log("No profile image found for user");
        setProfilePhoto(profileImg);
      } else {
        console.error("Error fetching profile image:", error);
      }
    }
  };

  // Fetch profile image when user data is available
  useEffect(() => {
    if (user && user.id) {
      fetchProfileImage(user.id);
    }
  }, [user]);

  // Function to handle role upgrade
  const handleUpgradeRole = async () => {
    if (!user || !user.id) return;
    
    try {
      setIsUpgrading(true);
      const updatedUser = await updateUserRole(user.id);
      
      // Update the user context with the new role
      if (updatedUser) {
        // Check if setUser is a function before calling it
        if (typeof setUser === 'function') {
          setUser({...user, role: "PROFESSIONAL"});
        } else {
          // Alternative approach: update localStorage and reload
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({...currentUser, role: "PROFESSIONAL"}));
          
          // Show success message
          toast.success(t("navbar.afterLogin.profileMenu.upgradeSuccess"));
          
          // Reload the page to reflect changes
          window.location.href = "/professional/services-management";
          return;
        }
        
        toast.success(t("navbar.afterLogin.profileMenu.upgradeSuccess"));
        
        // Close the profile menu
        setIsProfileMenuOpen(false);
        
        // Redirect to professional dashboard
        navigate("/professional/services-management");
      }
    } catch (error) {
      console.error("Error upgrading user role:", error);
      toast.error(t("navbar.afterLogin.profileMenu.upgradeError"));
    } finally {
      setIsUpgrading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-full h-70">
      <div className="flex items-center justify-between border-slate-300 shadow-md shadow-gray-200 py-2 px-5 lg:px-20">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <img src="/komita.png" alt={t('navbar.common.logo.alt')} className="w-12 md:w-20" />
            <div className="w-full h-[2px] mt-1 bg-red"></div>
            <div className="py-0">
              <span className="text-red text-center text-lg md:text-xl font-calibri">K</span>
              <span className="md:text-xl text-lg font-calibri">omita</span>
            </div>
          </div>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center justify-end gap-10 flex-1 md:mr-10">
          <div className="flex gap-8">
            {content.afterLogin.links.map((link) => (
              <Link to={link.path} key={link.id}>
                <div className={`text-lg md:text-xl cursor-pointer ${isActive(link.path) ? 'text-red font-semibold' : 'hover:text-red'}`}>
                  {t(link.label)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Language, Upgrade Button and Profile */}
        <div className="hidden md:flex items-center gap-4">
          {/* Switch Language */}
          <div className="relative" ref={languageMenuRef}>
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-1 px-3 py-2 text-lg text-black bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {language} <span className="hover:text-red cursor-pointer"> ▼ </span>
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div
                  onClick={() => switchLanguage("FR")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.fr}
                </div>
                <div
                  onClick={() => switchLanguage("EN")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.en}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-lg text-black rounded-md hover:bg-gray-200"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shadow-md">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <img src={profileImg} alt="user" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {user ? `${user.firstname} ${user.lastname}` : ""} <span className="hover:text-red cursor-pointer">▼</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-48">
                {/* <div className="px-4 py-2 font-semibold border-b">{t('navbar.afterLogin.profileMenu.title')}</div> */}
                
                {content.afterLogin.profileMenu.items.map((item) => {
                  // Skip items that require specific roles if user doesn't have them
                  if (item.roleRequired && (!user || user.role !== item.roleRequired)) {
                    return null;
                  }
                  
                  // For logout action
                  if (item.action === "logout") {
                    return (
                      <div
                        key={item.id}
                        onClick={onLogout}
                        className="px-4 py-2 hover:bg-[#0000000d] cursor-pointer text-red  mt-1"
                      >
                        {t(item.label)}
                      </div>
                    );
                  }
                  
                  // For regular navigation links
                  return (
                    <Link to={item.path} key={item.id}>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer hover:bg-[#0000000d]">
                        {t(item.label)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Upgrade Button - Always visible for standard users */}
          {user && user.role === "STANDARD_USER" && (
            <button 
              onClick={handleUpgradeRole}
              disabled={isUpgrading}
              className="flex items-center gap-1 px-4 py-2 text-white bg-black rounded-md hover:bg-[#000000d3] transition-colors"
            >
              {isUpgrading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("navbar.afterLogin.profileMenu.upgrading")}
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  {t("navbar.afterLogin.profileMenu.upgradeButton")}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="flex md:hidden items-center gap-3" ref={mobileMenuRef}>
          {/* Upgrade Button for Mobile - Always visible for standard users */}
          {user && user.role === "STANDARD_USER" && (
            <button 
              onClick={handleUpgradeRole}
              disabled={isUpgrading}
              className="flex items-center px-3 py-1.5 text-white bg-[#000] rounded-md hover:bg-[#000000e2] transition-colors text-sm"
            >
              {isUpgrading ? t("navbar.afterLogin.profileMenu.upgrading") : t("navbar.afterLogin.profileMenu.upgradeButton")}
            </button>
          )}
          
          {/* Switch Language for Small Screens */}
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
                  onClick={() => switchLanguage("FR")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {content.common.languageSelector.options.fr}
                </div>
                <div
                  onClick={() => switchLanguage("EN")}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#eeeeee3d] w-full py-4 px-6 transition-all duration-300 ease-in-out">
          <div className="flex flex-col gap-4 text-center font-bold">
            {content.afterLogin.links.map((link) => (
              <React.Fragment key={link.id}>
                <Link to={link.path}>
                  <div className={`text-lg md:text-xl cursor-pointer ${isActive(link.path) ? 'text-red font-semibold' : 'hover:text-red'}`}>
                    {t(link.label)}
                  </div>
                </Link>
                <hr />
              </React.Fragment>
            ))}
            
            {/* Profile section in mobile menu */}
            <div className="flex flex-col gap-2 ">
              {/* <div className="font-semibold">{t('navbar.afterLogin.profileMenu.title')}</div> */}
              {content.afterLogin.profileMenu.items.map((item) => {
                // Skip items that require specific roles if user doesn't have them
                if (item.roleRequired && (!user || user.role !== item.roleRequired)) {
                  return null;
                }
                
                // For logout action
                if (item.action === "logout") {
                  return (
                    <div
                      key={item.id}
                      onClick={onLogout}
                      className="py-2 hover:bg-[#0000000d] cursor-pointer text-red  mt-1"
                    >
                      {t(item.label)}
                    </div>
                  );
                }
                
                // For regular navigation links
                return (
                  <Link to={item.path} key={item.id}>
                    <div className="py-2 hover:bg-gray-100 cursor-pointer hover:bg-[#0000000d]">
                      {t(item.label)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarAfterLogin;
