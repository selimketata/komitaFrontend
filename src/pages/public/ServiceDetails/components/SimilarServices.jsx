import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Check } from 'lucide-react';

function SimilarServices({ services, content }) {
  // Track which images have already failed to prevent infinite loops
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (serviceId, e) => {
    // Only set default image if this is the first failure for this service
    if (!failedImages[serviceId]) {
      e.target.onerror = null; // Prevent further error callbacks
      e.target.src = '/assets/default-image.png';
      // Mark this image as failed
      setFailedImages(prev => ({...prev, [serviceId]: true}));
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-[#142237]">
        {content?.title || 'Services similaires'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={failedImages[service.id] ? '/assets/default-image.png' : 
                     (service.images && service.images.length > 0 ? 
                      `http://localhost:8085/api/v1/images/${service.images[0].id}/data` : 
                      '/assets/default-image.png')}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(service.id, e)}
              />
              {service.verified && (
                <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Check size={12} className="mr-1" />
                  {content?.verified || 'Vérifié'}
                </span>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-[#142237] mb-2">{service.name}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={16} className="mr-1 text-[#E5181D] flex-shrink-0" />
                <span className="text-sm">
                  {service.adress ? 
                    `${service.adress.city}, ${service.adress.postalCode}` : 
                    content?.locationNotSpecified || 'MONTREAL, QC H2Z 2Y7'}
                </span>
              </div>
              
              {service.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
              )}
              
              <Link 
                to={`/service/${service.id}`}
                className="mt-2 inline-block text-white bg-[#E5181D] hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors font-medium"
              >
                {content?.viewButton || 'Consulter'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarServices;