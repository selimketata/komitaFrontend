import React from 'react';

const ServiceAddress = ({ address, handleChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Service Address</h4>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number
          </label>
          <input
            type="number"
            name="adress.streetNumber"
            value={address.streetNumber}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Name
          </label>
          <input
            type="text"
            name="adress.streetName"
            value={address.streetName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Type
        </label>
        <select
          name="adress.streetType"
          value={address.streetType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
        >
          <option value="">Select type</option>
          <option value="Street">Street</option>
          <option value="Avenue">Avenue</option>
          <option value="Boulevard">Boulevard</option>
          <option value="Road">Road</option>
          <option value="Lane">Lane</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="adress.city"
            value={address.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <select
            name="adress.provinceName"
            value={address.provinceName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          >
            <option value="">Select province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="YT">Yukon</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="adress.postalCode"
            value={address.postalCode}
            onChange={handleChange}
            placeholder="A1A 1A1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="adress.country"
            value={address.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
          >
            <option value="">Select country</option>
            <option value="CA">Canada</option>
            <option value="US">United States</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ServiceAddress; 