import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import { MapPin, X, Mail, Globe, Phone, User, Facebook, Instagram } from 'lucide-react';
// Import icons for service states
import { FaCircleCheck, FaCirclePause, FaCircleXmark } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { getServiceById, consultService, getAllImagesForService, getServicesByCategory } from '../../../Services/serviceService';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { AuthContext } from '../../../Context/AuthContext'; // Import AuthContext

// Import components
import ServiceImageGallery from "./components/ServiceImageGallery";
import ServiceInfo from "./components/ServiceInfo";
import OwnerInfo from "./components/OwnerInfo";
import SimilarServices from "./components/SimilarServices";
import ServiceNotFound from "./components/ServiceNotFound";
import serviceDetailsContent from '@config/content/serviceDetailsContent.js'; // Import the content

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // Initialize translation hook
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceImages, setServiceImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarServices, setSimilarServices] = useState([]);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState(null);
  const [componentErrors, setComponentErrors] = useState({});
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [previousAuthState, setPreviousAuthState] = useState(!!localStorage.getItem('token')); // Track auth state

  // Monitor authentication state changes
  useEffect(() => {
    const currentAuthState = !!localStorage.getItem('token');
    
    // If user was previously authenticated but now is not, redirect to home
    if (previousAuthState && !currentAuthState) {
      navigate('/', { replace: true });
      toast.info("Vous avez été déconnecté. Redirection vers la page d'accueil.");
    }
    
    // Update previous auth state
    setPreviousAuthState(currentAuthState);
  }, [user, navigate]); // Depend on user from AuthContext to detect changes

  // Rest of the component remains the same
  const content = {
    navigation: {
      backButton: t('serviceDetails.navigation.backButton'),
      backToServices: t('serviceDetails.navigation.backToServices')
    },
    serviceInfo: {
      price: t('serviceDetails.serviceInfo.price'),
      category: t('serviceDetails.serviceInfo.category'),
      location: t('serviceDetails.serviceInfo.location'),
      createdOn: t('serviceDetails.serviceInfo.createdOn'),
      verified: t('serviceDetails.serviceInfo.verified'),
      notVerified: t('serviceDetails.serviceInfo.notVerified'),
      addToWishlist: t('serviceDetails.serviceInfo.addToWishlist'),
      removeFromWishlist: t('serviceDetails.serviceInfo.removeFromWishlist'),
      wishlistAdded: t('serviceDetails.serviceInfo.wishlistAdded'),
      wishlistRemoved: t('serviceDetails.serviceInfo.wishlistRemoved'),
      contactOwner: t('serviceDetails.serviceInfo.contactOwner'),
      description: t('serviceDetails.serviceInfo.description'),
      address: t('serviceDetails.serviceInfo.address'),
      noDescription: t('serviceDetails.serviceInfo.noDescription')
    },
    ownerInfo: {
      title: t('serviceDetails.ownerInfo.title'),
      contactInfo: t('serviceDetails.ownerInfo.contactInfo'),
      email: t('serviceDetails.ownerInfo.email'),
      phone: t('serviceDetails.ownerInfo.phone'),
      address: t('serviceDetails.ownerInfo.address'),
      website: t('serviceDetails.ownerInfo.website'),
      description: t('serviceDetails.ownerInfo.description'),
      viewProfileButton: t('serviceDetails.ownerInfo.viewProfileButton'),
      verifiedProvider: t('serviceDetails.ownerInfo.verifiedProvider'),
      defaultDescription: t('serviceDetails.ownerInfo.defaultDescription')
    },
    similarServices: {
      title: t('serviceDetails.similarServices.title'),
      viewButton: t('serviceDetails.similarServices.viewButton'),
      verified: t('serviceDetails.similarServices.verified'),
      locationNotSpecified: t('serviceDetails.similarServices.locationNotSpecified'),
      noImageAvailable: t('serviceDetails.similarServices.noImageAvailable')
    },
    imageGallery: {
      noImagesAvailable: t('serviceDetails.imageGallery.noImagesAvailable'),
      previousImage: t('serviceDetails.imageGallery.previousImage'),
      nextImage: t('serviceDetails.imageGallery.nextImage')
    },
    contactPopup: {
      title: t('serviceDetails.contactPopup.title'),
      nameLabel: t('serviceDetails.contactPopup.nameLabel'),
      emailLabel: t('serviceDetails.contactPopup.emailLabel'),
      messageLabel: t('serviceDetails.contactPopup.messageLabel'),
      sendButton: t('serviceDetails.contactPopup.sendButton'),
      cancelButton: t('serviceDetails.contactPopup.cancelButton'),
      successMessage: t('serviceDetails.contactPopup.successMessage'),
      errorMessage: t('serviceDetails.contactPopup.errorMessage')
    },
    serviceNotFound: {
      title: t('serviceDetails.serviceNotFound.title'),
      message: t('serviceDetails.serviceNotFound.message'),
      viewAllServices: t('serviceDetails.serviceNotFound.viewAllServices'),
      backButton: t('serviceDetails.serviceNotFound.backButton')
    },
    states: {
      loading: t('serviceDetails.states.loading'),
      error: t('serviceDetails.states.error'),
      serviceNotFound: t('serviceDetails.states.serviceNotFound'),
      componentError: t('serviceDetails.states.componentError')
    }
  };

  // Define API URL - use import.meta.env for Vite projects
  const API_URL = import.meta.env.VITE_API_URL || 'https://komitabackend.onrender.com/api/v1';

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]); // Re-run when service ID changes

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Add function to record consultation
  const recordConsultation = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Make direct API call to ensure it's working
      const response = await axios.post(
        `${API_URL}/consultations/${serviceId}/consult`,
        null, // No need to send user data, backend will handle it
        { headers }
      );
      
      console.log("Consultation recorded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error recording consultation:", error);
      throw error;
    }
  };

  // Check if components exist
  useEffect(() => {
    const components = {
      ServiceImageGallery,
      ServiceInfo,
      OwnerInfo,
      SimilarServices,
      ServiceNotFound
    };
    
    const errors = {};
    Object.entries(components).forEach(([name, component]) => {
      if (!component) {
        errors[name] = `Component ${name} is not properly imported`;
        console.error(`Component ${name} is not properly imported`);
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setComponentErrors(errors);
    }
  }, []);

  useEffect(() => {
    // Fetch service details
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching service with ID:", id);
        
        // Get service details
        const serviceData = await getServiceById(id);
        console.log("Service data received:", serviceData);
        setService(serviceData);
        
        // Fetch service images
        try {
          const images = await getAllImagesForService(id);
          console.log("Service images received:", images);
          setServiceImages(images || []);
        } catch (imageError) {
          console.error("Error fetching service images:", imageError);
          setError(serviceDetailsContent.states.error);
        }
        
        // Check if owner data is available in the service data
        if (serviceData.professional) {
          console.log("Owner information from professional:", serviceData.professional);
          setOwner(serviceData.professional);
        } else if (serviceData.user) {
          console.log("Owner information from user:", serviceData.user);
          setOwner(serviceData.user);
        } else {
          // If owner data is not in the expected location, check other properties
          console.log("Owner not found in standard properties, checking alternatives");
          
          // Check if owner might be in a different property
          const possibleOwner = serviceData.owner || serviceData.provider;
          if (possibleOwner) {
            console.log("Found owner in alternative property:", possibleOwner);
            setOwner(possibleOwner);
          } else {
            // Create a mock owner for testing if none is found
            console.log("No owner found, using current user as owner");
            // Try to get current user info from localStorage or context
            const currentUser = JSON.parse(localStorage.getItem('user')) || {};
            setOwner(currentUser);
          }
        }
        
        // Fetch similar services based on category
        if (serviceData.category) {
          try {
            console.log("Fetching similar services for category:", serviceData.category.id);
            const similar = await getServicesByCategory(serviceData.category.id);
            console.log("Similar services received:", similar);
            
            // Filter out the current service and limit to 3
            const filteredSimilar = similar
              .filter(s => s.id !== serviceData.id)
              .slice(0, 3);
            
            console.log("Filtered similar services:", filteredSimilar);
            setSimilarServices(filteredSimilar);
            
           
          } catch (similarError) {
            console.error("Error fetching similar services:", similarError);
            // Create mock similar services on error
            console.log("Error fetching similar services, creating mock data");
            const mockSimilarServices = [
              {
                id: 201,
                name: serviceData.category.name + " - Service alternatif",
                imageId: serviceData.imageId,
                verified: true,
                adress: { city: "Montreal", zipCode: "H2Z 2Y7" },
                user: { firstName: "Backup", lastName: "Provider" }
              }
            ];
            setSimilarServices(mockSimilarServices);
          }
        } else {
          console.log("No category found for service, creating mock similar services");
          // Create mock similar services if no category
          const mockSimilarServices = [
            {
              id: 301,
              name: "Service similaire par défaut",
              imageId: serviceData.imageId,
              verified: true,
              adress: { city: "Montreal", zipCode: "H2Z 2Y7" },
              user: { firstName: "Default", lastName: "Provider" }
            }
          ];
          setSimilarServices(mockSimilarServices);
        }
        
        // Record consultation only if authenticated and not already recorded
        // Check if consultation was already recorded (passed from ServiceCard)
        // In the fetchServiceDetails function:
        
        // Record consultation only if not already recorded
        const consultationAlreadyRecorded = location.state?.consultationRecorded === true;
        
        if (!consultationAlreadyRecorded) {
          try {
            await consultService(id);
            console.log("Consultation recorded in ServiceDetails");
          } catch (consultError) {
            console.error("Error recording consultation:", consultError);
            // Continue showing the service even if consultation recording fails
          }
        } else {
          console.log("Consultation already recorded, skipping");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setError(serviceDetailsContent.states.error);
        toast.error(serviceDetailsContent.states.error);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, location.state]);

  const handleImageNavigation = (index) => {
    setCurrentImageIndex(index);
  };

  const addToWishlist = () => {
    toast.success(serviceDetailsContent.serviceInfo.wishlistAdded);
    // Implement wishlist functionality here
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (Object.keys(componentErrors).length > 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <h2>{serviceDetailsContent.states.componentError}:</h2>
        <ul>
          {Object.values(componentErrors).map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E5181D]"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">{content.states.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Error')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#E5181D] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {content.navigation.backButton}
          </button>
        </div>
      </div>
    );
  }

  // Fonction pour ouvrir/fermer le popup
  const toggleContactPopup = () => {
    setShowContactPopup(!showContactPopup);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {service ? (
        <>
          {/* Main service details */}
          <div className="container mx-auto px-8 pt-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex gap-4">
                {/* Left side - Image Gallery */}
                <div className="md:w-1/2 p-4">
                  <ServiceImageGallery 
                    images={serviceImages} 
                    currentIndex={currentImageIndex} 
                    onImageChange={handleImageNavigation} 
                  />
                </div>
                
                {/* Right side - Service Info with integrated owner info */}
                <div className="md:w-1/2 h-fit p-6">
                  {/* Add service name and state indicator at the top */}
                  <div className="flex items-center gap-2 mb-4">
                    {/* <h1 className="text-2xl font-bold text-[#142237]">
                      {service.name}
                    </h1> */}
                  </div>
                  
                  <ServiceInfo 
                    service={service} 
                    state={service.state}
                    owner={owner} 
                    formatDate={formatDate} 
                    content={content.serviceInfo} 
                  />

                  
                  
                  {/* Contact button and return button in a flex container */}
                  {owner && (
                    <div className="mt-2 flex items-center justify-between">
                      {/* Social media icons moved to right side, above the buttons */}
                  {service.links && (
                    <div className="flex items-center justify-end gap-3 mt-4 mb-4">
                      {service.links.websiteURL && (
                        <a 
                          href={service.links.websiteURL.startsWith('http') ? service.links.websiteURL : `https://${service.links.websiteURL}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#142237] text-white p-3 rounded-xl hover:bg-[#E5181D] transition-colors transform hover:scale-110"
                          title="Site web"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                      {service.links.facebookURL && (
                        <a 
                          href={service.links.facebookURL.startsWith('http') ? service.links.facebookURL : `https://${service.links.facebookURL}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#142237] text-white p-3 rounded-xl hover:bg-[#E5181D] transition-colors transform hover:scale-110"
                          title="Facebook"
                        >
                          <Facebook size={20} />
                        </a>
                      )}
                      {service.links.instagramURL && (
                        <a 
                          href={service.links.instagramURL.startsWith('http') ? service.links.instagramURL : `https://${service.links.instagramURL}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#142237] text-white p-3 rounded-xl hover:bg-[#E5181D] transition-colors transform hover:scale-110"
                          title="Instagram"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                    </div>
                  )}

                      <button 
                        onClick={toggleContactPopup}
                        className="bg-[#E5181D] text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        {t("serviceDetails.serviceInfo.contactOwner")}

                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Similar services - keep this section */}
          {similarServices.length > 0 && (
            <div className="bg-gray-50 py-8">
              <div className="container mx-auto px-8">
                <SimilarServices 
                  services={similarServices}
                  content={t("serviceDetails.similarServices")}
                />
              </div>
            </div>
          )}
          
          {/* Popup de contact du prestataire */}
          {showContactPopup && owner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                <button 
                  onClick={toggleContactPopup}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 flex items-center justify-center">
                    {owner.profileImage ? (
                      <img 
                        src={typeof owner.profileImage === 'string' && owner.profileImage.startsWith('/9j/') 
                          ? `data:image/jpeg;base64,${owner.profileImage}`
                          : `https://komitabackend.onrender.com/api/v1/images/${owner.profileImage}/data`
                        }
                        alt={owner.firstname || owner.firstName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <User size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#142237]">
                      {owner.firstname || owner.firstName} {owner.lastname || owner.lastName}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {content.ownerInfo.verifiedProvider}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{content.ownerInfo.address}</p>
                      <p className="text-gray-800 font-medium">
                        {service.adress ? 
                          `${service.adress.city}, ${service.adress.provinceName} ${service.adress.postalCode}` : 
                          content.ownerInfo.defaultAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{content.ownerInfo.email}</p>
                      <p className="text-gray-800 font-medium">{owner.email || content.ownerInfo.defaultEmail}</p>
                    </div>
                  </div>

                  {owner.phoneNumber && 
                  <div className="flex items-start">
                  <Phone size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
                  <div>
                      <p className="text-sm text-gray-500 font-medium">{content.ownerInfo.phone}</p>
                      <p className="text-gray-800 font-medium">{owner.phoneNumber || '+1 (514) 123-4567' }</p>
                    </div>
                  </div>

                  }
                  
                  {service.links && service.links.websiteURL && (
                    <div className="flex items-start">
                      <Globe size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{content.ownerInfo.website}</p>
                        <a 
                          href={service.links.websiteURL.startsWith('http') ? service.links.websiteURL : `https://${service.links.websiteURL}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {service.links.websiteURL}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a 
                    href={`mailto:${owner.email}`}
                    className="block w-full bg-[#E5181D] text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    {content.contactPopup.sendButton}
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ServiceNotFound message={content.states.serviceNotFound} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetails;

// Move the ServiceStateIndicator component inside the main component
// so it has access to the t function
export const ServiceStateIndicator = ({ state }) => {
  const {t} = useTranslation();
  if (!state) return null;
  
  let icon, color, label;
  
  switch(state) {
    case 'ACTIVE':
      icon = <FaCircleCheck className="w-4 h-4" />;
      color = "text-green-600 bg-green-50";
      label = t('serviceDetails.serviceInfo.stateActive', 'Active');
      break;
    case 'INACTIVE':
      icon = <FaCircleXmark className="w-4 h-4" />;
      color = "text-red bg-red";
      label = t('serviceDetails.serviceInfo.stateInactive', 'Inactive');
      break;
    case 'SUSPENDED':
      icon = <FaCirclePause className="w-4 h-4" />;
      color = "text-amber-500 bg-amber-50";
      label = t('serviceDetails.serviceInfo.stateSuspended', 'Suspended');
      break;
    default:
      return null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${color}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};