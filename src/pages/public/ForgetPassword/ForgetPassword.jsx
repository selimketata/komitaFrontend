import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { forgetPassword } from "../../../Services/authService";

function ForgetPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await forgetPassword(email);
      setMessage(t("auth.forgetPassword.successMessage"));
    } catch (error) {
      setError(t("auth.forgetPassword.errorMessage"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dynamic-background">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {t("auth.forgetPassword.title")}
        </h2>
        <p className="mt-2 text-center text-gray-600">
          {t("auth.forgetPassword.subtitle")}
        </p>
        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("auth.forgetPassword.emailLabel")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-red rounded-lg hover:bg-red-600 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.forgetPassword.sendingButton") : t("auth.forgetPassword.sendButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
