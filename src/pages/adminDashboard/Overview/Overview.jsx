import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./../../../Context/AuthContext";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  Eye, 
  Heart, 
  FolderTree
} from "lucide-react";
import { getAllServices } from "../../../Services/serviceService";
import { getAllUsers } from "../../../Services/userService";
import { getAllCategories } from "../../../Services/categoryService";
import { getSubcategoriesByCategoryId } from "../../../Services/subCategoryService";

const Overview = () => {
  const { user, fetchUser, token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    services: {
      total: 0,
      active: 0,
      pending: 0
    },
    users: {
      total: 0,
      professionals: 0,
      standard: 0
    },
    categories: {
      total: 0,
      subcategories: 0
    },
    views: {
      total: 0,
      byCategory: 0,
      byService: 0
    },
    favorites: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      
          
          // Fetch real data from APIs
          const services = await getAllServices();
          const users = await getAllUsers();
          const categories = await getAllCategories();
          
          // Calculate subcategories count
          let subcategoriesCount = 0;
          for (const category of categories) {
            try {
              const subcategories = await getSubcategoriesByCategoryId(category.id);
              subcategoriesCount += subcategories.length;
            } catch (error) {
              console.error(`Error fetching subcategories for category ${category.id}:`, error);
            }
          
          
          // Calculate statistics
          const activeServices = services.filter(service => service.state === true);
          const pendingServices = services.filter(service => service.state === false);
          const professionalUsers = users.filter(user => user.role === "PROFESSIONAL");
          const standardUsers = users.filter(user => user.role === "STANDARD_USER");
          
          // For views and favorites, we would ideally fetch from an analytics API
          // Using placeholder values for now, but structured for easy replacement
          const viewsTotal = 15600; // Placeholder
          const favoriteCount = 230;  // Placeholder
          
          setStatsData({
            services: {
              total: services.length,
              active: activeServices.length,
              pending: pendingServices.length
            },
            users: {
              total: users.length,
              professionals: professionalUsers.length,
              standard: standardUsers.length
            },
            categories: {
              total: categories.length,
              subcategories: subcategoriesCount
            },
            views: {
              total: viewsTotal,
              byCategory: Math.round(viewsTotal / (categories.length || 1)),
              byService: Math.round(viewsTotal / (services.length || 1))
            },
            favorites: favoriteCount
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#142237]"></div>
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center w-full bg-gray-100 absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-4">You do not have the required permissions to view this page.</p>
          <Link to="/login">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 text-red-600 bg-white rounded-lg hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Create stats array from real data
  const stats = [
    { 
      label: "Services proposés", 
      value: statsData.services.total, 
      icon: <ShoppingBag className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Services validés", 
      value: statsData.services.active, 
      icon: <CheckCircle className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Services en attente", 
      value: statsData.services.pending, 
      icon: <Clock className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Consultations", 
      value: statsData.views.total, 
      icon: <Eye className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Utilisateurs", 
      value: statsData.users.total, 
      icon: <Users className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Professionnel", 
      value: statsData.users.professionals, 
      icon: <Users className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Standards", 
      value: statsData.users.standard, 
      icon: <Users className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Favoris ajoutés", 
      value: statsData.favorites, 
      icon: <Heart className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Catégories", 
      value: statsData.categories.total, 
      icon: <FolderTree className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Sous-catégorie", 
      value: statsData.categories.subcategories, 
      icon: <FolderTree className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Consultations par catégorie", 
      value: statsData.views.byCategory, 
      icon: <BarChart3 className="w-6 h-6 text-[#142237]" />
    },
    { 
      label: "Consultations par service", 
      value: statsData.views.byService, 
      icon: <BarChart3 className="w-6 h-6 text-[#142237]" />
    },
  ];

  // Calculate percentages for summary section
  const serviceApprovalRate = statsData.services.total > 0 
    ? Math.round((statsData.services.active / statsData.services.total) * 100) 
    : 0;
  
  const professionalRate = statsData.users.total > 0 
    ? Math.round((statsData.users.professionals / statsData.users.total) * 100) 
    : 0;

  return (
    <div className="flex flex-col lg:gap-8 gap-4 flex-1 p-4 lg:w-[80vw] lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-[#142237] text-3xl md:text-4xl lg:text-5xl font-bold">Dashboard</h1>
        <div className="mt-4 md:mt-0 bg-[#142237] text-white px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center border-solid border-[#142237] border-2 justify-center p-4 sm:p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-center mb-3">
              {stat.icon}
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#142237]">
              {stat.value.toLocaleString()}
            </span>
            <span className="font-semibold text-lg text-[#142237] text-center mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
