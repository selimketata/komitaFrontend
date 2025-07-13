import React from "react";
import { Edit, Trash2, Check, User, X } from "lucide-react";
import { FaCircleCheck, FaCirclePause, FaCircleXmark } from "react-icons/fa6";

const ServiceTable = ({ 
  services, 
  handleViewService, 
  handleDelete, 
  switchToForm, 
  handleValidateService,
  navigateToUser, 
}) => {
  // Add a check to ensure services is an array before rendering
  const validServices = Array.isArray(services) ? services : [];

  // Service state component
  const ServiceStateIndicator = ({ state }) => {
    let icon, color, label;
    
    switch(state) {
      case 'ACTIVE':
        color = "text-green-600 border border-green-600 rounded-xl text-center px-4 py-1";
        label = "Active";
        break;
      case 'INACTIVE':
        color = "text-amber-500 border border-amber-500 rounded-xl text-center px-2 py-1";
        label = "Inactive";
        break;
      case 'SUSPENDED':
        color = "text-red-600 border border-red-600 rounded-xl text-center px-1 py-1";
        label = "Suspended";
        break;
      default:
        color = "text-gray-400 border rounded-xl text-center px-4 py-1";
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
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-gray border-b bg-[#D9D9D9]">
            <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Name</th>
            <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Description</th>
            <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Category</th>
            <th className="w-[10%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Status</th>
            <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Professional</th>
            <th className="w-[20%] pl-[10%] py-4 text-left text-sm font-semibold text-[#142237]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {validServices.map((service) => (
            <tr 
              key={service.id} 
              className={`hover:bg-[#F0F0F0] hover:shadow-md transition-all duration-200`}
              onClick={() => handleViewService(service)}
            >
              <td className="px-6 py-4 text-sm font-medium">{service.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="line-clamp-2 hover:line-clamp-none transition-all duration-300" title={service.description}>
                  {service.description}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{service.category?.name || 'No Category'}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex flex-col gap-1">
                  {/* Add service state indicator */}
                  <ServiceStateIndicator state={service.state || 'INACTIVE'} />
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex items-center gap-2">
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
              </td>
              <td className="pl-[10%] py-4">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(service.id);
                    }}
                    className="text-[#E5181D] hover:bg-red-50 rounded-lg transition-colors duration-200"
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
                    className="text-[#142237] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit Service"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`${service.state ? 'text-green-600' : 'text-red-600'} hover:bg-gray-50 rounded-lg transition-colors duration-200`}
                    title={service.state ? 'Deactivate' : 'Activate'}
                  >
                    {service.state ? 
                    (<Check className="w-5 h-5" />):
                    (<X className="w-5 h-5" />)}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;