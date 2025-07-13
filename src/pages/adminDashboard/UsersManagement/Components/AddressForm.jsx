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
const AddressForm = ({ userAddress, onChange, mode = 'add' }) => {
    return (
      <div className={formStyles.formSection}>
        <h3 className={formStyles.sectionTitle}>Address Information</h3>
        <div className={formStyles.formGrid}>
          {/* Street Address Section */}
          <div className={formStyles.fullWidth}>
            <label className={formStyles.label}>Street Address</label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4">
                <label className={`${formStyles.label} text-xs`}>Number</label>
                    <input
                      type="number"
                      id="userAddress.streetNumber"
                      name="userAddress.streetNumber"
                  value={userAddress.streetNumber || ''}
                  onChange={onChange}
                  placeholder="123"
                  className={formStyles.input}
                    />
                  </div>
              <div className="md:w-2/4">
                <label className={`${formStyles.label} text-xs`}>Street Name</label>
                    <input
                      type="text"
                      id="userAddress.streetName"
                      name="userAddress.streetName"
                  value={userAddress.streetName || ''}
                  onChange={onChange}
                  placeholder="Street Name"
                  className={formStyles.input}
                    />
                  </div>
              <div className="md:w-1/4">
                <label className={`${formStyles.label} text-xs`}>Type</label>
                  <select
                    id="userAddress.streetType"
                    name="userAddress.streetType"
                  value={userAddress.streetType || ''}
                  onChange={onChange}
                  className={formStyles.select}
                >
                  <option value="">Select type</option>
                    <option value="Street">Street</option>
                    <option value="Avenue">Avenue</option>
                    <option value="Boulevard">Boulevard</option>
                    <option value="Road">Road</option>
                    <option value="Drive">Drive</option>
                    <option value="Court">Court</option>
                    <option value="Place">Place</option>
                    <option value="Lane">Lane</option>
                    <option value="Way">Way</option>
                  </select>
                </div>
            </div>
          </div>
  
                <div>
            <label className={formStyles.label}>
                    City
                  </label>
                  <input
                    type="text"
                    id="userAddress.city"
                    name="userAddress.city"
              value={userAddress.city || ''}
              onChange={onChange}
              placeholder="Enter city"
              className={formStyles.input}
                  />
                </div>
  
                <div>
            <label className={formStyles.label}>
                    Province
                  </label>
                  <select
                    id="userAddress.provinceName"
                    name="userAddress.provinceName"
              value={userAddress.provinceName || ''}
              onChange={onChange}
              className={formStyles.select}
                  >
                    <option value="">Select a province</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Manitoba">Manitoba</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="Ontario">Ontario</option>
              <option value="Prince Edward Island">Prince Edward Island</option>
              <option value="Quebec">Quebec</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Northwest Territories">Northwest Territories</option>
              <option value="Nunavut">Nunavut</option>
              <option value="Yukon">Yukon</option>
                  </select>
                </div>
  
                <div>
            <label className={formStyles.label}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="userAddress.postalCode"
                    name="userAddress.postalCode"
              value={userAddress.postalCode || ''}
              onChange={onChange}
                    placeholder="A1A 1A1"
              className={formStyles.input}
                  />
                </div>
  
                <div>
            <label className={formStyles.label}>
                    Country
                  </label>
                  <select
                    id="userAddress.country"
                    name="userAddress.country"
              value={userAddress.country || ''}
              onChange={onChange}
              className={formStyles.select}
                  >
                    <option value="">Select a country</option>
              <option value="Canada">Canada</option>
              <option value="United States">United States</option>
              <option value="Mexico">Mexico</option>
              <option value="France">France</option>
              <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
    );
  };

  export default AddressForm;