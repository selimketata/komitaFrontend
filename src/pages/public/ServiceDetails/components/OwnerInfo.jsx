import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

function OwnerInfo({ owner, content }) {
  const [imageError, setImageError] = useState(false);

  // Handle profile image source based on format
  const getProfileImageSrc = () => {
    if (imageError) {
      return '/default-avatar.png';
    }
    
    if (!owner.profileImage) {
      return '/default-avatar.png';
    }
    
    // Check if it's a base64 string
    if (typeof owner.profileImage === 'string') {
      // Check if it starts with a slash and appears to be a base64 image
      if (owner.profileImage.startsWith('/9j/')) {
        return `data:image/jpeg;base64,${owner.profileImage}`;
      }
      
      // Check if it's already a complete data URL
      if (owner.profileImage.startsWith('data:')) {
        return owner.profileImage;
      }
      
      // Otherwise assume it's an image ID
      return `https://komitabackend.onrender.com/api/v1/images/${owner.profileImage}/data`;
    }
    
    // Otherwise assume it's an image ID
    return `https://komitabackend.onrender.com/api/v1/images/${owner.profileImage}/data`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-100">
        {content?.title || 'À propos du prestataire'}
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white shadow-md">
            <img 
              src={getProfileImageSrc()} 
              alt={owner.firstName}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">
            {owner.firstName} {owner.lastName}
          </h3>
          <div className="flex items-center justify-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              Prestataire vérifié
            </span>
          </div>
          <Link 
            to={`/profile/${owner.id}`}
            className="w-full bg-[#E5181D] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-center font-medium"
          >
            {content?.viewProfileButton || 'Voir profil'}
          </Link>
        </div>
        
        <div className="md:w-3/4">
          <p className="text-gray-700 mb-6 leading-relaxed">
            {owner.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a commodo nibh. Sed egestas a velit id egestas. Nulla facilisi. Praesent fermentum, nisi in vehicula facilisis, nulla orci fermentum nisi, id aliquet risus mauris eget justo.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <MapPin size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{content?.addressLabel || 'Adresse'}</p>
                <p className="text-gray-800 font-medium">{owner.address || 'MONTREAL, QC H2Z 2Y7'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{content?.phoneLabel || 'Téléphone'}</p>
                <p className="text-gray-800 font-medium">{owner.phone || '+1 (514) 123-4567'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{content?.emailLabel || 'Email'}</p>
                <p className="text-gray-800 font-medium">{owner.email || 'contact@example.com'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Globe size={20} className="mr-3 text-[#E5181D] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{content?.websiteLabel || 'Site web'}</p>
                <p className="text-gray-800 font-medium">{owner.website || 'www.example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OwnerInfo;