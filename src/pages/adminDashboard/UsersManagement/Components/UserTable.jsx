import React from 'react';
import { Edit, Trash2, Briefcase } from 'lucide-react';

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onViewServices,
  onUpgradeRole,
  onEmailClick,
  formatAddress
}) => {
  console.log("users",users)
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-gray border-b bg-[#D9D9D9]">
            <th className="w-[26%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Email</th>
            <th className="w-[13%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">First Name</th>
            <th className="w-[13%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Last Name</th>
            <th className="w-[18%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Address</th>
            <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Role</th>
            <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-[#F0F0F0] hover:shadow-md transition-all duration-200">
              <td 
                className="px-6 py-4 text-sm font-medium max-w-[200px] truncate cursor-pointer hover:text-[#142237]" 
                onClick={() => onEmailClick(user.email)}
              >
                {user.email}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" title={user.firstname}>{user.firstname}</td>
              <td className="px-6 py-4 text-sm text-gray-900" title={user.lastname}>{user.lastname}</td>
              <td className="px-6 py-4 text-sm text-gray-900" title={formatAddress(user.userAddress || {})}>
                {formatAddress(user.userAddress || {})}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" title={user.role}>{user.role}</td>
              <td className="px-6 py-4">
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
                      className="text-[#142237] hover:bg-green-50 rounded-lg transition-colors duration-200 px-2"
                      title="Upgrade to Professional"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;