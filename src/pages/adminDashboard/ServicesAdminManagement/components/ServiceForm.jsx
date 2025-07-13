import React, { useEffect, useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';


const ServiceForm = ({
  formData,
  handleChange,
  keywords,
  handleKeywordsChange,
  handleAddKeyword,
  handleRemoveKeyword,
  handleImageUpload,
  handleDeleteImage,
  categories,
  subcategories,
  isViewMode = false,
  isNewProfessional,
  setIsNewProfessional,
  existingProfessionals
}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);

  const inputClass = `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none transition-all duration-200 ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`;

  // Ensure formData and its properties exist using useMemo
  const safeFormData = useMemo(() => ({
    ...formData,
    category: formData?.category || { id: 0, name: "" },
    subcategory: formData?.subcategory || { id: 0, name: "" },
    adress: formData?.adress || {
      streetNumber: "",
      streetName: "",
      streetType: "",
      provinceName: "",
      postalCode: "",
      city: "",
      country: ""
    },
    keywordList: formData?.keywordList || [],
    links: formData?.links || {
      facebookURL: "",
      instagramURL: "",
      websiteURL: ""
    },
    images: formData?.images || [],
    state: formData?.state || "ACTIVE"
  }), [formData]);

  useEffect(() => {
    if (!safeFormData.images) return;

    const urls = safeFormData.images.map(image => {
      if (image instanceof File) {
        return URL.createObjectURL(image);
      }
      if (image.preview) {
        return image.preview;
      }
      if (image.file) {
        return URL.createObjectURL(image.file);
      }
      return typeof image === 'string' ? image : image.url || image.path || '';
    });
    setImageUrls(urls);

    return () => {
      urls.forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [safeFormData.images]);

  // Ajouter la fonction de filtrage des professionnels
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProfessionals(existingProfessionals);
      return;
    }

    const filtered = existingProfessionals.filter(professional => 
      professional.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfessionals(filtered);
  }, [searchTerm, existingProfessionals]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Service Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#142237]">Service Information</h3>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={safeFormData.name || ""}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={safeFormData.description || ""}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              disabled={isViewMode}
            />
          </div>
          
          {/* Service State Toggle */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Service Status
            </label>
            <select
              id="state"
              name="state"
              value={safeFormData.state}
              onChange={(e) => handleChange({
                target: {
                  name: "state",
                  value: e.target.value
                }
              })}
              className={inputClass}
              disabled={isViewMode}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={safeFormData.category?.id || ""}
              onChange={(e) => handleChange({
                target: {
                  name: "category",
                  value: e.target.value
                }
              })}
              className={inputClass}
              disabled={isViewMode}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={safeFormData.subcategory?.id || ""}
              onChange={(e) => handleChange({
                target: {
                  name: "subcategory",
                  value: e.target.value
                }
              })}
              className={inputClass}
              disabled={isViewMode || !safeFormData.category?.id}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            {!isViewMode && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywords}
                  onChange={handleKeywordsChange}
                  className={inputClass}
                  placeholder="Add keywords"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
                >
                  Add
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
            {safeFormData.keywordList.map((keyword, index) => (
  <span
    key={index}
    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
  >
    {typeof keyword === 'string' ? keyword : keyword.keywordName}
    {!isViewMode && (
      <button
        type="button"
        onClick={() => handleRemoveKeyword(typeof keyword === 'string' ? keyword : keyword?.keywordName)}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </span>
))}
            </div>
          </div>
        </div>

        {/* Right Column - Address Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#142237]">Address Information</h3>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label htmlFor="adress.streetNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Street Number
              </label>
              <input
                type="number"
                id="adress.streetNumber"
                name="adress.streetNumber"
                value={safeFormData.adress.streetNumber}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
            <div className="w-2/3">
              <label htmlFor="adress.streetName" className="block text-sm font-medium text-gray-700 mb-1">
                Street Name
              </label>
              <input
                type="text"
                id="adress.streetName"
                name="adress.streetName"
                value={safeFormData.adress.streetName}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
          </div>
          <div>
            <label htmlFor="adress.streetType" className="block text-sm font-medium text-gray-700 mb-1">
              Street Type
            </label>
            <select
              id="adress.streetType"
              name="adress.streetType"
              value={safeFormData.adress.streetType}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
            >
              <option value="">Select a street type</option>
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
          <div>
            <label htmlFor="adress.city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="adress.city"
              name="adress.city"
              value={safeFormData.adress.city}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
            />
          </div>
          <div>
            <label htmlFor="adress.provinceName" className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              id="adress.provinceName"
              name="adress.provinceName"
              value={safeFormData.adress.provinceName}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
            >
              <option value="">Select a province</option>
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
          <div>
            <label htmlFor="adress.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="adress.postalCode"
              name="adress.postalCode"
              value={safeFormData.adress.postalCode}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
              placeholder="A1A 1A1"
            />
          </div>
          <div>
            <label htmlFor="adress.country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="adress.country"
              name="adress.country"
              value={safeFormData.adress.country}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
            >
              <option value="">Select a country</option>
              <option value="CA">Canada</option>
              <option value="US">United States</option>
              <option value="MX">Mexico</option>
              <option value="FR">France</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#142237]">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="links.facebookURL" className="block text-sm font-medium text-gray-700 mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              id="links.facebookURL"
              name="links.facebookURL"
              value={safeFormData.links.facebookURL}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label htmlFor="links.instagramURL" className="block text-sm font-medium text-gray-700 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              id="links.instagramURL"
              name="links.instagramURL"
              value={safeFormData.links.instagramURL}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label htmlFor="links.websiteURL" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              id="links.websiteURL"
              name="links.websiteURL"
              value={safeFormData.links.websiteURL}
              onChange={handleChange}
              className={inputClass}
              disabled={isViewMode}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Professional Selection Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#142237]">Professional Selection</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="professionalType"
              checked={isNewProfessional}
              onChange={() => setIsNewProfessional(true)}
              className="form-radio text-[#142237]"
              disabled={isViewMode}
            />
            <span>New Professional</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="professionalType"
              checked={!isNewProfessional}
              onChange={() => setIsNewProfessional(false)}
              className="form-radio text-[#142237]"
              disabled={isViewMode}
            />
            <span>Existing Professional</span>
          </label>
        </div>

        {!isNewProfessional && (
          <div className="relative">
            <label htmlFor="professional-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Professional
            </label>
            <div className="relative">
              <input
                type="text"
                id="professional-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name or email..."
                className={inputClass}
                disabled={isViewMode}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            {showDropdown && !isViewMode && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map(professional => (
                    <div
                      key={professional.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        formData.professional?.id === professional.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        handleChange({
                          target: {
                            name: 'professional.id',
                            value: professional.id
                          }
                        });
                        setSearchTerm(`${professional.firstname} ${professional.lastname}`);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="font-medium">{professional.firstname} {professional.lastname}</div>
                      <div className="text-sm text-gray-600">{professional.email}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No professionals found</div>
                )}
              </div>
            )}
            
            {formData.professional?.id && (
              <div className="mt-2 text-sm text-gray-600">
                Selected Professional: {formData.professional.firstname} {formData.professional.lastname}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Information Section - Only show for new professionals */}
      {isNewProfessional && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#142237]">Professional Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="professional.firstname" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="professional.firstname"
                name="professional.firstname"
                value={safeFormData.professional?.firstname || ""}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label htmlFor="professional.lastname" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="professional.lastname"
                name="professional.lastname"
                value={safeFormData.professional?.lastname || ""}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label htmlFor="professional.email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="professional.email"
                name="professional.email"
                value={safeFormData.professional?.email || ""}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
            <div>
              <label htmlFor="professional.customIdentifier" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Identifier
              </label>
              <input
                type="text"
                id="professional.customIdentifier"
                name="professional.customIdentifier"
                value={safeFormData.professional?.customIdentifier || ""}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
            {!formData.id && (
              <div>
                <label htmlFor="professional.password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="professional.password"
                  name="professional.password"
                  value={safeFormData.professional?.password || ""}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isViewMode}
                />
              </div>
              
              
            )}
            <div>
              <label htmlFor="professional.Phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="professional.phoneNumber"
                name="professional.phoneNumber"
                value={safeFormData.professional?.phoneNumber || ""}
                onChange={handleChange}
                className={inputClass}
                disabled={isViewMode}
              />
            </div>
           
          </div>
        </div>
      )}

      {/* Images Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#142237]">Images</h3>
        {!isViewMode && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              multiple
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="mt-2 text-sm text-gray-600">Cliquez pour ajouter une ou plusieurs images</span>
                <span className="mt-1 text-xs text-gray-500">PNG, JPG jusqu'à 5MB par image</span>
              </div>
            </label>
          </div>
        )}
        {/* Display uploaded images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safeFormData.images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image.id ? `http://localhost:8085/api/v1/images/${image.id}/data` : image.preview}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  if (image.id) {
                    handleDeleteImage(image.id);
                  }
                  const newImages = [...safeFormData.images];
                  newImages.splice(index, 1);
                  handleChange({
                    target: {
                      name: 'images',
                      value: newImages
                    }
                  });
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;