import {axiosInstance} from './../api/axios';

export const createAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post('/auth/adresses/create', addressData);
    return response.data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};
