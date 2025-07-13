import {axiosInstanceWithToken, axiosInstance} from '../api/axios';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (category) => {
  try {
    const response = await axiosInstanceWithToken.post('/addCategory', category);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (id, category) => {
  try {
    const response = await axiosInstanceWithToken.put(`/categories/${id}`, category);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    await axiosInstanceWithToken.delete(`/categories/${id}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};