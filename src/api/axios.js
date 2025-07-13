import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085/api/v1', // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json', // Standard content type for JSON data
  },
});

// Add withCredentials configuration
axiosInstance.defaults.withCredentials = true;


const axiosInstanceWithToken = axios.create({
  baseURL: 'http://localhost:8085/api/v1', // Update with your API base URL
  headers: {
    'Content-Type': 'application/json', // Standard content type for JSON data
  },
});

// Add a request interceptor to include the token in headers
axiosInstanceWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosInstanceWithToken };
