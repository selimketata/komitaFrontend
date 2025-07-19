import React, { useState, useContext, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2, Plus, X, Briefcase } from "lucide-react";
import ReactModal from "react-modal";
import { AuthContext } from "./../../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  updateUserRole,
  uploadProfileImage
} from "../../../Services/userService";
import AddressForm from "./Components/AddressForm";
import PersonalInfoForm from "./Components/PersonalInfoForm";
import Pagination from "./Components/Pagination";
import EmailTooltip from "./Components/EmailTooltip";
import { formatAddress, parseStreetAddress } from "./utils";
import UserTable from "./Components/UserTable";
import UserCard from "./Components/UserCard";


// Set the app element for React Modal
ReactModal.setAppElement('#root');



const modalStyles = {
  overlay: {
    backgroundColor: "rgba(20, 34, 55, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "99",
    padding: "1rem",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  content: {
    position: 'relative',
    inset: 'auto',
    border: "none",
    background: "white",
    overflow: "hidden",
    borderRadius: "16px",
    outline: "none",
    padding: "0",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    maxHeight: "90vh",
    height: "90vh",
    width: "95%",
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
};



const UserForm = ({ mode = 'add', userData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    ...userData,
    userAddress: {
      streetNumber: userData.userAddress?.streetNumber || 0,
      streetName: userData.userAddress?.streetName || "",
      streetType: userData.userAddress?.streetType || "",
      provinceName: userData.userAddress?.provinceName || "",
      postalCode: userData.userAddress?.postalCode || "",
      city: userData.userAddress?.city || "",
      country: userData.userAddress?.country || ""
    }
  });

  console.log("userData", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parent === 'userAddress' && child === 'streetNumber' ? 
            (value === '' ? 0 : parseInt(value)) : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header - Fixed at top */}
      <div className="flex justify-between items-center px-6 py-4 bg-white">
        <h2 className="text-2xl font-bold text-[#142237]">{mode === 'add' ? 'New User' : 'Edit User'}</h2>
            <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <PersonalInfoForm 
            userData={formData} 
            onChange={handleChange}
            showPassword={mode === 'add'} 
          />
          <AddressForm 
            userAddress={formData.userAddress} 
            onChange={handleChange}
            mode={mode} 
          // Ensure AddressForm handles the new address structure
          />
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex justify-end gap-3 px-6 py-4 bg-white border-t">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
          onClick={() => onSubmit(formData)}
          className="px-6 py-2.5 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200 font-medium"
            >
          {mode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </div>
  );
};

const AddUser = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const initialFormData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phoneNumber: "",
    userAddress: {
      streetNumber: 0,
      streetName: "",
      streetType: "",
      provinceName: "",
      postalCode: "",
      city: "",
      country: ""
    },
    role: "STANDARD_USER",
  };

  // Remove this duplicate declaration
  // userAddress: {
  //     streetNumber: 0,
  //     streetName: "string",
  //     streetType: "string",
  //     provinceName: "string",
  //     postalCode: "string",
  //     city: "string",
  //     country: "string"
  //   },

  const handleAdd = async (formData) => {
    try {
      await addUser(formData);
      toast.success('User added successfully');
      onAdd();
      setOpen(false);
    } catch (error) {
      toast.error('Error adding user: ' + error.message);
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200 shadow-md"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">New User</span>
      </button>
      <ReactModal
        isOpen={open}
        style={modalStyles}
        className="w-[90%] max-w-5xl"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <UserForm
          mode="add"
          userData={initialFormData}
          onSubmit={handleAdd}
          onCancel={() => setOpen(false)}
        />
      </ReactModal>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [tooltipEmail, setTooltipEmail] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(users.length / itemsPerPage));
  }, [users]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Error fetching users: ' + error.message);
    }
  };

  const navigateToServices = () => {
    navigate('/admin/services-management', { 
      state: { 
        activeSection: 'services'
      },
      replace: true
    });
  };

  // Get current users for pagination
  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    // Sort users by ID in descending order (newest first)
    const sortedUsers = [...users].sort((a, b) => b.id - a.id);
    return sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (user?.role !== "ADMIN") {
      return (
        <div className="flex justify-center items-center w-full bg-gray-100 absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className="bg-red-600 text-black p-8 rounded-lg shadow-lg text-center w-1/2 sm:w-1/3">
            <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg">You do not have the required permissions to view this page.</p>
          <Link to="/login">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 text-white bg-red rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Login
            </button>
          </Link>
          </div>
        </div>
      );
    }
  
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error deleting user: ' + error.message);
    }
  };

  const handleAddUser = async () => {
    await fetchUsers();
  };

  const handleEmailClick = (email) => {
    setTooltipEmail(email);
    setShowEmailTooltip(true);
  };

  const openEditModal = (user) => {
    const { streetNumber, streetName, streetType } = parseStreetAddress(user.userAddress?.street || '');
    console.log("address data", user.userAddress);
    const preparedUser = {
      ...user,
      userAddress: {
        streetNumber: streetNumber || '',
        streetName: streetName || '',
        streetType: streetType || '',
        provinceName: user.userAddress?.state || '', // Map state to provinceName
        postalCode: user.userAddress?.zipCode || '',  // Map zipCode to postalCode
        city: user.userAddress?.city || '',
        country: user.userAddress?.country || ''
      }
    };
    setSelectedUser(preparedUser);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      // Ensure streetNumber is a number before sending
      const preparedData = {
        ...formData,
        userAddress: {
          ...formData.userAddress,
          streetNumber: parseInt(formData.userAddress.streetNumber) || 0
        }
      };
      await updateUser(selectedUser.email, preparedData);
      toast.success('User updated successfully');
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error updating user: ' + error.message);
    }
  };

  const handleUpgradeRole = async (userId) => {
    try {
      await updateUserRole(userId);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user role: ' + error.message);
    }
  };

  const viewUserServices = (userId) => {
    navigate('/admin/services-management', { 
      state: { 
        professionalId: userId,
        fromUsers: true,
        activeSection: 'services'
      },
      replace: true
    });
  };

  return (
    <div className="p-4 font-calibri lg:w-[80vw] lg:p-8">
      <div className="flex flex-col h-full p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#142237] mb-4 lg:mb-0">User Management</h1>
          <AddUser onAdd={handleAddUser} />
        </div>

        <div className="flex-1 bg-white shadow-lg overflow-hidden">
          {/* Desktop View */}
          <UserTable
            users={getCurrentUsers()}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onViewServices={viewUserServices}
            onUpgradeRole={handleUpgradeRole}
            onEmailClick={handleEmailClick}
            formatAddress={formatAddress}
          />
          {/* Mobile View */}
          <div className="md:hidden">
            {getCurrentUsers().map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onViewServices={viewUserServices}
                onUpgradeRole={handleUpgradeRole}
                onEmailClick={handleEmailClick}
                formatAddress={formatAddress}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={users.length}
            itemsPerPage={itemsPerPage}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageChange={setCurrentPage}
          />
        </div>
        </div>

      {isModalOpen && selectedUser && (
        <ReactModal
          isOpen={isModalOpen}
          style={modalStyles}
          className="w-[90%] max-w-5xl"
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
        >
          <UserForm
            mode="edit"
            userData={selectedUser}
            onSubmit={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </ReactModal>
      )}

      {/* Email Tooltip Modal */}
      {showEmailTooltip && (
        <EmailTooltip
          email={tooltipEmail}
          onClose={() => setShowEmailTooltip(false)}
          isOpen={showEmailTooltip}
        />
      )}
    </div>
  );
};

export default UserManagement;
