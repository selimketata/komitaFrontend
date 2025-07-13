import React, { useRef, useState, useEffect } from "react";
import { X, Plus, Facebook, Instagram, Globe } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import deleteIcon from "/DeleteIcon.svg";
import { updateService } from "../../../Services/serviceService";
import { getAllCategories } from "../../../Services/categoryService";
import { getSubcategoriesByCategoryId } from "../../../Services/subCategoryService";
import ModifyIcon from "/ModifyIcon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next'; // Add this import

export default function EditServiceProfessionnalManagement() {
  const location = useLocation();
  const { currService } = location.state || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [serviceData, setServiceData] = useState(currService);
  const [name, setName] = useState(currService.name);
  const [description, setDescription] = useState(currService.description);
  const { t } = useTranslation(); // Add this hook
  
  // Update category and subcategory state to store IDs instead of names
  const [categoryId, setCategoryId] = useState(currService.category.id);
  const [subcategoryId, setSubcategoryId] = useState(currService.subcategory.id);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  const [address, setAddress] = useState({
    streetNumber: currService.adress?.streetNumber || 0,
    streetName: currService.adress?.streetName || "",
    streetType: currService.adress?.streetType || "",
    provinceName: currService.adress?.provinceName || "",
    postalCode: currService.adress?.postalCode || "",
    city: currService.adress?.city || "",
    country: currService.adress?.country || ""
  });
  const [links, setLinks] = useState({
    facebookURL: currService.links.URL_Facebook || "",
    instagramURL: currService.links.URL_Instagram || "",
    websiteURL: currService.links.URL_Site_Web || ""
  });
  const [status, setStatus] = useState(currService.state);
  const [verified, setVerified] = useState(currService.checked);
  const [photos, setPhotos] = useState(currService.images || []);
  const [keywords, setKeywords] = useState(currService.keywordList || []);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  let photosRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const dataCategories = await getAllCategories();
        setCategories(dataCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrors(prev => ({...prev, categoryFetch: "Erreur lors du chargement des catégories"}));
      }
    };
    
    fetchCategoriesData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategoriesData = async () => {
      if (categoryId) {
        try {
          const dataSubCategories = await getSubcategoriesByCategoryId(categoryId);
          setSubcategories(dataSubCategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setErrors(prev => ({...prev, subcategoryFetch: "Erreur lors du chargement des sous-catégories"}));
        }
      } else {
        setSubcategories([]);
        setSubcategoryId("");
      }
    };
    
    fetchSubcategoriesData();
  }, [categoryId]);

  // Update useEffect to validate form with all required fields
  useEffect(() => {
    validateForm(false);
  }, [name, description, photos, keywords, categoryId, subcategoryId]);

  const validateForm = (showErrors = true) => {
    const newErrors = {};
    let isValid = true;

    // Validate service name
    if (!name.trim()) {
      newErrors.serviceName = "Le nom du service est requis";
      isValid = false;
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "La description du service est obligatoire";
      isValid = false;
    } else if (description.trim().length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
      isValid = false;
    } else if (description.trim().length > 3000) {
      newErrors.description = "La description ne doit pas dépasser 3000 caractères";
      isValid = false;
    }

    // Validate category
    if (!categoryId) {
      newErrors.category = "La catégorie est obligatoire";
      isValid = false;
    }
    
    // Validate subcategory
    if (!subcategoryId && categoryId) {
      newErrors.subcategory = "La sous-catégorie est obligatoire";
      isValid = false;
    }

    // Validate photos
    if (!photos.length) {
      newErrors.photos = "Au moins une photo est requise";
      isValid = false;
    }
    
    // Validate keywords
    if (!keywords.length || !keywords.some(k => k.keywordName?.trim())) {
      newErrors.keywords = "Au moins un mot-clé est requis";
      isValid = false;
    }

    if (showErrors) {
      setErrors(newErrors);
      setShowErrorSummary(!isValid);
      
      // Scroll to error summary if there are errors
      if (!isValid) {
        setTimeout(() => {
          const errorSummary = document.getElementById('error-summary');
          if (errorSummary) {
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
    
    setFormValid(isValid);
    return isValid;
  };

  const PhotoGridItem = ({ photo, onDelete = () => {} }) => (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img 
        src={photo.id 
          ? `https://komitabackend.onrender.com/api/v1/images/${photo.id}/data`
          : (photo.preview || (photo.imageData ? `data:${photo.contentType};base64,${photo.imageData}` : '/assets/default-image.png'))} 
        alt="Service" 
        className="w-full h-full object-cover"
        onError={(e) => {
          if (!e.target.src.includes('default-image.png')) {
            e.target.src = '/assets/default-image.png';
          }
          e.target.onerror = null;
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={onDelete}
          className="w-10 h-10 bg-[#E5181D] rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
          aria-label="Delete photo"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );

  const photosUploader = () => {
    photosRef.current.click();
  };

  const photosHandler = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = [...photos];
      
      [...files].forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            photos: "Les images ne doivent pas dépasser 5MB"
          }));
          return;
        }

        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({
            ...prev,
            photos: "Seules les images sont acceptées"
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(',')[1];
          newPhotos.push({
            file: file,
            preview: URL.createObjectURL(file),
            fileName: file.name,
            contentType: file.type,
            imageData: base64Data
          });
          setPhotos(newPhotos);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addKeyword = () => {
    setKeywords([...keywords, { keywordName: "" }]);
  };

  // Helper function to render field error message
  const renderFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="text-red-600 text-xs mt-1 flex items-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to top to show error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      // Préparer les images
      const formattedImages = photos.map(photo => {
        if (photo.id) {
          // Image existante
          return {
            id: photo.id,
            contentType: photo.contentType,
            imageData: photo.imageData,
            fileName: photo.fileName
          };
        }
        // Nouvelle image
        return {
          contentType: photo.contentType,
          imageData: photo.imageData,
          fileName: photo.fileName
        };
      });

      // Préparer les mots-clés avec la référence au service
      const formattedKeywords = keywords.map(keyword => ({
        id: keyword.id,
        keywordName: keyword.keywordName,
        service: { id: parseInt(id) }
      }));

      // Find the selected category and subcategory objects
      const selectedCategory = categories.find(cat => cat.id.toString() === categoryId.toString()) || currService.category;
      const selectedSubcategory = subcategories.find(subcat => subcat.id.toString() === subcategoryId.toString()) || currService.subcategory;

      const serviceData = {
        id: parseInt(id),
        name: name.trim(),
        description: description.trim(),
        category: { 
          id: parseInt(categoryId),
          name: selectedCategory.name 
        },
        subcategory: { 
          id: parseInt(subcategoryId),
          name: selectedSubcategory.name 
        },
        adress: {
          id: currService.adress?.id,
          ...address
        },
        links: {
          id: currService.links?.id,
          URL_Facebook: links.facebookURL,
          URL_Instagram: links.instagramURL,
          URL_Site_Web: links.websiteURL
        },
        state: status,
        checked: verified,
        images: formattedImages,
        keywordList: formattedKeywords,
        professional: {
          id: currService.professional.id,
          firstname: currService.professional.firstname,
          lastname: currService.professional.lastname,
          email: currService.professional.email,
          role: currService.professional.role
        }
      };

      console.log('Données envoyées au serveur:', JSON.stringify(serviceData, null, 2));
      await updateService(id, serviceData);
      navigate('/professional/services-management');
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      setErrors({
        submit: "Une erreur est survenue lors de la mise à jour du service"
      });
      setShowErrorSummary(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currService) {
    return <div>No service data available</div>;
  }

  return (
    <div className="p-4 font-calibri lg:w-[80vw] lg:p-8">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">{t('professionalDashboard.editService.header')}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#142237] mb-8 text-center">
        {t('professionalDashboard.editService.title')}
        </h2>
        
        {/* Error Summary */}
        {showErrorSummary && Object.keys(errors).length > 0 && (
          <div id="error-summary" className="border-l-4 border-red bg-[#ff000026] p-4 rounded mb-6">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 mt-1 mr-3" />
              <div>
                <h3 className="text-red-600 font-medium">Veuillez corriger les erreurs suivantes:</h3>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="serviceName" className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.title')} <span className="text-[#E5181D]">*</span>
            </label>
            <input
              type="text"
              id="serviceName"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.serviceName ? 'border-[#E5181D]' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            {renderFieldError('serviceName')}
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.description')} <span className="text-[#E5181D]">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? 'border-[#E5181D]' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
            {renderFieldError('description')}
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/3000 caractères (minimum 10)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block font-medium text-[#142237] mb-2">
              {t('professionalDashboard.addService.category')} <span className="text-[#E5181D]">*</span>
              </label>
              <select
                id="category"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.category ? 'border-[#E5181D]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{t('professionalDashboard.addService.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {renderFieldError('category')}
              {errors.categoryFetch && (
                <div className="text-red-600 text-xs mt-1 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  <span>{errors.categoryFetch}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="subcategory" className="block font-medium text-[#142237] mb-2">
              {t('professionalDashboard.addService.subcategory')} <span className="text-[#E5181D]">*</span>
              </label>
              <select
                id="subcategory"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.subcategory ? 'border-[#E5181D]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={isLoading || !categoryId}
              >
                <option value="">Sélectionner une sous-catégorie</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
              {renderFieldError('subcategory')}
              {errors.subcategoryFetch && (
                <div className="text-red-600 text-xs mt-1 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  <span>{errors.subcategoryFetch}</span>
                </div>
              )}
              {!categoryId && !errors.subcategory && (
                <p className="text-xs text-gray-500 mt-1">
                  {t('professionalDashboard.addService.errors.category')}
                </p>
              )}
            </div>
          </div>

          {/* Address section remains unchanged */}
          <div className="space-y-4">
            <label className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.address')}
            </label>
            <div className="space-y-6">
              {/* Street Address Section */}
              <div className="w-full">
                {/* <label className="block text-sm font-medium text-[#142237] mb-2">{t('professionalDashboard.addService.address')}</label> */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4">
                    <label className="block text-xs font-medium text-[#142237] mb-1">
                    {t('professionalDashboard.addService.streetNumber')}
                    </label>
                    <input
                      type="number"
                      id="streetNumber"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                      value={address.streetNumber}
                      onChange={(e) => setAddress({ ...address, streetNumber: parseInt(e.target.value) || 0 })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="md:w-2/4">
                    <label className="block text-xs font-medium text-[#142237] mb-1">
                    {t('professionalDashboard.addService.streetName')}
                    </label>
                    <input
                      type="text"
                      id="streetName"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                      value={address.streetName}
                      onChange={(e) => setAddress({ ...address, streetName: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="md:w-1/4">
                    <label className="block text-xs font-medium text-[#142237] mb-1">
                    {t('professionalDashboard.addService.streetType')}
                    </label>
                    <select
                      id="streetType"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                      value={address.streetType}
                      onChange={(e) => setAddress({ ...address, streetType: e.target.value })}
                      disabled={isLoading}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Street">Rue</option>
                      <option value="Avenue">Avenue</option>
                      <option value="Boulevard">Boulevard</option>
                      <option value="Road">Route</option>
                      <option value="Drive">Allée</option>
                      <option value="Court">Cour</option>
                      <option value="Place">Place</option>
                      <option value="Lane">Ruelle</option>
                      <option value="Way">Voie</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#142237] mb-2">
                  {t('professionalDashboard.addService.city')}
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#142237] mb-2">
                  {t('professionalDashboard.addService.province')}
                  </label>
                  <select
                    id="provinceName"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                    value={address.provinceName}
                    onChange={(e) => setAddress({ ...address, provinceName: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner une province</option>
                    <option value="Alberta">Alberta</option>
                    <option value="British Columbia">Colombie-Britannique</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">Nouveau-Brunswick</option>
                    <option value="Newfoundland and Labrador">Terre-Neuve-et-Labrador</option>
                    <option value="Nova Scotia">Nouvelle-Écosse</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Prince Edward Island">Île-du-Prince-Édouard</option>
                    <option value="Quebec">Québec</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Northwest Territories">Territoires du Nord-Ouest</option>
                    <option value="Nunavut">Nunavut</option>
                    <option value="Yukon">Yukon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#142237] mb-2">
                  {t('professionalDashboard.addService.postalCode')}
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    placeholder="A1A 1A1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#142237] mb-2">
                  {t('professionalDashboard.addService.country')}
                  </label>
                  <select
                    id="country"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner un pays</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">États-Unis</option>
                    <option value="Mexico">Mexique</option>
                    <option value="France">France</option>
                    <option value="United Kingdom">Royaume-Uni</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Social media section */}
          <div className="space-y-4">
            <label className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.socialLinks')}
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <Facebook className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                  placeholder={t('professionalDashboard.addService.facebookLink')}
                  value={links.facebookURL}
                  onChange={(e) => setLinks({ ...links, facebookURL: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center">
                <Instagram className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                  placeholder={t('professionalDashboard.addService.instagramLink')}
                  value={links.instagramURL}
                  onChange={(e) => setLinks({ ...links, instagramURL: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                  placeholder={t('professionalDashboard.addService.websiteLink')}
                  value={links.websiteURL}
                  onChange={(e) => setLinks({ ...links, websiteURL: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Keywords section */}
          <div>
            <label className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.keywords')} <span className="text-[#E5181D]">*</span>
            </label>
            <div className={`space-y-3 ${errors.keywords ? 'border-l-4 border-[#E5181D] pl-3' : ''}`}>
              {keywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.keywords ? 'border-[#E5181D]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                    placeholder={t('professionalDashboard.addService.keywordsPlaceholder')}
                    value={keyword.keywordName || ''}
                    onChange={(e) => {
                      const newKeywords = [...keywords];
                      newKeywords[index] = { ...keyword, keywordName: e.target.value };
                      setKeywords(newKeywords);
                    }}
                  />
                  {keywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newKeywords = [...keywords];
                        newKeywords.splice(index, 1);
                        setKeywords(newKeywords);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Supprimer le mot-clé"
                    >
                      <X className="w-5 h-5 text-[#E5181D]" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyword}
                className="inline-flex items-center px-3 py-2 rounded-lg border-2 border-[#142237] text-[#142237] hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>{t('professionalDashboard.addService.addKeyword')}</span>
              </button>
              {renderFieldError('keywords')}
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.photos')} <span className="text-[#E5181D]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                onClick={photosUploader}
                className={`aspect-square rounded-lg border-2 border-dashed ${
                  errors.photos ? 'border-[#E5181D]' : 'border-gray-300'
                } hover:border-[#142237] transition-colors flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100`}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={photosRef}
                  onChange={photosHandler}
                  accept="image/*"
                  multiple
                />
                <Plus className="w-8 h-8 text-gray-400" />
              </div>

              {photos.map((photo, index) => (
                <PhotoGridItem
                  key={index}
                  photo={photo}
                  onDelete={() => {
                    setPhotos(photos.filter((_, i) => i !== index));
                  }}
                />
              ))}
            </div>
            {renderFieldError('photos')}
            <p className="text-xs text-gray-500 mt-2">
              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
            </p>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-[#142237] mb-2">
              Autres informations
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-[#142237] font-medium">État :</label>
                <select 
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>

                </select>
              </div>
        
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Link to="/professional/services-management">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                {t('professionalDashboard.addService.cancel')}
              </button>
            </Link>

            <button
              type="submit"
              className={`px-6 py-2 rounded-lg bg-[#142237] text-white hover:bg-[#1d2f4a] transition-colors font-medium ${
                !formValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!formValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                `${t('professionalDashboard.addService.submit')}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}