import React, { useState, useEffect, useContext } from 'react';
import { MapPin, CircleChevronRight, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getAllImagesForService, getImageDataById } from '../Services/serviceService';
import { useTranslation } from 'react-i18next';
import  {serviceContent}  from '@config/content'; // Import serviceContent

const ServiceCard = ({ 
  id, 
  view, 
  title, 
  keywords, 
  description, 
  location, 
  image, 
  date, 
  imageId, 
  category, 
  subcategory, 
  primaryImageId,
  professionalName,
  professionalProfileImage
}) => {
  const { t } = useTranslation(); // Use the translation hook
  const [serviceImage, setServiceImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Add AuthContext
  const [showAuthModal, setShowAuthModal] = useState(false); // Add state for auth modal

  // Add function to check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Handle click on "Consulter" button
  const handleConsultClick = (e) => {
    e.preventDefault();
    
    if (isAuthenticated()) {
      navigate(`/service/${id}`);
    } else {
      // Show modal instead of direct navigation
      setShowAuthModal(true);
    }
  };

  // Handle login button click in modal
  const handleLogin = () => {
    setShowAuthModal(false);
    navigate('/login', { state: { from: `/service/${id}` } });
  };

  // Handle cancel button click in modal
  const handleCancel = () => {
    setShowAuthModal(false);
  };

  // Reset image state when service ID changes
  useEffect(() => {
    setLoading(true);
    setServiceImage(null);
    fetchServiceImages();
  }, [id, imageId, primaryImageId]); // Add dependencies that should trigger a refetch

  // Helper function to check if an image exists before setting it
  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const fetchServiceImages = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      // Try different image sources in priority order
      
      // 1. First check if we have an imageId prop
      if (imageId) {
        const imageUrl = `https://komitabackend.onrender.com/api/v1/images/${imageId}/data`;
        const exists = await checkImageExists(imageUrl);
        if (exists) {
          setServiceImage(imageUrl);
          setLoading(false);
          return;
        }
      }
      
      // 2. Check for primaryImageId
      if (primaryImageId) {
        const imageUrl = `https://komitabackend.onrender.com/api/v1/images/${primaryImageId}/data`;
        const exists = await checkImageExists(imageUrl);
        if (exists) {
          setServiceImage(imageUrl);
          setLoading(false);
          return;
        }
      }
      
      // 3. For authenticated users, try to get all images
      if (isAuthenticated()) {
        try {
          const images = await getAllImagesForService(id);
          if (images && images.length > 0) {
            const imageUrl = `https://komitabackend.onrender.com/api/v1/images/${images[0].id}/data`;
            const exists = await checkImageExists(imageUrl);
            if (exists) {
              setServiceImage(imageUrl);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          // Silent catch - we'll try the next method
        }
      }
      
      // 4. If all else fails, use default image
      setServiceImage('/assets/default-image.png');
    } catch (error) {
      // Set default image on any error
      setServiceImage('/assets/default-image.png');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    if (!e.target.src.includes('default-image.png')) {
      e.target.src = '/assets/default-image.png';
    }
    e.target.onerror = null;
  };
  
  // Create an array of keywords if provided as a string
  const keywordArray = keywords ? keywords.split(' ').filter(k => k.trim() !== '') : [];
  
  // Determine which image source to use with fallbacks
  const imageSource = serviceImage || '/assets/default-image.png';
  
  // Authentication Modal Component
  const AuthModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button 
            onClick={handleCancel}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {t("service.authModal.title", "Authentification requise")}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {t("service.authModal.message", "Pour consulter les détails de ce service, veuillez vous connecter ou continuer la navigation sur la page actuelle.")}
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("service.authModal.cancelButton", "Annuler")}
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-[#E5181D] text-white rounded hover:bg-red-700 transition-colors"
            >
              {t("service.authModal.loginButton", "Se connecter")}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Update the commonContent to display professional information and use serviceContent
  const commonContent = (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-1 text-[#142237]">{title}</h3>
            {(category || subcategory) && (
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <span className="bg-[#142237] text-white text-xs px-2 py-0.5 rounded">
                    {category}
                  </span>
                )}
                {subcategory && (
                  <span className="bg-[#E5E9EB] text-[#142237] text-xs px-2 py-0.5 rounded">
                    {subcategory}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-gray-400 text-xs sm:text-sm">{date}</span>
        </div>
        
        {keywordArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {keywordArray.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-[#F0F4F8] text-[#142237] text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded flex items-center">
                <Tag size={12} className="mr-1 text-[#E5181D]" />
                {tag}
              </span>
            ))}
            {keywordArray.length > 3 && (
              <span className="bg-[#F0F4F8] text-[#142237] text-xs font-medium px-2.5 py-0.5 rounded">
                +{keywordArray.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="min-h-[60px] ">
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{description}</p>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {professionalProfileImage ? (
              // If the professionalProfileImage is a base64 string
              professionalProfileImage.startsWith('/9j/') ? (
                <img 
                  src={`data:image/jpeg;base64,${professionalProfileImage}`}
                  alt={professionalName || "Professional"}
                  className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full mr-2 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/utilisateur.png';
                  }}
                />
              ) : (
                // If it's an ID, fetch from API
                <img 
                  src={`https://komitabackend.onrender.com/api/v1/images/${professionalProfileImage}/data`} 
                  alt={professionalName || "Professional"}
                  className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full mr-2 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/utilisateur.png';
                  }}
                />
              )
            ) : (
              <div className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full mr-2 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {professionalName ? professionalName.charAt(0) : "P"}
                </span>
              </div>
            )}
            <span className="text-xs sm:text-sm font-medium text-[#142237]">
              {professionalName || t("service.serviceCard.professional")}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#E5181D]" />
            <span className="text-xs sm:text-sm">{location || t("service.serviceCard.location")}</span>
          </div>
        </div>
        
        <div className="flex flex-row-reverse">
          <a 
            href="#"
            onClick={handleConsultClick}
            className="bg-[#E5181D] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center w-full sm:w-auto sm:min-w-[120px] hover:bg-[#c41419] transition-colors"
          >
            {t("service.serviceCard.contactButton")} <CircleChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );

  if (view === 'grid') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden m-2 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] flex flex-col hover:shadow-lg transition-shadow"> 
          <div className="w-full h-48 sm:h-56 overflow-hidden">
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5181D]"></div>
              </div>
            ) : (
              <img 
                src={imageSource}
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={handleImageError}
              />
            )}
          </div>
          <div className="p-4 flex-grow flex flex-col">
            {commonContent}
          </div>
        </div>
        <AuthModal />
      </>
    );
  } else {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row m-2 hover:shadow-lg transition-shadow"> 
          <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5181D]"></div>
              </div>
            ) : (
              <img 
                src={imageSource}
                alt={title} 
                className="w-full h-full object-cover sm:h-auto"
                onError={handleImageError}
              />
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col">
            {commonContent}
          </div>
        </div>
        <AuthModal />
      </>
    );
  }
};

export default ServiceCard;
