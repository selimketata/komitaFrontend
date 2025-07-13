import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../Services/authService";

function ResetPassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(20); // Countdown timer in seconds
  const [passwordStrength, setPasswordStrength] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from the query string
  const navigate = useNavigate(); // Initialize the navigation function

  // Password validation regex patterns
  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (strongPasswordRegex.test(password)) {
      setPasswordStrength(t("auth.resetPassword.passwordStrength.strong"));
    } else if (password.length > 0) {
      setPasswordStrength(t("auth.resetPassword.passwordStrength.requirements"));
    } else {
      setPasswordStrength("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError(t("auth.resetPassword.errorMessages.invalidToken"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.resetPassword.errorMessages.passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await resetPassword(token, password); // Call API with token and new password
      setMessage(t("auth.resetPassword.successMessage"));
    } catch (err) {
      setError(t("auth.resetPassword.errorMessages.serverError"));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (message) {
      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Navigate to login page after 20 seconds
      const timer = setTimeout(() => {
        navigate("/login");
      }, 20000);

      // Cleanup timers on unmount or when message changes
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [message, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50" style={{ backgroundImage: `url('/KomitaBg.png')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {t("auth.resetPassword.title")}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {t("auth.resetPassword.subtitle")}
        </p>
        {message && (
          <p className="mt-4 text-center text-green-600">
            {message}{" "}
            {t("auth.resetPassword.redirectMessage")}{" "}
            <strong>{countdown}</strong> {t("auth.resetPassword.seconds")}.
          </p>
        )}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("auth.resetPassword.newPasswordLabel")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value); // Validate password on change
              }}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {passwordStrength && (
              <p className="text-sm mt-2 text-gray-600">{passwordStrength}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              {t("auth.resetPassword.confirmPasswordLabel")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-lg hover:bg-red-600 focus:outline-none ${
                isSubmitting || passwordStrength !== t("auth.resetPassword.passwordStrength.strong")
                  ? "bg-[#898989] cursor-not-allowed"
                  : "bg-red"
              }`}
            disabled={isSubmitting || passwordStrength !== t("auth.resetPassword.passwordStrength.strong")}
          >
            {isSubmitting ? t("auth.resetPassword.resettingButton") : t("auth.resetPassword.resetButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
