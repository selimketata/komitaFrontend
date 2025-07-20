import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom"; // Add this import
import { getAllServices, getAllCategories, getServicesByCategory, getServicesByKeyword, getServicesByCategoryAndSubcategory } from "../../../Services/serviceService";
import { searchServices, getSearchHistoryByUser, getAutocompleteSuggestions } from "../../../Services/searchService";
import { toast } from "react-toastify";
import { Search, X, Menu, LayoutGrid, Clock, ArrowRight } from "lucide-react";
import ServiceCard from "../../../components/ServiceCard";
import SidebarServicesComponent from "../../../components/SidebarServices";
import Pagination from "../../../components/Pagination";
import  {serviceContent}  from "../../../Config/content/index";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../Context/AuthContext"; // Import AuthContext

function Service() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const location = useLocation(); // Get location to access URL parameters
    
    // Existing state variables
    const [selectedView, setSelectedView] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("date");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [allServices, setAllServices] = useState([]);
    
    // New state variables for search history and autocomplete
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
    const [showAutocompleteSuggestions, setShowAutocompleteSuggestions] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    
    const searchInputRef = useRef(null);
    const autocompleteRef = useRef(null);
    
    const itemsPerPage = 9;
    const [serviceImages, setServiceImages] = useState({});
    
    // Parse URL parameters when component mounts
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query');
        const locationParam = queryParams.get('location');
        
        console.log("URL parameters detected:", { query, locationParam });
        
        if (query) {
            setSearchQuery(query);
        }
        
        if (locationParam) {
            setLocationQuery(locationParam);
        }
        
        // If we have query parameters, perform search
        if (query || locationParam) {
            // We need to wait for state to update before searching
            setTimeout(() => {
                console.log("Auto-searching with params:", { query, locationParam });
                performSearchWithParams(query, locationParam);
            }, 300);
        }
    }, [location.search]); // Only run when URL parameters change
    
    // Function to perform search with URL parameters
    const performSearchWithParams = async (query, locationParam) => {
        try {
            setLoading(true);
            console.log("Auto-searching with params:", { query, locationParam });
            
            const hasSearchQuery = query && query.trim() !== '';
            const hasLocationQuery = locationParam && locationParam.trim() !== '';
            
            if (hasSearchQuery) {
                try {
                    // Use the search API
                    const searchResults = await searchServices(query);
                    console.log("Search results:", searchResults);
                    
                    // If user is logged in, refresh search history
                    if (user && user.id) {
                        setTimeout(() => {
                            fetchSearchHistory(user.id);
                        }, 500);
                    }
                    
                    // If we have a location query, filter the results further
                    if (hasLocationQuery) {
                        const locationTerms = locationParam.toLowerCase().trim();
                        const filteredResults = searchResults.filter(service => {
                            if (!service.adress) return false;
                            
                            const cityMatch = service.adress.city && 
                                service.adress.city.toLowerCase().includes(locationTerms);
                            const streetMatch = service.adress.streetName && 
                                service.adress.streetName.toLowerCase().includes(locationTerms);
                            const zipMatch = service.adress.postalCode && 
                                service.adress.postalCode.toLowerCase().includes(locationTerms);
                            
                            return cityMatch || streetMatch || zipMatch;
                        });
                        
                        setServices(filteredResults);
                        setAllServices(filteredResults);
                    } else {
                        setServices(searchResults);
                        setAllServices(searchResults);
                    }
                } catch (error) {
                    console.error("Error with search API:", error);
                    toast.error("Erreur lors de la recherche: " + error.message);
                    
                    // Fallback to the old search method
                    fallbackSearch(hasSearchQuery, hasLocationQuery, query, locationParam);
                }
            } else if (hasLocationQuery) {
                // If only location query, fetch all services first then filter
                const allServicesData = await getAllServices();
                
                const locationTerms = locationParam.toLowerCase().trim();
                const filteredServices = allServicesData.filter(service => {
                    if (!service.adress) return false;
                    
                    const cityMatch = service.adress.city && 
                        service.adress.city.toLowerCase().includes(locationTerms);
                    const streetMatch = service.adress.streetName && 
                        service.adress.streetName.toLowerCase().includes(locationTerms);
                    const zipMatch = service.adress.postalCode && 
                        service.adress.postalCode.toLowerCase().includes(locationTerms);
                    
                    return cityMatch || streetMatch || zipMatch;
                });
                
                setServices(filteredServices);
                setAllServices(filteredServices);
            }
            
            setCurrentPage(1);
            setLoading(false);
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error("Error performing auto-search:", error);
            toast.error("Erreur lors de la recherche automatique: " + error.message);
            setLoading(false);
            
            // Fallback to fetching all services
            fetchServices();
        }
    };
    
    // Fetch services and categories on component mount
    useEffect(() => {
        // Only fetch all services if we don't have URL parameters
        const queryParams = new URLSearchParams(location.search);
        const hasUrlParams = queryParams.has('query') || queryParams.has('location');
        
        if (!hasUrlParams) {
            fetchServices();
        }
        
        fetchCategories();
        
        // Fetch search history if user is logged in
        if (user && user.id) {
            fetchSearchHistory(user.id);
        }
        
        // Add click event listener to close dropdowns when clicking outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user, location.search]);

    // Handle clicks outside the search components
    const handleClickOutside = (event) => {
        if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
            autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
            setShowSearchHistory(false);
            setShowAutocompleteSuggestions(false);
        }
    };

    // Fetch search history for the user
    const fetchSearchHistory = async (userId) => {
        try {
            setHistoryLoading(true);
            console.log("Fetching search history for user ID:", userId);
            const history = await getSearchHistoryByUser(userId);
            console.log("Search history response:", history);
            
            // Check if history is an array and has items
            if (Array.isArray(history) && history.length > 0) {
                setSearchHistory(history);
            } else {
                console.log("Search history is empty or not in expected format");
                setSearchHistory([]);
            }
            setHistoryLoading(false);
        } catch (error) {
            console.error("Error fetching search history:", error);
            setSearchHistory([]);
            setHistoryLoading(false);
        }
    };

    // Fetch autocomplete suggestions when search query changes
    useEffect(() => {
        const fetchAutocompleteSuggestions = async () => {
            if (searchQuery.trim().length > 2) {
                try {
                    console.log("Fetching autocomplete suggestions for:", searchQuery);
                    const suggestions = await getAutocompleteSuggestions(searchQuery);
                    console.log("Autocomplete suggestions response:", suggestions);
                    
                    // Check if suggestions is an array and has items
                    if (Array.isArray(suggestions) && suggestions.length > 0) {
                        setAutocompleteSuggestions(suggestions);
                        setShowAutocompleteSuggestions(true);
                    } else {
                        console.log("No autocomplete suggestions found");
                        setAutocompleteSuggestions([]);
                        setShowAutocompleteSuggestions(false);
                    }
                } catch (error) {
                    console.error("Error fetching autocomplete suggestions:", error);
                    setAutocompleteSuggestions([]);
                    setShowAutocompleteSuggestions(false);
                }
            } else {
                setAutocompleteSuggestions([]);
                setShowAutocompleteSuggestions(false);
            }
        };

        const timer = setTimeout(() => {
            fetchAutocompleteSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Existing useEffects
    useEffect(() => {
        if (services.length > 0) {
            calculateTotalPages();
        }
    }, [currentPage, services]);

    useEffect(() => {
        if (services.length > 0) {
            fetchImagesForServices(services);
        }
    }, [services]);

    // Existing functions
    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des catégories: " + error.message);
        }
    };

    const calculateTotalPages = () => {
        setTotalPages(Math.ceil(services.length / itemsPerPage));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Update handleSearch to use the new searchServices API
    const handleSearch = async (updateUrl = true) => {
        try {
            setLoading(true);
            
            // Check if we have search query or location query
            const hasSearchQuery = searchQuery.trim() !== '';
            const hasLocationQuery = locationQuery.trim() !== '';
            
            console.log("Performing search with:", { searchQuery, locationQuery });
            
            // Update URL with search parameters if requested
            if (updateUrl) {
                const params = new URLSearchParams();
                if (hasSearchQuery) {
                    params.set('query', searchQuery);
                }
                if (hasLocationQuery) {
                    params.set('location', locationQuery);
                }
                
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
            
            if (hasSearchQuery) {
                try {
                    console.log("Searching for:", searchQuery);
                    // Use the new search API
                    const searchResults = await searchServices(searchQuery);
                    console.log("Search results:", searchResults);
                    
                    // If user is logged in, refresh search history
                    if (user && user.id) {
                        setTimeout(() => {
                            fetchSearchHistory(user.id);
                        }, 500); // Give backend time to save the search history
                    }
                    
                    // If we have a location query, filter the results further
                    if (hasLocationQuery) {
                        const locationTerms = locationQuery.toLowerCase().trim();
                        const filteredResults = searchResults.filter(service => {
                            if (!service.adress) return false;
                            
                            const cityMatch = service.adress.city && 
                                service.adress.city.toLowerCase().startsWith(locationTerms);
                            const streetMatch = service.adress.streetName && 
                                service.adress.streetName.toLowerCase().includes(locationTerms);
                            const zipMatch = service.adress.postalCode && 
                                service.adress.postalCode.toLowerCase().startsWith(locationTerms);
                            
                            return cityMatch || streetMatch || zipMatch;
                        });
                        
                        setServices(filteredResults);
                        setAllServices(filteredResults);
                    } else {
                        setServices(searchResults);
                        setAllServices(searchResults);
                    }
                } catch (error) {
                    console.error("Error with search API:", error);
                    toast.error("Erreur lors de la recherche: " + error.message);
                    
                    // Fallback to the old search method
                    fallbackSearch(hasSearchQuery, hasLocationQuery);
                }
            } else if (hasLocationQuery) {
                // If only location query, filter all services by location
                const locationTerms = locationQuery.toLowerCase().trim();
                const filteredServices = allServices.filter(service => {
                    if (!service.adress) return false;
                    
                    const cityMatch = service.adress.city && 
                        service.adress.city.toLowerCase().startsWith(locationTerms);
                    const streetMatch = service.adress.streetName && 
                        service.adress.streetName.toLowerCase().includes(locationTerms);
                    const zipMatch = service.adress.postalCode && 
                        service.adress.postalCode.toLowerCase().startsWith(locationTerms);
                    
                    return cityMatch || streetMatch || zipMatch;
                });
                
                setServices(filteredServices);
            } else {
                // If no search query and no location, fetch all services or by category if selected
                if (selectedCategory) {
                    const data = await getServicesByCategory(selectedCategory);
                    setServices(data);
                    setAllServices(data);
                } else {
                    await fetchServices();
                }
            }
            
            setCurrentPage(1);
            setLoading(false);
            
            // Hide dropdowns after search
            setShowSearchHistory(false);
            setShowAutocompleteSuggestions(false);
            
            // Add scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            toast.error("Erreur lors de la recherche: " + error.message);
            setLoading(false);
        }
    };

    // Fallback search method using the old approach
    const fallbackSearch = async (hasSearchQuery, hasLocationQuery) => {
        if (hasSearchQuery) {
            // Split search query into keywords
            const keywords = searchQuery.split(' ').filter(k => k.trim() !== '');
            if (keywords.length > 0) {
                try {
                    // Use the API for keyword search
                    const data = await getServicesByKeyword(keywords);
                    
                    // Filter by location if needed
                    if (hasLocationQuery) {
                        const locationTerms = locationQuery.toLowerCase().trim();
                        const filteredData = data.filter(service => {
                            if (!service.adress) return false;
                            
                            const cityMatch = service.adress.city && 
                                service.adress.city.toLowerCase().startsWith(locationTerms);
                            const streetMatch = service.adress.streetName && 
                                service.adress.streetName.toLowerCase().includes(locationTerms);
                            const zipMatch = service.adress.postalCode && 
                                service.adress.postalCode.toLowerCase().startsWith(locationTerms);
                            
                            return cityMatch || streetMatch || zipMatch;
                        });
                        
                        setServices(filteredData);
                        setAllServices(filteredData);
                    } else {
                        setServices(data);
                        setAllServices(data);
                    }
                } catch (error) {
                    console.error("Error with API keyword search:", error);
                    
                    // Client-side filtering as last resort
                    const filteredServices = allServices.filter(service => {
                        // Check service name
                        const nameMatch = service.name && 
                            service.name.toLowerCase().includes(searchQuery.toLowerCase());
                        
                        // Check service description
                        const descMatch = service.description && 
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
                        
                        // Check keywords
                        const keywordMatch = service.keywordList && service.keywordList.some(k => 
                            k.keywordName.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        
                        return nameMatch || descMatch || keywordMatch;
                    });
                    
                    setServices(filteredServices);
                }
            }
        }
    };

    // Handle selecting a search history item
    const handleSelectHistoryItem = (query) => {
        setSearchQuery(query);
        setShowSearchHistory(false);
        
        // Update URL with the selected history item
        const params = new URLSearchParams();
        params.set('query', query);
        if (locationQuery.trim() !== '') {
            params.set('location', locationQuery);
        }
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Trigger search with the selected history item
        setTimeout(() => {
            handleSearch(false); // Pass false to prevent duplicate URL update
        }, 100);
    };

    // Handle selecting an autocomplete suggestion
    const handleSelectSuggestion = (service) => {
        setSearchQuery(service.name);
        setShowAutocompleteSuggestions(false);
        
        // Update URL with the selected suggestion
        const params = new URLSearchParams();
        params.set('query', service.name);
        if (locationQuery.trim() !== '') {
            params.set('location', locationQuery);
        }
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Trigger search with the selected suggestion
        setTimeout(() => {
            handleSearch(false); // Pass false to prevent duplicate URL update
        }, 100);
    };

    // Existing functions
    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getAllServices();
            setServices(data);
            setAllServices(data);
            calculateTotalPages();
            setLoading(false);
        } catch (error) {
            console.log("Erreur lors du chargement des services: " + error.message);
            setLoading(false);
        }
    };
    
    const handleCategorySelect = async (categoryId) => {
        try {
            setLoading(true);
            setSelectedCategory(categoryId);
            
            if (categoryId) {
                const data = await getServicesByCategory(categoryId);
                setServices(data);
                setAllServices(data);
            } else {
                await fetchServices();
                setSearchQuery('');
                setLocationQuery('');
            }
            
            setCurrentPage(1);
            setLoading(false);
            
        } catch (error) {
            toast.error("Erreur lors du filtrage par catégorie: " + error.message);
            setLoading(false);
        }
    };
    
    const handleSubcategorySelect = async (selectedSubcategories, categoryId) => {
        // Existing implementation...
    };

    const handleSortChange = (e) => {
        // Existing implementation...
    };

    const fetchImagesForServices = async (servicesList) => {
        // Existing implementation...
    };

    const getCurrentPageServices = () => {
        const indexOfLastService = currentPage * itemsPerPage;
        const indexOfFirstService = indexOfLastService - itemsPerPage;
        return services.slice(indexOfFirstService, indexOfLastService);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[455px] bg-cover bg-center relative" 
                 style={{ backgroundImage: "url('/image 321.png')" }}>
                <div className="absolute inset-0 bg-[#122237] opacity-60"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
                    <h1 className="text-white text-xl sm:text-2xl md:text-[32px] font-['Calibri'] mb-2 text-center">
                        {t("service.mainContent.title")}
                    </h1>
                    <p className="text-white text-lg sm:text-2xl md:text-[32px] font-['Alex_Brush'] mb-4 sm:mb-6 md:mb-8 text-center">
                        {t("service.mainContent.slogan")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full max-w-[1000px]">
                        <div className="relative w-full sm:flex-1" ref={searchInputRef}>
                            <input
                                type="text"
                                placeholder={t("service.searchBar.searchFields.whatPlaceholder")}
                                className="w-full h-12 px-4 pl-10 rounded shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (user && user.id && searchHistory.length > 0) {
                                        setShowSearchHistory(true);
                                    }
                                    setShowAutocompleteSuggestions(false);
                                }}
                            />
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            {searchQuery && (
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setShowAutocompleteSuggestions(false);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                            
                            {/* Search History Dropdown */}
                            {showSearchHistory && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                                    <div className="p-2 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {/* {t("service.searchBar.searchHistory.title")} */} History
                                        </h3>
                                    </div>
                                    <ul>
                                        {historyLoading ? (
                                            <li className="px-4 py-2 text-sm text-gray-500">
                                                {t("service.searchBar.searchHistory.loading")}
                                            </li>
                                        ) : (
                                            searchHistory.slice(0, 5).map((item, index) => (
                                                <li 
                                                    key={index}
                                                    className="px-4 py-2 text-sm hover:bg-gray text-black cursor-pointer flex items-center justify-between"
                                                    onClick={() => handleSelectHistoryItem(item.query)}
                                                >
                                                    <span>{item.query}</span>
                                                    <ArrowRight size={14} className="text-gray-400" />
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}
                            
                            {/* Autocomplete Suggestions Dropdown */}
                            {showAutocompleteSuggestions && autocompleteSuggestions.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto" ref={autocompleteRef}>
                                    <ul>
                                        {autocompleteSuggestions.map((service, index) => (
                                            <li 
                                                key={index}
                                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                                onClick={() => handleSelectSuggestion(service)}
                                            >
                                                <span>{service.name}</span>
                                                <ArrowRight size={14} className="text-gray-400" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative w-full sm:flex-1">
                            <input
                                type="text"
                                placeholder={t("service.searchBar.searchFields.wherePlaceholder")}
                                className="w-full h-12 px-4 pl-10 rounded shadow-sm"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            {locationQuery && (
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setLocationQuery('')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        
                        <button 
                            className="w-full sm:w-32 h-12 bg-[#E5181D] text-white rounded shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            onClick={handleSearch}
                        >
                            <Search size={18} />
                            <span>{t("service.searchBar.searchFields.findButton")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Sidebar Toggle */}
                    <button 
                        className="lg:hidden flex items-center gap-2 text-gray-600 mb-4"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                        <span>{t("service.sidebar.mobileToggle")}</span>
                    </button>

                    {/* Sidebar */}
                    <div className={`
                        fixed inset-0 z-50 lg:relative lg:z-0
                        ${sidebarOpen ? 'block' : 'hidden lg:block'}
                        lg:w-64 lg:shrink-0
                    `}>
                        <div className="relative h-full">
                            {/* Mobile Close Button */}
                            <button 
                                className="lg:hidden absolute right-4 top-4 text-gray-500"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X size={24} />
                            </button>
                            <SidebarServicesComponent 
                                onCategorySelect={handleCategorySelect}
                                onSubcategorySelect={handleSubcategorySelect}
                                selectedCategory={selectedCategory}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold">
                                {t("service.mainContent.subtitle")}
                            </h2>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                    <span className="text-gray-500 text-sm">{t("service.mainContent.sortBy")}</span>
                                    <select 
                                        className="border rounded px-2 py-1"
                                        value={sortBy}
                                        onChange={handleSortChange}
                                    >
                                        <option value="date">{t("service.mainContent.sortOptions.date")} </option>
                                        <option value="name">{t("service.mainContent.sortOptions.name")}</option>
                                    </select>
                                </div>

                                <div className="flex shadow-sm">
                                    <button
                                        onClick={() => setSelectedView('grid')}
                                        className={`p-2 border ${selectedView === 'grid' ? 'bg-[#E5E9EB]' : 'border-gray-300'} rounded-l`}
                                    >
                                        <LayoutGrid size={20} className={selectedView === 'grid' ? 'text-[#E5181D]' : 'text-gray-400'} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedView('list')}
                                        className={`p-2 border ${selectedView === 'list' ? 'bg-[#E5E9EB]' : 'border-gray-300'} rounded-r`}
                                    >
                                        <Menu size={20} className={selectedView === 'list' ? 'text-[#E5181D]' : 'text-gray-400'} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E5181D]"></div>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500 text-lg">{t("service.mainContent.noResults.message")}</p>
                                <button 
                                    className="mt-4 px-4 py-2 bg-[#E5181D] text-white rounded hover:bg-red-700 transition-colors"
                                    onClick={fetchServices}
                                >
                                    {t("service.mainContent.noResults.resetButton")}
                                </button>
                            </div>
                        ) : (
                            <div className={`flex ${selectedView === 'grid' ? 'flex-wrap justify-start' : 'flex-col'} mx-[-0.5rem]`}>
                                {getCurrentPageServices().map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        id={service.id}
                                        view={selectedView}
                                        title={service.name}
                                        description={service.description}
                                        keywords={service.keywordList?.map(k => k.keywordName).join(' ') || service.keywords?.join(' ')}
                                        location={service.adress?.city || service?.city || serviceContent.serviceCard.location}
                                        imageId={serviceImages[service.id]}
                                        date={new Date(service.createdAt).toLocaleDateString()}
                                        category={service.category?.name || service.categoryName}
                                        subcategory={service.subcategory?.name || service.subcategoryName}
                                        primaryImageId={service.primaryImageId}
                                        professionalName={service.professionalName || service.professional?.firstname + ' ' + service.professional?.lastname}
                                        professionalProfileImage={service.professionalProfileImage || service.professional?.profileImage}
                                        service={service} // Pass the full service object
                                    />
                                ))}
                            </div>
                        )}

                        {services.length > 0 && (
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Service;

// Utility function to generate search URLs
    const generateSearchUrl = (query, location = '') => {
        const params = new URLSearchParams();
        if (query && query.trim() !== '') {
            params.set('query', query);
        }
        if (location && location.trim() !== '') {
            params.set('location', location);
        }
        
        return `${window.location.origin}/service?${params.toString()}`;
    };