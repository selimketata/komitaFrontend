import React, { useState, useContext, useEffect } from "react";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import ServiceForm from './components/ServiceForm';
import AddServiceButton from './components/AddServiceButton';
import ServiceTable from './components/ServiceTable';
import ServiceCards from './components/ServiceCards';
import AccessDenied from './components/AccessDenied';
import Pagination from './components/Pagination';
import {
  getAllServices,
  addService,
  updateService,
  deleteService,
  getAllCategories,
  getAllImagesForService,
  deleteImage,
  addImageToService
} from "../../../Services/serviceService";
import { getSubcategoriesByCategoryId } from "../../../Services/subCategoryService";
import { addUser, getUserByEmail } from "../../../Services/userService";
import {axiosInstanceWithToken} from "../../../api/axios";

function ServicesAdminManagement() {
  // 1. Context and routing hooks
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 2. State declarations
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormView, setIsFormView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [images, setImages] = useState([]);
  const [isNewProfessional, setIsNewProfessional] = useState(true);
  const [existingProfessionals, setExistingProfessionals] = useState([]);
  const [filteredProfessionalId, setFilteredProfessionalId] = useState(null);
  const [keywords, setKeywords] = useState("");
  const itemsPerPage = 10;

  // 3. Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    professional: {
      id: null,
      adress: {
        streetNumber: "",
        streetName: "",
        streetType: "",
        provinceName: "",
        postalCode: "",
        city: "",
        country: ""
      }, 
    },
    category: {
      id: 0,
      name: ""
    },
    subcategory: {
      id: 0,
      name: ""
    },
    state: true,
    keywordList: [],
    links: {
      facebookURL: "",
      instagramURL: "",
      websiteURL: ""
    },
    images: []
  });

  // 4. Function definitions
  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      toast.error('Error fetching services: ' + error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories: ' + error.message);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const data = await getSubcategoriesByCategoryId(categoryId);
      setSubcategories(data);
    } catch (error) {
      toast.error('Error fetching subcategories: ' + error.message);
    }
  };

  const fetchExistingProfessionals = async () => {
    try {
      const response = await axiosInstanceWithToken.get('/users');
      const professionals = response.data.filter(user => user.role === "PROFESSIONAL");
      setExistingProfessionals(professionals);
    } catch (error) {
      toast.error('Error fetching professionals: ' + error.message);
    }
  };

  // useEffect hooks
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        professional: {
          ...prev.professional,
          id: user.id
        }
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchExistingProfessionals();
  }, []);

  useEffect(() => {
    const state = location.state;
    if (state?.professionalId) {
      getAllServices().then(allServices => {
        const professionalServices = allServices.filter(service => 
          service.professional?.id === state.professionalId
        );
        setServices(professionalServices);
        setFilteredProfessionalId(state.professionalId);
        window.history.replaceState({}, document.title);
      }).catch(error => {
        toast.error('Error fetching services: ' + error.message);
      });
    }
  }, [location.state]);

  useEffect(() => {
    const state = location.state;
    if (state?.activeSection) {
      const event = new CustomEvent('updateActiveSection', { 
        detail: { section: state.activeSection } 
      });
      window.dispatchEvent(event);
    }
  }, [location.state]);

  useEffect(() => {
    setTotalPages(Math.ceil(services.length / itemsPerPage));
  }, [services]);

  useEffect(() => {
    if (formData.category?.id) {
      fetchSubcategories(formData.category.id);
    }
  }, [formData.category?.id]);

  // Authentication and role checks
  if (!user) {
    return (
      <div className="flex justify-center items-center w-full bg-gray-100">
        <p className="text-red-600">User not authenticated. Please log in.</p>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return <AccessDenied />;
  }

  // Form handling functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (child === 'streetNumber') {
        const numberValue = value === '' ? '' : parseInt(value, 10);
        if (numberValue < 0 || isNaN(numberValue)) return;
        
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: numberValue
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else if (name === 'category') {
      const selectedCategory = categories.find(cat => cat.id === parseInt(value));
      // Reset subcategory when category changes
      setFormData(prev => ({
        ...prev,
        category: selectedCategory || { id: 0, name: "" },
        subcategory: { id: 0, name: "" }
      }));
      // Fetch subcategories for the selected category
      if (selectedCategory) {
        fetchSubcategories(selectedCategory.id);
      } else {
        setSubcategories([]);
      }
    } else if (name === 'subcategory') {
      const selectedSubcategory = subcategories.find(sub => sub.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        subcategory: selectedSubcategory || { id: 0, name: "" }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleAddKeyword = () => {
    if (keywords.trim()) {
      const newKeyword = {
        keywordName: keywords.trim()
      };
      setFormData(prev => ({
        ...prev,
        keywordList: [...prev.keywordList, newKeyword]
      }));
      setKeywords("");
    }
  };

  const handleRemoveKeyword = (keywordIdentifier) => {
    setFormData(prev => ({
      ...prev,
      keywordList: prev.keywordList.filter((k) => {
        if (typeof k === 'string') {
          return k !== keywordIdentifier;
        } else if (k.keywordName) {
          return k.keywordName !== keywordIdentifier;
        }
        return true;
      })
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Vérifier que tous les fichiers sont des images
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error(`Les fichiers suivants ne sont pas des images: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Vérifier la taille des fichiers (5MB maximum)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Les fichiers suivants dépassent la taille maximale de 5MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    try {
      if (formData.id) {
        // Mode édition : ajouter les images directement au service
        for (const file of files) {
          await addImageToService(formData.id, file);
        }

        // Mettre à jour la liste des images
        const updatedImages = await getAllImagesForService(formData.id);
        setFormData(prev => ({
          ...prev,
          images: updatedImages
        }));

        toast.success('Images ajoutées avec succès');
      } else {
        // Mode création : stocker les images temporairement
        const newImagesWithPreviews = files.map(file => ({
          file: file,
          preview: URL.createObjectURL(file)
        }));
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImagesWithPreviews],
          newImages: [...(prev.newImages || []), ...files]
        }));
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout des images: ' + error.message);
    }

    // Réinitialiser l'input file
    e.target.value = '';
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Name and description are required');
      return;
    }
  
    if (!formData.category?.id) {
      toast.error('Category is required');
      return;
    }

    if (isNewProfessional && (!formData.professional?.email || !formData.professional?.password)) {
      toast.error('Professional email and password are required');
      return;
    }

    if (!isNewProfessional && !formData.professional?.id) {
      toast.error('Please select an existing professional');
      return;
    }
  
    try {
      let professionalId;
      
      if (isNewProfessional) {
        // Create new professional
        const professionalData = {
          firstname: formData.professional.firstname,
          lastname: formData.professional.lastname,
          email: formData.professional.email,
          customIdentifier: formData.professional.customIdentifier,
          password: formData.professional.password,
          status: formData.professional.status,
          role: "PROFESSIONAL",
          userAddress: formData.professional.userAddress || {}
        };

        await addUser(professionalData);
        const createdProfessional = await getUserByEmail(professionalData.email);
        professionalId = createdProfessional.id;
      } else {
        // Use existing professional
        professionalId = formData.professional.id;
      }

      // Create the service
      const serviceData = {
        name: formData.name,
        description: formData.description,
        professional: {
          id: professionalId
        },
        category: {
          id: formData.category.id
        },
        subcategory: formData.subcategory?.id ? {
          id: formData.subcategory.id
        } : null,
        state: formData.state === undefined ? true : formData.state,
        adress: formData.adress || {},
        links: formData.links || {},
        keywordList: formData.keywordList || []
      };

      // Create FormData for images
      const formDataToSend = new FormData();
      formDataToSend.append('service', JSON.stringify(serviceData));
      
      // Add images to FormData
      if (formData.newImages && formData.newImages.length > 0) {
        formData.newImages.forEach((file, index) => {
          formDataToSend.append('images', file);
        });
      }
      
      // Create the service using the FormData
      await addService(formDataToSend);
      
      toast.success('Service created successfully');
      fetchServices();
      switchToList();
    } catch (error) {
      toast.error('Error creating service: ' + error.message);
      console.error('Error details:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.id) {
        toast.error('Service ID is missing');
        return;
      }

      // Prepare the service data with all required fields
      const serviceData = { 
        ...formData,
        id: formData.id, // Explicitly include the ID
        professional: {
          id: formData.professional?.id || user.id,
          firstname: formData.professional?.firstname || user.firstname,
          lastname: formData.professional?.lastname || user.lastname,
          email: formData.professional?.email || user.email,
          role: formData.professional?.role || user.role
        },
        category: {
          id: formData.category?.id,
          name: formData.category?.name
        },
        subcategory: formData.subcategory?.id ? {
          id: formData.subcategory?.id,
          name: formData.subcategory?.name
        } : null,
        state: formData.state === undefined ? true : formData.state,
        adress: formData.adress || {},
        links: formData.links || {},
        keywordList: formData.keywordList || [],
        checked: formData.checked || false
      };

      console.log('Updating service with ID:', formData.id, serviceData);
      
      // Call the update service API
      await updateService(formData.id, serviceData);
      
      toast.success('Service updated successfully');
      fetchServices();
      switchToList();
    } catch (error) {
      toast.error('Error updating service: ' + error.message);
      console.error('Error details:', error);
    }
  };

  const handleDelete = async (id) => {
    // Au lieu d'utiliser window.confirm, on ouvre notre modal personnalisé
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteService(serviceToDelete);
      toast.success('Service deleted successfully');
      fetchServices();
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      toast.error('Error deleting service: ' + error.message);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const handleValidateService = async (id, isValidated) => {
    try {
      // Find the service to update
      const serviceToUpdate = services.find(service => service.id === id);
      if (!serviceToUpdate) {
        toast.error('Service not found');
        return;
      }
      
      // Create updated service data with validation status
      // Format it exactly like in handleUpdate
      const serviceData = { 
        ...serviceToUpdate,
        validated: isValidated,
        professional: {
          id: serviceToUpdate.professional?.id,
          firstname: serviceToUpdate.professional?.firstname,
          lastname: serviceToUpdate.professional?.lastname,
          email: serviceToUpdate.professional?.email,
          role: serviceToUpdate.professional?.role
        },
        category: {
          id: serviceToUpdate.category?.id,
          name: serviceToUpdate.category?.name
        },
        subcategory: serviceToUpdate.subcategory ? {
          id: serviceToUpdate.subcategory?.id,
          name: serviceToUpdate.subcategory?.name
        } : null
      };
      
      // Use the existing updateService function
      await updateService(serviceData.id, serviceData);
      
      toast.success(`Service ${isValidated ? 'validated' : 'rejected'} successfully`);
      fetchServices();
    } catch (error) {
      toast.error(`Error ${isValidated ? 'validating' : 'rejecting'} service: ` + error.message);
      console.error('Error details:', error);
    }
  };

  const handleViewService = async (service) => {
    setFormData(service);
    setIsViewMode(true);
    setIsFormView(true);
    setIsEditMode(false);
    window.scrollTo(0, 0);

    try {
      const fetchedImages = await getAllImagesForService(service.id);
      setImages(fetchedImages); // Store the images in state
    } catch (error) {
      toast.error('Error fetching service images: ' + error.message);
    }
  };

  const switchToForm = (isEdit = false) => {
    setIsFormView(true);
    setIsEditMode(isEdit);
    setIsViewMode(false);
    setIsNewProfessional(true); // Reset to new professional mode
    window.scrollTo(0, 0);
  };

  const switchToList = () => {
    setIsFormView(false);
    setIsViewMode(false);
    setIsEditMode(false);
    setIsNewProfessional(true);
    setFormData({
      name: "",
      description: "",
      professional: {
        id: user.id,
      },
      category: { id: 0, name: "" },
      subcategory: { id: 0, name: "" },
      state: true,
      adress: {
        streetNumber: "",
        streetName: "",
        streetType: "",
        provinceName: "",
        postalCode: "",
        city: "",
        country: ""
      },
      keywordList: [],
      links: {
        facebookURL: "",
        instagramURL: "",
        websiteURL: ""
      },
      images: []
    });
    setKeywords("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await handleUpdate();
    } else {
      await handleAdd();
    }
    switchToList();
  };

  const getCurrentServices = () => {
    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;
    
    // Sort services by ID descending (most recent first)
    const sortedServices = services.sort((a, b) => b.id - a.id);
    return sortedServices.slice(indexOfFirstService, indexOfLastService);
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

  const navigateToUser = (e, userId) => {
    e.stopPropagation();
    // Filter services to show only those of the selected professional
    const professionalServices = services.filter(service => service.professional?.id === userId);
    setServices(professionalServices);
    setCurrentPage(1); // Reset pagination
    setIsFormView(false); // Return to list view
    setFilteredProfessionalId(userId); // Store the filtered professional ID
  };

  const navigateToAdminServices = (e) => {
    e.stopPropagation();
    // Filter services to show only those of the admin
    const adminServices = services.filter(service => service.professional?.id === user.id);
    setServices(adminServices);
    setCurrentPage(1); // Reset pagination
    setIsFormView(false); // Return to list view
    setFilteredProfessionalId(user.id); // Store the filtered professional ID
  };

  const clearFilter = async () => {
    try {
      await fetchServices(); // Fetch all services
      setFilteredProfessionalId(null);
      // Remove the professionalId from URL and state
      window.history.replaceState({}, document.title);
    } catch (error) {
      toast.error('Error clearing filter: ' + error.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      toast.success('Image deleted successfully');
      
      // Mettre à jour la liste des images dans tous les modes
      if (formData.id) {
        const updatedImages = await getAllImagesForService(formData.id);
        setFormData(prev => ({
          ...prev,
          images: updatedImages
        }));
      } else {
        // En mode création, supprimer l'image de la liste locale
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => !img.preview || img.preview !== imageId),
          newImages: prev.newImages.filter((_, index) => index !== imageId)
        }));
      }
    } catch (error) {
      toast.error('Error deleting image: ' + error.message);
    }
  };

  // Create components for the form view and list view
  const renderFormView = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <button
          onClick={switchToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Services</span>
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-[#142237]">
          {isViewMode ? "Service Details" : isEditMode ? "Edit Service" : "New Service"}
        </h1>
        {isViewMode && (
          <button
            onClick={() => {
              setIsViewMode(false);
              setIsEditMode(true);
            }}
            className="ml-auto px-4 py-2 text-white bg-[#142237] rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
          >
            Edit Service
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="w-full bg-white">
        <div className="p-4">
          <ServiceForm
            formData={formData}
            handleChange={handleChange}
            keywords={keywords}
            handleKeywordsChange={handleKeywordsChange}
            handleAddKeyword={handleAddKeyword}
            handleRemoveKeyword={handleRemoveKeyword}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            categories={categories}
            subcategories={subcategories}
            isViewMode={isViewMode}
            isNewProfessional={isNewProfessional}
            setIsNewProfessional={setIsNewProfessional}
            existingProfessionals={existingProfessionals}
          />
        </div>
        {!isViewMode && (
          <div className="flex justify-end gap-4 p-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={switchToList}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#142237] rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
            >
              {isEditMode ? "Update" : "Create"} Service
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderListView = () => (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full lg:w-auto mb-4 lg:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-[#142237]">Service Management</h1>
          <div className="flex items-center gap-2">
            {filteredProfessionalId && (
              <button
                onClick={clearFilter}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Show All Services</span>
              </button>
            )}
          </div>
        </div>

        <AddServiceButton onClick={() => switchToForm(false)} />
      </div>

      <div className="flex-1 bg-white shadow-lg overflow-hidden">
        {/* Desktop View - Table */}
        <ServiceTable 
          services={getCurrentServices()} 
          handleViewService={handleViewService}
          handleDelete={handleDelete}
          switchToForm={switchToForm}
          handleValidateService={handleValidateService}
          navigateToUser={navigateToUser}
        />

        {/* Mobile View - Cards */}
        <ServiceCards 
          services={getCurrentServices()}
          handleViewService={handleViewService}
          handleDelete={handleDelete}
          switchToForm={switchToForm}
          navigateToUser={navigateToUser}
        />
          
        {/* Pagination Controls */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={services.length}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );

  // Ajouter ces états pour gérer le popup de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Ajouter le composant modal à la fin du rendu
  return (
    <div className="p-4 font-calibri lg:w-[80vw] lg:p-8">
      {isFormView ? renderFormView() : renderListView()}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-[#142237]">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesAdminManagement;