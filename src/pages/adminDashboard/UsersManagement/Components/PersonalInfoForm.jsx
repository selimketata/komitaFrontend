import React from "react";

const formStyles = {
    input: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237] outline-none transition-all duration-200 bg-white shadow-sm",
    label: "block text-sm font-medium text-gray-700 mb-2",
    select: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-[#142237] outline-none transition-all duration-200 bg-white shadow-sm",
    formSection: "bg-white p-6 rounded-lg",
    sectionTitle: "text-xl font-semibold text-[#142237] mb-6",
    formGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    fullWidth: "md:col-span-2",
  };

const PersonalInfoForm = ({ userData, onChange, showPassword = false }) => {
    return (
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Personal Information</h3>
        <div className={formStyles.formGrid}>
          <div>
            <label className={formStyles.label}>
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={userData.firstname}
              onChange={onChange}
              placeholder="Enter first name"
              className={formStyles.input}
            />
          </div>
          <div>
            <label className={formStyles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={userData.lastname}
              onChange={onChange}
              placeholder="Enter last name"
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.fullWidth}>
            <label className={formStyles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={onChange}
              placeholder="Enter email address"
              className={formStyles.input}
            />
          </div>
          <div className={formStyles.fullWidth}>
            <label className={formStyles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={onChange}
              placeholder="Enter phone number"
              className={formStyles.input}
            />
          </div>
          {showPassword && (
            <div className={formStyles.fullWidth}>
              <label className={formStyles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={onChange}
                placeholder="Enter password"
                className={formStyles.input}
                autoComplete="new-password"
              />
            </div>
          )}
          <div className={formStyles.fullWidth}>
            <label className={formStyles.label}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={onChange}
              className={formStyles.select}
            >
              <option value="STANDARD_USER">Standard</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

export default PersonalInfoForm;