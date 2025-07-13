import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import profileImg from "/utilisateur.png";
import { jwtDecode } from "jwt-decode";
import { getUserDetails } from "./../Services/userService";
import { getProfileImage } from "./../Services/userService"; // Assuming you have this function

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const navigate = useNavigate();
  const location = useLocation();


  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
    if (key === "token") {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      fetchUserDetails(newToken);
    }
  };

  const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
    if (key === "token") {
      setToken(null);
      setUser(null);
      setProfileImage(null); // Clear profile image on logout
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    }
  }, [token]);

  const fetchUserDetails = async (token) => {
    try {
      const decodedUser = jwtDecode(token);
      const userDetails = await getUserDetails(); // Call your API function
      setUser(userDetails); // Immediately set user details
      
    } catch (error) {
      console.error("Error fetching user details:", error);
      logout(); // Clear the token and user data if fetching fails
    }
  };

  // Fetch profile image when user data is available and valid
  useEffect(() => {
    if (user && user.firstname && user.lastname && user.id) {
      const fetchProfileImage = async () => {
        try {
          // Check if user has a profile image and if it's a Google image
          if (user.profileImage && user.profileImage.includes("google")) {
            setProfileImage(user.profileImage); // Set Google profile image directly
          } else if (user.profileImage) {
            try {
              const image = await getProfileImage(user.id);
              if (image) {
                setProfileImage(image);
              } else {
                setProfileImage(profileImg); // Fallback to default if no image returned
              }
            } catch (error) {
              console.error("Error fetching profile image:", error);
              setProfileImage(profileImg);
            }
          } else {
            setProfileImage(profileImg); // Set default image if no profile image exists
          }
        } catch (error) {
          console.error("Error in profile image handling:", error);
          setProfileImage(profileImg);
        }
      };

      fetchProfileImage();
    } else {
      setProfileImage(profileImg); // Set default image if user data is incomplete
    }
  }, [user, token]);

  const login = (newToken) => {
    try {
      setLocalStorage("token", newToken); // Immediately set token and fetch user details
    } catch (error) {
      console.error("Invalid token during login", error);
    }
  };

  const logout = () => {
    removeLocalStorage("token"); // Immediately clear token and user data
  };

  return (
    <AuthContext.Provider value={{ token, user, profileImage, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
