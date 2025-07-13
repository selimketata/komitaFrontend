import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { getAllCategories } from "../Services/categoryService";
import { getSubcategoriesByCategoryId } from "../Services/subCategoryService";
import { useTranslation } from "react-i18next"; // Add this import


const SidebarServicesComponent = ({ onCategorySelect, onSubcategorySelect, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubcategories, setSelectedSubcategories] = useState({});
    const [categoryData, setCategoryData] = useState({});
    const [allSubcategoriesSelected, setAllSubcategoriesSelected] = useState({});
    const { t } = useTranslation(); // Add translation hook


    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch subcategories when a category is expanded
    useEffect(() => {
        if (expandedCategory !== null) {
            const category = categories[expandedCategory];
            if (category && !categoryData[category.id]) {
                fetchSubcategories(category.id);
            }
        }
    }, [expandedCategory, categories, categoryData]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des catégories: " + error.message);
            setLoading(false);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const subcategories = await getSubcategoriesByCategoryId(categoryId);
            setCategoryData(prev => ({
                ...prev,
                [categoryId]: subcategories
            }));
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Erreur lors du chargement des sous-catégories");
        }
    };

    const handleCategoryClick = (index) => {
        if (expandedCategory === index) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(index);
        }
    };

    // Modify the handleCategorySelect function
    const handleCategorySelect = (categoryId) => {
        // Don't clear subcategory selections when clicking the same category again
        if (selectedCategory !== categoryId) {
            setSelectedSubcategories({});
        }
        onCategorySelect(categoryId);
    };

    // Add a new function to handle selecting all subcategories for a category
    const handleSelectAllSubcategories = (categoryId, checked) => {
        const newSelected = { ...selectedSubcategories };
        
        if (checked) {
            // If the checkbox is checked, select all subcategories
            if (categoryData[categoryId]) {
                newSelected[categoryId] = categoryData[categoryId].map(sub => sub.id);
                setAllSubcategoriesSelected(prev => ({
                    ...prev,
                    [categoryId]: true
                }));
            }
        } else {
            // If the checkbox is unchecked, deselect all subcategories
            delete newSelected[categoryId];
            setAllSubcategoriesSelected(prev => ({
                ...prev,
                [categoryId]: false
            }));
        }
        
        setSelectedSubcategories(newSelected);
        
        // Pass selected subcategories to parent component
        onSubcategorySelect && onSubcategorySelect(newSelected, categoryId);
    };

    // Modify the handleSubcategorySelect function to update the "all selected" state
    const handleSubcategorySelect = (categoryId, subcategoryId, checked) => {
        const newSelected = { ...selectedSubcategories };
        
        if (!newSelected[categoryId]) {
            newSelected[categoryId] = [];
        }
        
        if (checked) {
            newSelected[categoryId].push(subcategoryId);
        } else {
            newSelected[categoryId] = newSelected[categoryId].filter(id => id !== subcategoryId);
            if (newSelected[categoryId].length === 0) {
                delete newSelected[categoryId];
            }
        }
        
        setSelectedSubcategories(newSelected);
        
        // Update the "all selected" state
        if (categoryData[categoryId]) {
            const allSelected = categoryData[categoryId].every(sub => 
                newSelected[categoryId]?.includes(sub.id)
            );
            setAllSubcategoriesSelected(prev => ({
                ...prev,
                [categoryId]: allSelected
            }));
        }
        
        // Pass selected subcategories to parent component
        onSubcategorySelect && onSubcategorySelect(newSelected, categoryId);
    };

    const clearFilters = () => {
        setSelectedSubcategories({});
        setAllSubcategoriesSelected({});
        onCategorySelect(null);
        onSubcategorySelect && onSubcategorySelect({});
    };
    
    // Add a new function to reset all services
    const resetAllServices = () => {
        // Clear all filters first
        clearFilters();
        // Close any expanded category
        setExpandedCategory(null);
        // You can add additional reset functionality here if needed
    };

    return (
        <div className="w-full lg:w-64 bg-white shadow-lg h-full overflow-y-auto">
            <div className="p-4 bg-white border-b">
                <h1 className="text-2xl font-bold">
                    <span className="text-[#E5181D]">K</span>omita
                </h1>
            </div>

            <div className="p-4 w-full bg-[#E5181D] text-white font-bold flex justify-between items-center">
                <span>{t("service.sidebar.filter")}</span>
                <SlidersHorizontal size={20} />
            </div>
            
            {/* Add a reset button at the top with icon */}
            <div className="p-3 border-b">
                <button 
                    onClick={resetAllServices}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center justify-center transition-colors"
                >
                    <RefreshCw size={16} className="mr-2 text-[#E5181D]" />
                    <span>{t("service.sidebar.reset")}</span>
                </button>
            </div>

            {Object.keys(selectedSubcategories).length > 0 && (
                <div className="p-3 bg-gray-100 border-b">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Filtres actifs</span>
                        <button 
                            onClick={clearFilters}
                            className="text-xs text-[#E5181D] hover:underline flex items-center"
                        >
                            Effacer tout <X size={14} className="ml-1" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedSubcategories).map(([catId, subIds]) => (
                            subIds.map(subId => {
                                const category = categories.find(c => c.id === parseInt(catId));
                                const subcategory = categoryData[catId]?.find(s => s.id === parseInt(subId));
                                return subcategory && (
                                    <div key={subId} className="bg-white text-xs rounded-full px-2 py-1 flex items-center border">
                                        <span>{subcategory.name}</span>
                                        <button 
                                            onClick={() => handleSubcategorySelect(catId, subId, false)}
                                            className="ml-1 text-gray-500 hover:text-[#E5181D]"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#E5181D] mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Chargement des catégories...</p>
                </div>
            ) : (
                <div className="divide-y">
                    {categories.map((category, index) => (
                        <div key={category.id} className="relative">
                            <div className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    {/* Checkbox with stopPropagation to prevent triggering category click */}
                                    <input
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        className="mr-2 h-4 w-4 text-[#E5181D] focus:ring-[#E5181D] rounded"
                                        checked={allSubcategoriesSelected[category.id] || false}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelectAllSubcategories(category.id, e.target.checked);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                        className={`font-medium text-left ${selectedCategory === category.id ? 'text-[#E5181D]' : ''}`}
                                        onClick={() => {
                                            
                                            handleCategorySelect(category.id);
                                        }}
                                        
                                    >
                                        {category.name}
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleCategoryClick(index)}
                                    className="text-[#E5181D]"
                                >
                                    {expandedCategory === index 
                                        ? <ChevronUp size={20} /> 
                                        : <ChevronDown size={20} />
                                    }
                                </button>
                            </div>
                            
                            {expandedCategory === index && (
                                <div className="bg-gray-50 py-2">
                                    {categoryData[category.id] ? (
                                        categoryData[category.id].length > 0 ? (
                                            categoryData[category.id].map((sub) => (
                                                <label 
                                                    key={sub.id} 
                                                    className="flex items-center px-6 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2 h-4 w-4 text-[#E5181D] focus:ring-[#E5181D] rounded"
                                                        checked={selectedSubcategories[category.id]?.includes(sub.id) || false}
                                                        onChange={(e) => handleSubcategorySelect(category.id, sub.id, e.target.checked)}
                                                    />
                                                    <span className="text-sm">{sub.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <div className="px-6 py-2 text-sm text-gray-500">
                                                Aucune sous-catégorie disponible
                                            </div>
                                        )
                                    ) : (
                                        <div className="px-6 py-2 text-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#E5181D] mx-auto"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SidebarServicesComponent;