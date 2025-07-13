import React from "react";
import { Edit, Trash2, Check, User, X } from "lucide-react";
import { FaCircleCheck, FaCirclePause, FaCircleXmark } from "react-icons/fa6";

const ServiceCards = ({ 
  services, 
  handleViewService, 
  handleDelete, 
  switchToForm, 
  handleValidateService,
  navigateToUser 
}) => {
  // Add a check to ensure services is an array before rendering
  const validServices = Array.isArray(services) ? services : [];
  
  // Service state component
  const ServiceStateIndicator = ({ state }) => {
    let icon, color, label;
    
    switch(state) {
      case 'ACTIVE':
        icon = <FaCircleCheck className="w-4 h-4" />;
        color = "text-green-600";
        label = "Active";
        break;
      case 'INACTIVE':
        icon = <FaCirclePause className="w-4 h-4" />;
        color = "text-amber-500";
        label = "Inactive";
        break;
      case 'SUSPENDED':
        icon = <FaCircleXmark className="w-4 h-4" />;
        color = "text-red-600";
        label = "Suspended";
        break;
      default:
        icon = <FaCirclePause className="w-4 h-4" />;
        color = "text-gray-400";
        label = "Unknown";
    }
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  };
  
  return (
    <div className="md:hidden">
      <div className="space-y-4">
        {validServices.map((service) => (
          <div 
            key={service.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleViewService(service)}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#142237]">{service.name}</h3>
                <div className="flex flex-col gap-1">
                  
                  {/* Add service state indicator */}
                  <ServiceStateIndicator state={service.state || 'INACTIVE'} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{service.category?.name || 'No Category'}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                <span>{service.professional?.firstname || ''} {service.professional?.lastname || ''}</span>
                {service.professional && (
                  <button
                    onClick={(e) => navigateToUser(e, service.professional.id)}
                    className="text-[#142237] hover:bg-blue-50 rounded-lg p-1"
                    title="View Professional"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-700 line-clamp-2">{service.description}</p>
            </div>
            
            <div className="p-4 border-t bg-white">
              <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(service.id);
                  }}
                  className="text-[#E5181D] hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                  title="Delete Service"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    switchToForm(true);
                    handleViewService(service);
                  }}
                  className="text-[#142237] hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
                  title="Edit Service"
                >
                  <Edit className="w-5 h-5" />
                </button>
                
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;