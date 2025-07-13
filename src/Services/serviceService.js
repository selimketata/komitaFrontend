import {axiosInstanceWithToken} from './../api/axios';
import axios from 'axios';

// Define API URL - use import.meta.env for Vite projects
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api/v1';

// Get all services
export const getAllServices = async () => {
  try {
    const response = await axiosInstanceWithToken.get('/services');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching services');
  }
};

// Get a single service by ID
export const getServiceById = async (id) => {
  try {
    const response = await axiosInstanceWithToken.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching service');
  }
};

// Add a new service
export const addService = async (formData) => {
  try {
    const response = await axiosInstanceWithToken.post('/services/createService', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding service');
  }
};

// Update an existing service
export const updateService = async (id, serviceData) => {
  try {
    const response = await axiosInstanceWithToken.put(`/services/updateService/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating service');
  }
};

// Delete a service
export const deleteService = async (id) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/services/deleteService/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting service');
  }
};

// Upload service images
export const uploadServiceImages = async (serviceId, formData) => {
  try {
    const response = await axiosInstanceWithToken.post(`/services/${serviceId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading service images');
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axiosInstanceWithToken.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching categories');
  }
};


export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/services/byCategory/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching services by category');
  }
};

export const getServicesByCategoryAndSubcategory = async (categoryId, subcategoryId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/services/byCategoryAndSubcategory/${categoryId}/${subcategoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching services by category and subcategory');
  }
};

export const getServicesByUser = async (userId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/v1/services/byUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching services by user');
  }
};

// Update the getServicesByKeyword function to use the proper API endpoint
export const getServicesByKeyword = async (keywords) => {
  try {
    // Convert keywords array to query string format
    const keywordsParam = keywords.map(k => `keywords=${encodeURIComponent(k)}`).join('&');
    const response = await axiosInstanceWithToken.get(`/services/byKeyword?${keywordsParam}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Return empty array if no services found for keywords
      return [];
    }
    throw new Error(error.response?.data?.message || 'Error searching services by keyword');
  }
};

export const getRecentProfessionals = async (maxRows) => {
  try {
    const headers = maxRows ? { 'Max-Rows': maxRows } : {};
    const response = await axiosInstanceWithToken.get('/services/recentProfessionals', { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching recent professionals');
  }
};

export const getPopularProfessionals = async (maxRows) => {
  try {
    const headers = maxRows ? { 'Max-Rows': maxRows } : {};
    const response = await axiosInstanceWithToken.get('/services/popularProfessionals', { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching popular professionals');
  }
};

export const deleteServiceImage = async (serviceId, imageId) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/services/${serviceId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting service image');
  }
}; 

export const getAllImagesForService = async (serviceId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/services/${serviceId}/allImages`);
    return response.data; // Adjust this based on your API response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching service images');
  }
};

export const getImageDataById = async (imageId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/images/${imageId}/data`);
    return response.data; // Adjust this based on your API response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching image data');
  }
};

// Delete a service
export const deleteImage = async (id) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/images/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting service');
  }
};

// Add a single image to a service
export const addImageToService = async (serviceId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstanceWithToken.post(
      `/services/${serviceId}/addImage`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding image to service');
  }
};


// Add this new function to the existing file

// Consult a service (record the consultation)
export const consultService = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log("Sending consultation request for service:", serviceId);
    console.log("With headers:", headers);
    
    const response = await axios.post(
      `${API_URL}/consultations/${serviceId}/consult`,
      null, // No need to send user data, backend will handle it
      { headers }
    );
    
    console.log("Consultation response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error consulting service:', error);
    throw error;
  }
};

// Remove the consultServiceAnonymously function as it's no longer needed
// The backend will handle anonymous users automatically