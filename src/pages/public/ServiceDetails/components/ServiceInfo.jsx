import React from 'react';
import { Globe, Facebook, Instagram, User } from 'lucide-react';
import { ServiceStateIndicator } from '../ServiceDetails';

const ServiceInfo = ({ service, state, owner, formatDate, content }) => {
  return (
    <div>
      <div className="mb-4">
        {/* Header with service name, state and date aligned */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#142237]">{service.name} <ServiceStateIndicator state={service.state} />
            </h1>
          </div>
          <span className="text-gray-400 text-sm">{formatDate(service.createdAt)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {service.category && (
            <span className="bg-[#142237] text-white text-xs px-2 py-0.5 rounded">
              {service.category.name}
            </span>
          )}
          {service.subcategory && (
            <span className="bg-[#E5E9EB] text-[#142237] text-xs px-2 py-0.5 rounded">
              {service.subcategory.name}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-[#142237]">{content.description} :</h2>
        <p className="text-gray-600 whitespace-pre-line">
          {service.description || content.noDescription}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-[#142237]">{content.address} :</h2>
        <p className="text-gray-600">
          {service.adress ? 
            `${service.adress.streetNumber} ${service.adress.streetName}, ${service.adress.city}, ${service.adress.provinceName} ${service.adress.postalCode}` : 
            'MONTREAL, QC H2Z 2Y7'}
        </p>
      </div>

      {/* Affichage du prestataire si disponible */}
      {/* {owner && (
        <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center">
            <User size={20} className="text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-[#142237]">
              {owner.firstname || owner.firstName} {owner.lastname || owner.lastName}
            </p>
            <p className="text-xs text-gray-500">{content.verifiedProvider || "Prestataire vérifié"}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ServiceInfo;