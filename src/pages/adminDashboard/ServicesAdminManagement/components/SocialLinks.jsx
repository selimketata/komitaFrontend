import React from 'react';

const SocialLinks = ({ links, handleChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Social Links</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Facebook URL
        </label>
        <input
          type="url"
          name="links.facebookURL"
          value={links.facebookURL}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#142237]"
          placeholder="https://facebook.com/your-page"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instagram URL
        </label>
        <input
          type="url"
          name="links.instagramURL"
          value={links.instagramURL}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#142237]"
          placeholder="https://instagram.com/your-profile"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          name="links.websiteURL"
          value={links.websiteURL}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#142237]"
          placeholder="https://your-website.com"
        />
      </div>
    </div>
  );
};

export default SocialLinks; 