import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser, signUpWithGoogle } from '../../../Services/authService';
import { FaUser, FaBriefcase } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { handleGoogleFailure } from '../../../Services/errorHandler';

const SignUpPage1 = () => {
  const { t } = useTranslation();
  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STANDARD_USER',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState({});
  const [formComplete, setFormComplete] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  // Check if all required fields are filled
  useEffect(() => {
    const { firstname, lastname, email, password, confirmPassword } = userDetails;
    const isComplete = 
      firstname.trim() !== '' && 
      lastname.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== ''      
    
    setFormComplete(isComplete);
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errorDetails[name]) {
      setErrorDetails(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (role) => {
    setUserDetails((prev) => ({ ...prev, role }));
  };

  // Helper function to parse API error response
  const parseErrorResponse = (err) => {
    if (err.response && err.response.data) {
      const { message, details } = err.response.data;
      
      // Store error details for field-specific error display
      if (details) {
        setErrorDetails(details);
        
        // Return the first error message for general display
        const firstErrorField = Object.keys(details)[0];
        if (firstErrorField) {
          return details[firstErrorField];
        }
      }
      
      return message || t("auth.signup.errorMessages.serverError");
    }
    
    return t("auth.signup.errorMessages.serverError");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setErrorDetails({});
    
    // Validate email format
    if (!emailRegex.test(userDetails.email)) {
      setError(t("auth.signup.errorMessages.invalidEmail", "Please enter a valid email address"));
      setErrorDetails(prev => ({
        ...prev,
        email: t("auth.signup.errorMessages.invalidEmail", "Please enter a valid email address")
      }));
      return;
    }
    
    // Validate password format
    if (!passwordRegex.test(userDetails.password)) {
      setError(t("auth.signup.errorMessages.invalidPassword", "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"));
      setErrorDetails(prev => ({
        ...prev,
        password: t("auth.signup.errorMessages.invalidPassword", "Password must contain at least 8 characters, including uppercase, lowercase, number and special character")
      }));
      return;
    }
    
    // Validate password confirmation
    if (userDetails.password !== userDetails.confirmPassword) {
      setError(t("auth.signup.errorMessages.passwordMismatch", "Passwords do not match"));
      setErrorDetails(prev => ({
        ...prev,
        confirmPassword: t("auth.signup.errorMessages.passwordMismatch", "Passwords do not match")
      }));
      return;
    }
    
    setIsLoading(true);

    try {
      const userResponse = await registerUser({
        ...userDetails,
      });

      // After successful registration
      localStorage.setItem("token", userResponse.token);
      
      // Check for redirect path
      const fromPath = location?.state?.from;
      const storedPath = localStorage.getItem('redirectAfterAuth');
      const redirectPath = fromPath || storedPath;
      
      if (redirectPath) {
        localStorage.removeItem('redirectAfterAuth');
        navigate(redirectPath);
      } else {
        navigate('/login');
      }
      
      // Scroll to top after navigation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (err) {
      setError(parseErrorResponse(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleToken) => {
    try {
      setIsLoading(true);
      const userData = await signUpWithGoogle(googleToken);

      // Update form with data from Google
      setUserDetails({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: '',
        confirmPassword: '',
        role: 'STANDARD_USER',
      });
    } catch (err) {
      setError(parseErrorResponse(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Function to render field-specific error messages
  const renderFieldError = (fieldName) => {
    if (errorDetails && errorDetails[fieldName]) {
      return (
        <div className="text-red max-w-full text-xs mt-1 flex items-center">
          <span>{errorDetails[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="px-4 sm:px-8 min-h-screen flex flex-col items-center justify-center xxs:my-4 lg:my-0"
      style={{
        backgroundImage: 'url(/KomitaBg.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-white xs:p-8 border rounded-lg shadow-lg w-full max-w-lg xxs:p-4">
        <img
          src="/komita.png"
          alt="logo"
          className="w-16 h-auto mb-6 mx-auto"
        />
        <h2 className="text-2xl text-center font-bold text-red-600">
          {t("auth.signup.title")}
        </h2>
        <hr className="border-2 border-red my-2 w-[90%] mx-auto" />
        <p className="font-alexBrush text-[1.65rem] text-black text-center mb-6">
          {t("auth.signup.subtitle")}
        </p>

        {/* General error message display */}
        {error && (
          <div className="border-l-4 border-red bg-[#ff00001b] text-red px-4 py-3 rounded mb-4 flex items-start">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 mt-1" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="text-center mb-6 flex items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="signup_with"
            shape="pill"
            size="large"
            disabled={isLoading}
          />
        </div>

        <div className="my-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-3 text-center">
            {t("auth.signup.roleSelection")}
          </h3>
          <div className="xxs:flex-col xs:flex-row flex justify-center gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 text-base rounded-full transition-all duration-300 ${userDetails.role === 'STANDARD_USER'
                  ? 'bg-[#142237] text-white shadow-lg'
                  : 'hover:bg-[#eeee] text-gray-700 hover:text-[#142237]'
                }`}
              onClick={() => handleRoleChange('STANDARD_USER')}
              disabled={isLoading}
            >
              <FaUser /> {t("auth.signup.roles.user")}
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-base rounded-full transition-all duration-300 ${userDetails.role === 'PROFESSIONAL'
                  ? 'bg-[#142237] text-white shadow-lg'
                  : 'hover:bg-[#eeee] text-gray-700 hover:text-[#142237]'
                }`}
              onClick={() => handleRoleChange('PROFESSIONAL')}
              disabled={isLoading}
            >
              <FaBriefcase /> {t("auth.signup.roles.professional")}
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="xs:grid xs:grid-cols-2 xxs:flex-col xxs:flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t("auth.signup.fields.firstname.label")} *
              </label>
              <input
                type="text"
                name="firstname"
                value={userDetails.firstname}
                onChange={handleInputChange}
                placeholder={t("auth.signup.fields.firstname.placeholder")}
                className={`w-full border rounded-lg px-4 py-[0.4rem] focus:ring-2 focus:ring-red-600 focus:outline-none ${errorDetails.firstname ? 'border-red-500' : ''}`}
                required
                disabled={isLoading}
              />
              {renderFieldError('firstname')}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t("auth.signup.fields.lastname.label")} *
              </label>
              <input
                type="text"
                name="lastname"
                value={userDetails.lastname}
                onChange={handleInputChange}
                placeholder={t("auth.signup.fields.lastname.placeholder")}
                className={`w-full border rounded-lg px-4 py-[0.4rem] focus:ring-2 focus:ring-red-600 focus:outline-none ${errorDetails.lastname ? 'border-red-500' : ''}`}
                required
                disabled={isLoading}
              />
              {renderFieldError('lastname')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              {t("auth.signup.fields.email.label")} *
            </label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              placeholder={t("auth.signup.fields.email.placeholder")}
              className={`w-full border rounded-lg px-4 py-[0.4rem] focus:ring-2 focus:ring-red-600 focus:outline-none ${errorDetails.email ? 'border-red-500' : ''}`}
              required
              disabled={isLoading}
            />
            {renderFieldError('email')}
          </div>
          <div className="xs:grid xs:grid-cols-2 xxs:flex-col xxs:flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t("auth.signup.fields.password.label")} *
              </label>
              <input
                type="password"
                name="password"
                value={userDetails.password}
                onChange={handleInputChange}
                placeholder={t("auth.signup.fields.password.placeholder")}
                className={`w-full border rounded-lg px-4 py-[0.4rem] focus:ring-2 focus:ring-red-600 focus:outline-none ${errorDetails.password ? 'border-red-500' : ''}`}
                required
                disabled={isLoading}
              />
              {renderFieldError('password')}
             
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                {t("auth.signup.fields.confirmPassword.label")} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleInputChange}
                placeholder={t("auth.signup.fields.confirmPassword.placeholder")}
                className={`w-full border rounded-lg px-4 py-[0.4rem] focus:ring-2 focus:ring-red-600 focus:outline-none ${errorDetails.confirmPassword ? 'border-red-500' : ''}`}
                required
                disabled={isLoading}
              />
              {renderFieldError('confirmPassword')}
            </div>
          </div>
          <div className="flex xxs:flex-col-reverse xs:flex-row justify-between items-center gap-5">
            <Link
              to="/login"
              className="text-[#142237b9] w-full mt-4 hover:text-[#142237] transition-all font-semibold xxs:text-center xs:text-start"
              onClick={handleClick}
            >
              {t("auth.signup.alreadyRegistered")}
            </Link>
            <button
              type="submit"
              disabled={!formComplete || isLoading}
              className={`bg-[#142237] text-white mt-4 w-full py-2 rounded-lg shadow-md font-bold ${!formComplete || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0d1626]'} flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  {t("auth.signup.processing")}
                </>
              ) : (
                t("auth.signup.signupButton")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage1;


