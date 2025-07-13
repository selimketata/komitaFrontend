import React from 'react';
import { X } from 'lucide-react';

const BasicInformation = ({
  formData,
  handleChange,
  keywords,
  handleKeywordsChange,
  handleAddKeyword,
  handleRemoveKeyword,
  categories,
  subcategories
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          name="category.id"
          value={formData.category.id}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
        >
          <option value="">Select a category</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subcategory
        </label>
        <select
          name="subcategory.id"
          value={formData.subcategory.id}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
        >
          <option value="">Select a subcategory</option>
          {subcategories?.map(subcat => (
            <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={keywords}
            onChange={handleKeywordsChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none"
            placeholder="Add keywords"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a]"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.keywordList.map(keyword => (
            <span
              key={keyword.id}
              className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
            >
              {keyword.keywordName}
              <button
  type="button"
  onClick={() => handleRemoveKeyword(typeof keyword === 'string' ? keyword : keyword.keywordName)}
  className="text-gray-500 hover:text-gray-700"
>
  <X className="w-4 h-4" />
</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation; 