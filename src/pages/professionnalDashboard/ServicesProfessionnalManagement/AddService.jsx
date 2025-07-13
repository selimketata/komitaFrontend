import React, { useRef, useState, useContext, useEffect } from "react";
import ReactModal from "react-modal";
import deleteIcon from "/DeleteIcon.svg";
import GreenCheckIcon from "/GreenCheckIcon.svg";
import { Plus, Facebook, Instagram, Globe, X } from "lucide-react";
import { addService } from './../../../Services/serviceService';
import { AuthContext } from "../../../Context/AuthContext";
import { getSubcategoriesByCategoryId } from "../../../Services/subCategoryService";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories } from "../../../Services/categoryService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next'; // Add this import

const ServiceForm = ({ onSubmit }) => {
  const { t } = useTranslation(); // Add this hook
  const [keywords, setKeywords] = useState([]);
  const { user } = useContext(AuthContext);
  // Add null check for user
  const id = user?.id; // Use optional chaining to prevent errors if user is null
  const [photos, setPhotos] = useState([]);
  // Removed logo state and ref
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [address, setAddress] = useState({
    streetNumber: 0,
    streetName: "",
    streetType: "",
    provinceName: "",
    postalCode: "",
    city: "",
    country: ""
  });
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // Add missing states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  let logoRef = useRef(null);
  let photosRef = useRef(null);

  // Add useEffect to validate form whenever required fields change
  useEffect(() => {
    validateForm(false);
  }, [serviceName, description, photos]);

  // Replace direct function calls with useEffect hooks
  // Remove these functions and their calls
  // const loadCategories = async () => {
  //   const dataCategories = await fetchCategories();
  //   setCategories(dataCategories);
  // };
  // loadCategories();
  //
  // const loadSubcategories = async () => {
  //   if (category) {
  //     const dataSubCategories = await fetchSubCategory(category);
  //     setSubcategories(dataSubCategories);
  //   };
  // };
  // loadSubcategories();
  //
  // const fetchSubCategory = async (CategID) => {
  //   const response = await getSubcategoriesByCategoryId(CategID);
  //   return response;
  // };
  //
  // const fetchCategories = async () => {
  //   const response = await getAllCategories();
  //   return response;
  // };

  // Add useEffect to fetch categories on component mount (like in EditService.jsx)
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setIsLoading(true);
        const dataCategories = await getAllCategories();
        setCategories(dataCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrors(prev => ({...prev, categoryFetch: "Erreur lors du chargement des catégories"}));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoriesData();
  }, []);

  // Add useEffect to fetch subcategories when category changes (like in EditService.jsx)
  useEffect(() => {
    const fetchSubcategoriesData = async () => {
      if (category) {
        try {
          setIsLoading(true);
          const dataSubCategories = await getSubcategoriesByCategoryId(category);
          setSubcategories(dataSubCategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setErrors(prev => ({...prev, subcategoryFetch: "Erreur lors du chargement des sous-catégories"}));
        } finally {
          setIsLoading(false);
        }
      } else {
        setSubcategories([]);
        setSubcategory("");
      }
    };
    
    fetchSubcategoriesData();
  }, [category]);

  // Fix the PhotoGridItem component to use photo.preview instead of imageUrl
  const PhotoGridItem = ({ photo, onDelete = () => { } }) => (
    <div className="relative aspect-square rounded-lg overflow-hidden group">
      <img 
        src={photo.preview} 
        alt="Service" 
        className="w-full h-full object-cover"
      />
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 w-8 h-8 bg-[#E5181D] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete photo"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newPhotos = [...photos];
    const [draggedPhoto] = newPhotos.splice(dragIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    setPhotos(newPhotos);
  };

  const photosUploader = (e) => {
    photosRef.current.click();
  };

  const photosHandler = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = [...photos];
      
      [...files].forEach(file => {
        // Store the actual file and its URL for preview
        const reader = new FileReader();
        reader.onload = () => {
          newPhotos.push({
            file: file,
            preview: URL.createObjectURL(file),
            fileName: file.name,
            contentType: file.type
          });
          setPhotos(newPhotos);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add the logo state back
  const [logo, setLogo] = useState("none");
  
  // Remove the duplicate useEffect for subcategories (lines 85-92)
  // Keep only the first one (lines 32-39)
  
  // Fix the logoHandler function
  const logoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo({
          file: file,
          preview: URL.createObjectURL(file),
          fileName: file.name,
          contentType: file.type,
          imageData: reader.result.split(',')[1] // Base64 data without the prefix
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add logoUploader function
  const logoUploader = () => {
    logoRef.current.click();
  };
  
  // Update the handleSubmit function to properly set isLoading
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!validateForm()) {
      // Scroll to top to show error summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const serviceData = {
        name: serviceName.trim(),
        description: description.trim(),
        category: { id: Number(category) },
        subcategory: { id: Number(subcategory) },
        adress: {
          streetNumber: address.streetNumber,
          streetName: address.streetName.trim(),
          streetType: address.streetType,
          provinceName: address.provinceName,
          postalCode: address.postalCode.trim(),
          city: address.city.trim(),
          country: address.country
        },
        links: {
          facebookURL: facebookLink.trim(),
          instagramURL: instagramLink.trim(),
          websiteURL: websiteLink.trim()
        },
        keywordList: keywords
          .filter(kw => kw.trim())
          .map(kw => ({ keywordName: kw.trim() })),
        professional: { id: id },
        checked: false,
        state: false
      };

      // Créer un objet FormData
      const formData = new FormData();
      
      // Ajouter le service en tant que JSON string
      formData.append('service', JSON.stringify(serviceData));
      
      // Ajouter chaque image
      photos.forEach((photo, index) => {
        formData.append('images', photo.file);
      });

      console.log("Calling addService API...");
      await addService(formData);
      console.log("API call successful");
      onSubmit();
      toast.success("Service créé avec succès!");
    } catch (error) {
      console.error("Error creating service:", error);
      
      // Handle validation errors from API
      if (error.response?.status === 400 && error.response?.data?.details) {
        const apiErrors = {};
        const details = error.response.data.details;
        
        // Map API error fields to our form fields
        Object.keys(details).forEach(key => {
          if (key === 'address.city' || key === 'adress.city') {
            apiErrors.city = details[key];
          } else if (key === 'address.country' || key === 'adress.country') {
            apiErrors.country = details[key];
          } else {
            // Handle other field errors
            const fieldName = key.split('.').pop();
            apiErrors[fieldName] = details[key];
          }
        });
        
        setErrors(apiErrors);
        setShowErrorSummary(true);
        toast.error("Veuillez corriger les erreurs dans le formulaire");
      } else {
        toast.error("Erreur lors de la création du service: " + (error.message || "Erreur inconnue"));
        setErrors({
          submit: "Une erreur est survenue lors de la création du service"
        });
        setShowErrorSummary(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update validateForm function to check address fields
  // Fix 1: Move validateForm function definition before it's used in useEffect
  const validateForm = (showErrors = true) => {
    const newErrors = {};
    let isValid = true;
    
    if (!serviceName || typeof serviceName !== 'string' || !serviceName.trim()) {
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
    if (!category) {
      newErrors.category = "La catégorie est obligatoire";
      isValid = false;
    }
    
    // Validate subcategory
    if (!subcategory && category) {
      newErrors.subcategory = "La sous-catégorie est obligatoire";
      isValid = false;
    }
    
    if (photos.length === 0) {
      newErrors.photos = "Au moins une photo est requise";
      isValid = false;
    }
    
    // Validate keywords
    if (!keywords.length || keywords.every(kw => !kw.trim())) {
      newErrors.keywords = "Au moins un mot-clé est requis";
      isValid = false;
    }
    
    // Validate links if they are provided
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    if (facebookLink.trim() && !urlRegex.test(facebookLink.trim())) {
      newErrors.facebookLink = "Le lien Facebook n'est pas valide";
      isValid = false;
    }
    
    if (instagramLink.trim() && !urlRegex.test(instagramLink.trim())) {
      newErrors.instagramLink = "Le lien Instagram n'est pas valide";
      isValid = false;
    }
    
    if (websiteLink.trim() && !urlRegex.test(websiteLink.trim())) {
      newErrors.websiteLink = "Le lien du site web n'est pas valide";
      isValid = false;
    }
    
    // Address fields are not required
    
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

  // Fix 2: Combine all validation dependencies in a single useEffect
  useEffect(() => {
    validateForm(false);
  }, [serviceName, description, photos, category, subcategory, keywords, facebookLink, instagramLink, websiteLink]);

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

  // Add addKeyword function inside component
  const addKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#142237] mb-8 text-center">
          {t('professionalDashboard.addService.title')}
        </h2>
        
        {/* Error Summary */}
        {showErrorSummary && Object.keys(errors).length > 0 && (
          <div id="error-summary" className="border-l-4 border-red bg-[#ff00001a] p-4 rounded mb-6">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 mt-1 mr-3" />
              <div>
                <h3 className="text-red-600 font-medium">{t('professionalDashboard.addService.errors.formErrors')}</h3>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Continue updating the form with t() function for all text */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="serviceName" className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.serviceName')} <span className="text-[#E5181D]">*</span>
            </label>
            <input
              type="text"
              id="serviceName"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.serviceName ? 'border-[#E5181D]' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
              placeholder={t('professionalDashboard.addService.serviceNamePlaceholder')}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
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
              placeholder={t('professionalDashboard.addService.descriptionPlaceholder')}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                <option value="">{t('professionalDashboard.addService.selectCategory')}</option>
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading...</option>
                )}
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
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={isLoading || !category}
              >
                <option value="">{t('professionalDashboard.addService.selectSubcategory')}</option>
                {category ? (
                  subcategories && subcategories.length > 0 ? (
                    subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading...</option>
                  )
                ) : (
                  <option value="" disabled>{t('professionalDashboard.errors.category')}</option>
                )}
              </select>
              {renderFieldError('subcategory')}
              {errors.subcategoryFetch && (
                <div className="text-red-600 text-xs mt-1 flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  <span>{errors.subcategoryFetch}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-[#142237] mb-2">
            {t('professionalDashboard.addService.address')}
            </label>
            <div className="space-y-6">
              {/* Street Address Section */}
              <div className="w-full">
                {/* <label className="block text-sm font-medium text-[#142237] mb-2">Adresse de la rue</label> */}
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
                  {t('professionalDashboard.addService.city')} <span className="text-[#E5181D]">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.city ? 'border-[#E5181D]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    disabled={isLoading}
                  />
                  {renderFieldError('city')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#142237] mb-2">
                  {t('professionalDashboard.addService.country')} <span className="text-[#E5181D]">*</span>
                  </label>
                  <select
                    id="country"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.country ? 'border-[#E5181D]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
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
                  {renderFieldError('country')}
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
                  />
                </div>

               
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-medium text-[#142237] mb-2">
              {t('professionalDashboard.addService.socialLinks')}
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <Facebook className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    errors.facebookLink ? 'border-[#E5181D]' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                  placeholder={t('professionalDashboard.addService.facebookLink')}
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.target.value)}
                />
              </div>
              {renderFieldError('facebookLink')}
              
              <div className="flex items-center">
                <Instagram className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    errors.instagramLink ? 'border-[#E5181D]' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                  placeholder={t('professionalDashboard.addService.instagramLink')}
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                />
              </div>
              {renderFieldError('instagramLink')}
              
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-[#142237] mr-3" />
                <input
                  type="text"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    errors.websiteLink ? 'border-[#E5181D]' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#142237] focus:border-transparent`}
                  placeholder={t('professionalDashboard.addService.websiteLink')}
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                />
              </div>
              {renderFieldError('websiteLink')}
              
              <p className="text-xs text-gray-500 mt-1">
                {t('professionalDashboard.addService.validLinkFormat')}
              </p>
            </div>
          </div>

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
                    value={keyword}
                    onChange={(e) => {
                      const newKeywords = [...keywords];
                      newKeywords[index] = e.target.value;
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
                  disabled={isLoading}
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

          <div className="flex justify-center gap-4 pt-6">
            <Link to="/professional/services-management">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                disabled={isLoading}
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
};

export default function AddServiceProfessionnalManagement() {
  const { t } = useTranslation(); // Add this line to get the translation function
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Make sure to get the user context

  const handleSubmit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/professional/services-management');
  };

  // Add this check for user permissions
  if (!user || user.role !== "PROFESSIONAL") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-[#142237] mb-4">{t('professionalDashboard.common.accessDenied')}</h1>
          <p className="text-gray-600 mb-6">
            {t('professionalDashboard.common.permissionError')}
          </p>
          <Link to="/login">
            <button className="w-full py-2 bg-[#E5181D] text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              {t('professionalDashboard.common.login')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 font-calibri lg:w-[80vw] lg:p-8">
        <h1 className="text-2xl font-bold mb-6 border-b pb-2">{t('professionalDashboard.addService.title')}</h1>
        <ServiceForm onSubmit={handleSubmit} />
      </div>
      
      <ReactModal
        isOpen={open}
        onRequestClose={handleClose}
        contentLabel="Confirmation Modal"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl p-6 rounded-lg shadow-lg flex flex-col items-center">
          <img src={GreenCheckIcon} alt="Success" className="w-20 h-auto" />
          <p className="font-medium text-lg text-center mt-4">
            {t('professionalDashboard.addService.success')}
          </p>
          <button
            onClick={handleClose}
            className="mt-4 bg-[#142237] text-white px-6 py-2 rounded-md hover:bg-[#142237e4] transition-colors"
          >
            {t('professionalDashboard.servicesManagement.services')}
          </button>
        </div>
      </ReactModal>
    </>
  );
}
