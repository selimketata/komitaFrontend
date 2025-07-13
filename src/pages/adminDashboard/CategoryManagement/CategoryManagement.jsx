import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from "react-modal";
import { AuthContext } from "../../../Context/AuthContext";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./../../../Services/categoryService";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategoryId,
  updateSubcategory,
} from "../../../Services/subCategoryService";

// Components
import AddCategory from "./components/AddCategory";
import EditCategoryModal from "./components/EditCategoryModal";
import AddSubcategoryModal from "./components/AddSubcategoryModal";
import EditSubcategoryModal from "./components/EditSubcategoryModal";
import CategoryTable from "./components/CategoryTable";

// Set the app element for React Modal
ReactModal.setAppElement('#root');

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySubcategories, setCategorySubcategories] = useState({});
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchSubcategories = async (categoryId) => {
    try {
      const subcategories = await getSubcategoriesByCategoryId(categoryId);
      setCategorySubcategories(prev => ({
        ...prev,
        [categoryId]: subcategories
      }));
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      toast.error("Failed to fetch subcategories.");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        // Fetch subcategories for each category
        data.forEach(category => {
          fetchSubcategories(category.id);
        });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      const createdCategory = await createCategory(newCategory);
      setCategories([...categories, createdCategory]);
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category.");
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const category = await updateCategory(updatedCategory.id, {
        name: updatedCategory.name
      });
      setCategories(categories.map(cat => (cat.id === category.id ? category : cat)));
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleAddSubcategory = async (categoryId, subcategory) => {
    try {
      const newSubcategory = await createSubcategory(categoryId, subcategory);
      setCategorySubcategories(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), newSubcategory]
      }));
      toast.success("Subcategory added successfully!");
    } catch (error) {
      console.error("Failed to add subcategory:", error);
      toast.error("Failed to add subcategory.");
    }
  };

  const handleUpdateSubcategory = async (subcategoryId, updatedData) => {
    try {
      const updated = await updateSubcategory(subcategoryId, updatedData);
      // Update the subcategories state
      setCategorySubcategories(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(categoryId => {
          newState[categoryId] = newState[categoryId].map(sub =>
            sub.id === subcategoryId ? updated : sub
          );
        });
        return newState;
      });
      toast.success("Subcategory updated successfully!");
    } catch (error) {
      console.error("Failed to update subcategory:", error);
      toast.error("Failed to update subcategory.");
    }
  };

  const handleDeleteSubcategory = async (subcategoryId, categoryId) => {
    try {
      await deleteSubcategory(subcategoryId);
      setCategorySubcategories(prev => ({
        ...prev,
        [categoryId]: prev[categoryId].filter(sub => sub.id !== subcategoryId)
      }));
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
      toast.error("Failed to delete subcategory.");
    }
  };

  // If the user does not have the ADMIN role, display "Access Denied"
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center w-full bg-gray-100 absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="bg-red-600 text-black p-8 rounded-lg shadow-lg text-center w-1/2 sm:w-1/3">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">You do not have the required permissions to view this page.</p>
          <Link to="/login">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 text-white bg-red rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 font-calibri lg:w-[80vw] lg:p-8">
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onUpdate={handleUpdateCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {addingSubcategoryFor && (
        <AddSubcategoryModal
          categoryId={addingSubcategoryFor}
          onAdd={handleAddSubcategory}
          onClose={() => setAddingSubcategoryFor(null)}
        />
      )}

      {editingSubcategory && (
        <EditSubcategoryModal
          subcategory={editingSubcategory}
          onUpdate={handleUpdateSubcategory}
          onClose={() => setEditingSubcategory(null)}
        />
      )}

      <div className="flex flex-col h-full p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#142237] mb-4 lg:mb-0">Gestion des catégories</h1>
          <AddCategory onAdd={handleAddCategory} />
        </div>

        <div className="flex-1 bg-white shadow-lg overflow-hidden">
          <CategoryTable
            categories={categories}
            categorySubcategories={categorySubcategories}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={setEditingCategory}
            onAddSubcategory={setAddingSubcategoryFor}
            onEditSubcategory={setEditingSubcategory}
            onDeleteSubcategory={handleDeleteSubcategory}
          />
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default CategoryManagement;