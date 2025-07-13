import React from 'react';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServiceCard = ({ 
    id, 
    view, 
    title, 
    description, 
    keywords, 
    location, 
    imageId, 
    date, 
    category, 
    subcategory,
    primaryImageId,
    professionalName,
    professionalProfileImage,
    service // Add this to receive the full service object
}) => {
    // Determine the image URL with proper fallbacks
    const getImageUrl = () => {
        // If we have the full service object
        if (service) {
            if (service.images && service.images.length > 0) {
                return `http://localhost:8085/api/v1/images/${service.images[0].id}/data`;
            }
        }
        
        // Otherwise use the props passed individually
        if (imageId) {
            return `http://localhost:8085/api/v1/images/${imageId}/data`;
        }
        
        if (primaryImageId) {
            return `http://localhost:8085/api/v1/images/${primaryImageId}/data`;
        }
        
        // Default image as fallback
        return '/assets/default-image.png';
    };

    // Grid view card
    if (view === 'grid') {
        return (
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                        <img 
                            src={getImageUrl()}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/default-image.png';
                            }}
                        />
                        <div className="absolute top-0 left-0 bg-[#E5181D] text-white text-xs px-2 py-1 m-2 rounded">
                            {category}
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-xs text-gray-500">
                                <MapPin size={14} className="mr-1" />
                                <span>{location || t("service.serviceCard.location")}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>{date}</span>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
                        
                        {keywords && (
                            <div className="flex items-start mb-3">
                                <Tag size={14} className="mr-1 mt-1 text-gray-400 shrink-0" />
                                <p className="text-xs text-gray-500 line-clamp-1">{keywords}</p>
                            </div>
                        )}
                        
                        <div className="mt-auto pt-3 border-t flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                                    {professionalProfileImage ? (
                                        <img 
                                            src={`http://localhost:8085/api/v1/images/${professionalProfileImage}/data`} 
                                            alt={professionalName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/assets/default-profile.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                            {professionalName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{professionalName || t("service.serviceCard.professional")}</span>
                            </div>
                            <Link 
                                to={`/service/${id}`}
                                className="text-xs text-[#E5181D] hover:underline"
                            >
                                {t("service.serviceCard.viewDetails")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // List view card
    return (
        <div className="w-full p-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 overflow-hidden relative">
                        <img 
                            src={getImageUrl()}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/default-image.png';
                            }}
                        />
                        <div className="absolute top-0 left-0 bg-[#E5181D] text-white text-xs px-2 py-1 m-2 rounded">
                            {category}
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-xs text-gray-500">
                                <MapPin size={14} className="mr-1" />
                                <span>{location || t("service.serviceCard.location")}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>{date}</span>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{title}</h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>
                        
                        {keywords && (
                            <div className="flex items-start mb-3">
                                <Tag size={14} className="mr-1 mt-1 text-gray-400 shrink-0" />
                                <p className="text-xs text-gray-500">{keywords}</p>
                            </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                                    {professionalProfileImage ? (
                                        <img 
                                            src={`http://localhost:8085/api/v1/images/${professionalProfileImage}/data`} 
                                            alt={professionalName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/assets/default-profile.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                            {professionalName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{professionalName || t("service.serviceCard.professional")}</span>
                            </div>
                            <Link 
                                to={`/service/${id}`}
                                className="text-xs text-[#E5181D] hover:underline"
                            >
                                {t("service.serviceCard.viewDetails")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;