import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import komitaLight from "/komitalight.svg";
import profileIcon from "/profileicon.svg";
import profileIconActive from "/profileiconactive.svg";
import logoutIcon from "/logouticon.svg";
import homeIcon from "/homeicon.svg";
import overviewIcon from "/overviewicon.svg";
import overviewIconActive from "/overviewiconactive.svg";
import servicesIcon from "/servicesicon.svg";
import servicesIconActive from "/servicesiconactive.svg";
import defaultProfilePhoto from "/ProfilePhoto.svg";
import { AuthContext } from "./../Context/AuthContext";  
import { getProfileImage } from "../Services/profileService";
import { useTranslation } from 'react-i18next';

const SidebarIcon = ({
  image,
  imageActive,
  text,
  isActive,
  onClick,
  badge,
}) => {
  return (
    <button
      className={`relative flex items-center gap-2 lg:gap-4 justify-normal rounded-full w-full py-2 pl-2 pr-3 lg:pr-6 duration-300 transition-colors ${
        isActive
          ? "text-[#142237] bg-white font-semibold"
          : "text-white hover:bg-white hover:bg-opacity-10"
      }`}
      onClick={onClick}
    >
      <img
        className="size-6 lg:size-7 relative z-10"
        src={isActive ? imageActive : image}
        alt={text}
      />
      <p className="relative z-10 text-sm lg:text-base">{text}</p>
      {badge && (
        <span className="ml-auto bg-red text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
};

function SidebarProDashboard({ currPage }) {
  const { token, user, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState(currPage);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  // Use translation
  const { t } = useTranslation();
  
  // Function to fetch profile image
  const fetchProfileImage = async (userId) => {
    try {
      const imageData = await getProfileImage(userId);
      const imageUrl = URL.createObjectURL(imageData);
      setProfileImage(imageUrl);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No profile image found for user");
        setProfileImage(null);
      } else {
        console.error("Error fetching profile image:", error);
      }
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    if (user && user.firstname && user.lastname) {
      setUserData(user);
      
      // If user has an ID, fetch their profile image
      if (user.id) {
        fetchProfileImage(user.id);
      }
      
      setIsLoading(false);
    } else {
      setUserData(null);
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>{t('professionalDashboard.sidebar.loading')}</div>;
  }

  // Check if user role is PROFESSIONAL before rendering the sidebar
  if (user?.role !== "PROFESSIONAL") {
    return null;
  }
    
  const Professional = {
    id: userData ? userData.id : 0,
    firstName: userData ? userData.firstname : "",
    lastName: userData ? userData.lastname : "",
    email: userData ? userData.email : "",
    photo: profileImage || defaultProfilePhoto,
  };

  const navItems = [
    {
      image: servicesIcon,
      imageActive: servicesIconActive,
      text: t('professionalDashboard.sidebar.services'),
      // badge: 1,
      handleClickFunction: () => {
        navigate("/professional/services-management");
      },
    },
    {
      image: profileIcon,
      imageActive: profileIconActive,
      text: t('professionalDashboard.sidebar.profile'),
      handleClickFunction: () => {
        navigate("/professional/Profile-management");
      },
    },
    {
      image: homeIcon,
      text: t('professionalDashboard.sidebar.home'),
      handleClickFunction: () => {
        navigate("/");
      },
    },
    {
      image: logoutIcon,
      text: t('professionalDashboard.sidebar.logout'),
      handleClickFunction: () => {
        logout()
        navigate("/");
      },
    },
  ];

  const handleNavClick = (pageName, handleClick) => {
    setIsMobileMenuOpen(false);
    setActivePage(pageName);
    handleClick();
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden absolute top-4 mb-10 right-4 z-50 bg-[#142237] size-10 text-white p-2 rounded-full"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      <div
        className={`
        bg-[#142237] 
        fixed lg:sticky 
        top-0 lg:top-5 
        left-0 lg:left-[14px] 
        h-full lg:h-[94vh] 
        w-64 lg:w-[15vw] 
        lg:my-5
        rounded-r-[20px] lg:rounded-[20px] 
        flex flex-col 
        gap-6 lg:gap-12 
        items-center 
        text-white 
        overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        z-40 lg:z-auto
      `}
      >
        <img
          className="size-12 lg:size-16 mt-16 lg:mt-6"
          src={komitaLight}
          alt="Logokomita"
        />
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-[#142237] shadow-md">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <img src={defaultProfilePhoto} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <h1 className="text-center font-semibold w-[100%] font-inter text-sm lg:text-base">
            {`${Professional.firstName} ${Professional.lastName}`}
          </h1>
          <h6 className="font-thin font-inter text-center text-xs lg:text-sm">
            {Professional.email}
          </h6>
        </div>
        <nav className="w-full px-4 flex-grow">
          <ul className="space-y-2">
            {navItems.slice(0, -2).map((item, index) => (
              <li key={index}>
                <SidebarIcon
                  {...item}
                  isActive={activePage === item.text}
                  onClick={() =>
                    handleNavClick(item.text, item.handleClickFunction)
                  }
                />
              </li>
            ))}
          </ul>
        </nav>
        <nav className="w-full px-4 mt-auto mb-6">
          <ul className="space-y-2">
            {navItems.slice(-2).map((item, index) => (
              <li key={index}>
                <SidebarIcon
                  {...item}
                  isActive={activePage === item.text}
                  onClick={() =>
                    handleNavClick(item.text, item.handleClickFunction)
                  }
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default SidebarProDashboard;

const SidebarIconExperimental = ({
  image,
  imageActive,
  text,
  isActive,
  onClick,
  badge,
}) => {
  return (
    <button
      className={`relative flex items-center gap-4 justify-normal w-full py-2 pl-2 pr-6 transition-colors ${
        isActive
          ? "text-[#142237] font-semibold"
          : "text-white hover:bg-white hover:bg-opacity-10"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div>
          <div className="absolute inset-y-0 left-0 w-[calc(100%)] bg-white rounded-s-full -z-10"></div>
          <div className="absolute -inset-y-6 left-[90%] size-24 bg-white roun -z-10"></div>
          <div className="absolute -inset-y-20 left-[70%] size-20 bg-[#142237] rounded-full -z-10"></div>
          <div className="absolute inset-y-11 left-[69%] size-20 bg-[#142237] rounded-full -z-10"></div>
        </div>
      )}
      <img
        className="size-7 relative z-10"
        src={isActive ? imageActive : image}
        alt={text}
      />
      <p className="relative z-10">{text}</p>
      {badge && (
        <span className="ml-auto bg-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
};
