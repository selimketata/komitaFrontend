import {axiosInstance} from "../api/axios";

const getTokenFromContext = () => {
  return localStorage.getItem("token");
};

export const getAllServices = async () => {
  try {
    const response = await axiosInstance.get("/services");
    return response.data
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};


export const getServicesByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/services/byUser/${userId}`);
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteServiceById = async (ServiceId)=>{
  try {
    const token = getTokenFromContext();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axiosInstance.delete(`/services/deleteService/${ServiceId}`,
      {
        headers: {
          Authorization: token,
        },
      });
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  } 
}

export const createService = async (serviceData) => {
  try {
    const token = getTokenFromContext();

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axiosInstance.post(
      "/services/createService",
      serviceData,
      {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};
