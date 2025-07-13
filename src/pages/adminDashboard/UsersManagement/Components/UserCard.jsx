import React from 'react';
import { Edit, Trash2, Briefcase } from 'lucide-react';

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onViewServices,
  onUpgradeRole,
  onEmailClick,
  formatAddress
}) => {
  return (
    <div className="p-4 border-b border-gray-200 hover:bg-[#F0F0F0] transition-all duration-200">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-[#142237]">{user.firstname} {user.lastname}</p>
            <p 
              className="text-sm text-gray-600 max-w-[200px] truncate cursor-pointer hover:text-[#142237]" 
              onClick={() => onEmailClick(user.email)}
            >
              {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="text-[#142237] hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit User"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="text-[#E5181D] hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete User"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-gray-600 truncate max-w-[250px]" title={formatAddress(user.userAddress)}>
            {formatAddress(user.userAddress)}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-[#142237]">{user.role}</span>
            <div className="flex gap-2">
              {user.role === 'PROFESSIONAL' && (
                <button
                  onClick={() => onViewServices(user.id)}
                  className="text-black hover:bg-green rounded-lg transition-colors duration-200"
                  title="View Services"
                >
                  <Briefcase className="w-5 h-5" />
                </button>
              )}
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => onViewServices(user.id)}
                  className="text-black hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="View Services"
                >
                  <Briefcase className="w-5 h-5" />
                </button>
              )}
              {user.role === 'STANDARD_USER' && (
                <button
                  onClick={() => onUpgradeRole(user.id)}
                  className="text-[#142237] hover:bg-green-50 rounded-lg transition-colors duration-200 px-2 text-sm"
                  title="Upgrade to Professional"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard; 