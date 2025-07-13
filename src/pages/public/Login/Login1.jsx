import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../../Services/authService";
import { AuthContext } from "./../../../Context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { handleGoogleSuccess } from "./../../../Services/authService";
import { handleGoogleFailure } from "../../../Services/errorHandler";
import { useTranslation } from "react-i18next";

function Login1() {
  const { t } = useTranslation();
  const { login, user } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(30);
  const [remainingTime, setRemainingTime] = useState(30);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Add a useEffect to handle the countdown timer
  useEffect(() => {
    let timer;
    if (isBlocked && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsBlocked(false);
            setShowErrorMessage(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBlocked, remainingTime]);

  // Update remainingTime when blockTime changes
  useEffect(() => {
    if (isBlocked) {
      setRemainingTime(blockTime);
    }
  }, [blockTime, isBlocked]);



  useEffect(() => {
    if (user) {
      RedirectPage();
    }
  }, [user]);

  // Updated function to handle redirection after login
  const RedirectPage = () => {
    // First check if we have a state from the location (React Router's way)
    const fromPath = location?.state?.from;
    
    // Then check localStorage with the new key that works for both login and signup
    const storedPath = localStorage.getItem('redirectAfterAuth');
    
    // Determine which path to use, prioritizing the location state
    const redirectPath = fromPath || storedPath;
    
    if (redirectPath) {
      // Clear the stored path
      localStorage.removeItem('redirectAfterAuth');
      
      // Navigate to the service page
      navigate(redirectPath);
    } else {
      // Default redirects based on user role
      if (user.role === "PROFESSIONAL") {
        navigate("/professional/services-management");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STANDARD_USER") {
        navigate("/");
      }
    }
    
    // Scroll to top after navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  // Helper function to parse API error response
  const parseErrorResponse = (err) => {
    if (err.response && err.response.data) {
      const { message, details, error } = err.response.data;
      
      // Store error details for field-specific error display
      if (details) {
        setErrorDetails(details);
        
        // Handle specific error types
        if (details.email) {
          return details.email;
        } else if (details.authentication) {
          // Map backend error messages to translated messages
          if (details.authentication === "User not found") {
            return t("auth.login.errorMessages.userNotFound");
          } else if (details.authentication === "Invalid credentials") {
            return t("auth.login.errorMessages.invalidCredentials");
          } else {
            return details.authentication;
          }
        } else if (details.password) {
          return details.password;
        } else if (details.credentials) {
          return details.credentials;
        } else if (details.account) {
          return details.account;
        }
      }
      
      // If error is "Validation Failed", show a more specific message
      if (error === "Validation Failed") {
        return t("auth.login.errorMessages.validationFailed");
      }
      
      return message || t("auth.login.errorMessages.serverError");
    }
    
    return t("auth.login.errorMessages.serverError");
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await handleGoogleSuccess(credentialResponse);
      if (response?.token) {
        localStorage.setItem("token", response.token);
        login(response.token);
        // After successful login, redirect will happen via the useEffect
      }
    } catch (err) {
      setError(parseErrorResponse(err));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBlocked) {
      setError(t("auth.login.errorMessages.blocked", { time: remainingTime }));
      setShowErrorMessage(true);
      return;
    }
  
    setError("");
    setErrorDetails({});
    setIsLoading(true);
  
    try {
      const response = await loginUser(email, password, attempts, setAttempts, setIsBlocked, setBlockTime, setShowErrorMessage);      
      if (response?.token) {
       
        localStorage.setItem("token", response.token);
        login(response.token);
        // After successful login, redirect will happen via the useEffect
      }
    } catch (err) {
      setError(parseErrorResponse(err));
      // If the user gets blocked after this attempt, set the remainingTime
      if (!isBlocked && attempts >= 4) {  // 5th attempt (index 4) will trigger block
        setRemainingTime(30); // Reset the timer for the new blocking period
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to render field-specific error messages
  const renderFieldError = (fieldName) => {
    if (errorDetails && errorDetails[fieldName]) {
      return (
        <div className="text-red-600 text-xs mt-1 flex items-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
          <span>{errorDetails[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 sm:px-8 dynamic-background xxs:my-4 lg:my-0">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-white border rounded-lg shadow-lg w-full max-w-lg">
          <div className="w-full p-6 sm:p-10 text-center">
            <img src="/komita.png" alt="logo" className="w-18 mb-8 mx-auto" />

            <h2 className="text-3xl text-center font-bold text-red-600">
              {t("auth.login.title")}
            </h2>
            <hr className="border-2 border-red my-2 w-[90%] ml-[5%]" />
            <p className="font-alexBrush text-[1.65rem] text-black mb-8">
              {t("auth.login.subtitle")}
            </p>
            
            {/* General error message display */}
            {(error || showErrorMessage) && (
              <div className={` border-l-4  border-red bg-[#ff00001b] ${isBlocked ? 'bg-[#ff00001a]' : ''} border ${isBlocked ? 'border-gray' : ''} ${isBlocked ? 'text-black' : 'text-red'} px-4 py-3 rounded mb-4 flex items-start`}>
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 mt-1" />
                <p>
                  {isBlocked 
                    ? t("auth.login.errorMessages.blocked", { time: remainingTime })
                    : error
                  }
                </p>
              </div>
            )}
            
            <div className="text-center flex items-center justify-center">
              <GoogleLogin 
                onSuccess={handleGoogleLoginSuccess} 
                onError={handleGoogleFailure} 
                shape="pill" 
                size="large"
                text="signin_with" 
                disabled={isBlocked || isLoading}
              />
            </div>
            <div className="my-4 text-gray-500">or</div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input 
                  type="text" 
                  placeholder={t("auth.login.emailPlaceholder")} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={`w-full px-4 py-2 border rounded-md ${errorDetails.email ? 'border-red-500' : ''}`}
                  disabled={isBlocked || isLoading}
                />
                {/* {renderFieldError('email')} */}
              </div>
              
              <div>
                <div className="relative">
                  <input 
                    type={passwordShown ? "text" : "password"} 
                    placeholder={t("auth.login.passwordPlaceholder")} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={`w-full px-4 py-2 border rounded-md ${errorDetails.password ? 'border-red-500' : ''}`}
                    disabled={isBlocked || isLoading}
                  />
                  <span onClick={togglePassword} className={`absolute right-3 top-2.5 cursor-pointer ${(isBlocked || isLoading) ? 'opacity-50' : ''}`}>
                    <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                  </span>
                </div>
                {/* {renderFieldError('password')} */}
              </div>
              
              <div className="mt-4 flex justify-end text-sm text-black">
                <Link to="/forgot-password" className="text-[#142237b9] hover:text-[#142237] transition-all font-semibold">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isBlocked || isLoading} 
                className={`w-full bg-[#142237] text-white px-6 py-2 rounded-lg shadow-md font-bold ${isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0d1626]'} flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    {t("auth.login.connecting")}
                  </>
                ) : (
                  t("auth.login.loginButton")
                )}
              </button>
            </form>

            <div className="mt-4 flex justify-center text-sm text-black">
              <Link 
                to="/signup" 
                className="text-[#142237b9] hover:text-[#142237] transition-all font-semibold" 
                onClick={handleClick}
              >
                {t("auth.login.noAccount")} {t("auth.login.signupLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login1;