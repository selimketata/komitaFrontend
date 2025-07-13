import { axiosInstanceWithToken, axiosInstance } from '../api/axios';

// Search services with a query
export const searchServices = async (query) => {
  try {
    console.log("Calling search API with query:", query);
    const response = await axiosInstanceWithToken.get(`/search?query=${encodeURIComponent(query)}`);
    console.log("Search API response:", response);
    return response.data || [];
  } catch (error) {
    console.error("Error searching services:", error);
    return []; // Return empty array instead of throwing to prevent UI breaking
  }
};

// Get search history for a user
export const getSearchHistoryByUser = async (userId) => {
  try {
    console.log("Calling search history API for user:", userId);
    const response = await axiosInstanceWithToken.get(`/search/history/${userId}`);
    console.log("Search history API response:", response);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching search history:", error);
    return []; // Return empty array instead of throwing to prevent UI breaking
  }
};

// Get autocomplete suggestions based on partial query
export const getAutocompleteSuggestions = async (partialQuery) => {
  try {
    console.log("Calling autocomplete API with query:", partialQuery);
    // If the backend doesn't have a specific autocomplete endpoint,
    // we can use the search endpoint with a limit parameter
    const response = await axiosInstanceWithToken.get(`/search?query=${encodeURIComponent(partialQuery)}&limit=5`);
    console.log("Autocomplete API response:", response);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return []; // Return empty array on error to prevent UI breaking
  }
};