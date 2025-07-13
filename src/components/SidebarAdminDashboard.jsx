import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import komitaLight from "/komitalight.svg";
import profileIcon from "/profileicon.svg";
import profileIconActive from "/profileiconactive.svg";
import logoutIcon from "/logouticon.svg";
import homeIcon from "/homeicon.svg";
import overviewIcon from "/overviewicon.svg";
import overviewIconActive from "/overviewiconactive.svg";
import servicesIcon from "/servicesicon.svg";
import servicesIconActive from "/servicesiconactive.svg";
import BurgerIconWhite from "/BurgerIconWhite.svg";
import BurgerIcon from "/BurgerIcon.svg";
import { AuthContext } from "./../Context/AuthContext";  // Import AuthContext

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

function SidebarAdminDashboard({ currPage }) {
  const { token, user, fetchUser, logout } = useContext(AuthContext);
  const [activePage, setActivePage] = useState(currPage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active page when route changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setActivePage('Overview');
    } else if (path.includes('services')) {
      setActivePage('Services');
    } else if (path.includes('users')) {
      setActivePage('Users');
    } else if (path.includes('categories')) {
      setActivePage('Catégories');
    } else if (path === '/') {
      setActivePage('Home');
    }
  }, [location.pathname]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          await fetchUser();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, fetchUser]);

  if (isLoading) {
    return <div>Loading...</div>;  // Show a loading indicator while fetching the user data
  }

  // Only render the sidebar for "ADMIN" role
  if (user?.role !== "ADMIN") {
    return null;  // Return null to not render the sidebar if user is not an admin
  }

  const Admin = {
    firstName: "Administrateur",
    photo: profileIcon,
  };

  const navItems = [
    {
      image: overviewIcon,
      imageActive: overviewIconActive,
      text: "Overview",
      handleClickFunction: () => {
        navigate("/admin");
      },
    },
    {
      image: servicesIcon,
      imageActive: servicesIconActive,
      text: "Services",
      handleClickFunction: () => {
        navigate("/admin/services-management");
      },
    },
    {
      image: profileIcon,
      imageActive: profileIconActive,
      text: "Users",
      handleClickFunction: () => {
        navigate("/admin/users-management");
      },
    },
    {
      image: BurgerIconWhite,
      imageActive: BurgerIcon,
      text: "Catégories",
      handleClickFunction: () => {
        navigate("/admin/categories-management");
      },
    },
    {
      image: homeIcon,
      text: "Home",
      handleClickFunction: () => {
        navigate("/");
      },
    },
    {
      image: logoutIcon,
      text: "Logout",
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
      `}>
        <img
          className="size-12 lg:size-16 mt-16 lg:mt-6"
          src={komitaLight}
          alt="Logokomita"
        />
        <div className="w-full flex flex-col items-center gap-2">
          <img
            src={Admin.photo}
            className="size-20 lg:size-20 "
            alt="Profile"
          />
          <h1 className="text-center font-semibold w-[100%] font-inter text-sm lg:text-base">
            {`${Admin.firstName}`}
          </h1>
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

export default SidebarAdminDashboard;