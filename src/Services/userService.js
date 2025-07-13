import { axiosInstance,axiosInstanceWithToken } from './../api/axios';


// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstanceWithToken.get('/users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstanceWithToken.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const response = await axiosInstanceWithToken.get(`/user/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// Add new user
export const addUser = async (userData) => {
  try {
    console.log(userData);
    const response = await axiosInstanceWithToken.post('/user/addUser', userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (email, userData) => {
  try {
    const response = await axiosInstanceWithToken.put(`/user/updateUser/${email}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/user/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Update user role to PROFESSIONAL
export const updateUserRole = async (userId) => {
  try {
    const response = await axiosInstance.post(`/${userId}/UpdateUserRole`);
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(
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

// Get profile image
export const getProfileImage = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/profileImage`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error;
  }
};

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