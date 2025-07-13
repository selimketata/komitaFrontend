import { axiosInstance, axiosInstanceWithToken } from '../api/axios';

// Get user details
export const getUserDetails = async () => {
  try {
    const response = await axiosInstanceWithToken.get('/user/details');
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Get profile image
export const getProfileImage = async (userId) => {
  try {
    const response = await axiosInstanceWithToken.get(`/user/${userId}/profileImage`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstanceWithToken.post(
      `/user/${userId}/uploadProfileImage`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (email, userData) => {
  try {
    console.log("Sending update with data:", userData);
    // Make sure we're sending the correct data structure
    const response = await axiosInstanceWithToken.put(`/user/updateUser/${email}`, userData);
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Add this new function to get the current user's profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await axiosInstanceWithToken.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};