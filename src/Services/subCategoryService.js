import {axiosInstance, axiosInstanceWithToken} from './../api/axios';

export const getSubcategoriesByCategoryId = async (id) => {
  try {
    const response = await axiosInstanceWithToken.get(`/categories/${id}/subCategories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// Create a new subcategory
export const createSubcategory = async (categoryId, subcategory) => {
  try {
    console.log(categoryId, subcategory);
    const response = await axiosInstanceWithToken.post(
      `/Categories/${categoryId}/SubCategories/CreateSubcategory`,
      subcategory // The subcategory object is already in the format {name: "subcategoryName"}
    );
    return response.data;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
};

// Update a subcategory
export const updateSubcategory = async (id, subcategory) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `/subcategories/updateSubcategory/${id}`,
      subcategory // The subcategory object is already in the format {name: "subcategoryName"}
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
};

// Delete a subcategory
export const deleteSubcategory = async (id) => {
  try {
    await axiosInstanceWithToken.delete(`/subcategories/deleteSubcategory/${id}`);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};