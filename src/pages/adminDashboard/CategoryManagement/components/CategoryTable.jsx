import React from "react";
import { PenSquare, Trash2, Plus } from "lucide-react";

const CategoryTable = ({ 
  categories, 
  categorySubcategories, 
  onDeleteCategory, 
  onEditCategory, 
  onAddSubcategory, 
  onEditSubcategory, 
  onDeleteSubcategory 
}) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto h-full">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-gray border-b bg-[#D9D9D9]">
              <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Catégorie</th>
              <th className="w-[40%] px-6 py-4 text-left text-sm font-semibold text-[#142237]">Sous-catégorie</th>
              <th className="w-[20%] pl-[10%] py-4 text-left text-sm font-semibold text-[#142237]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => {
              const subcategories = categorySubcategories[category.id] || [];
              return (
                <tr key={category.id} className={`hover:bg-[#F0F0F0] hover:shadow-md transition-all duration-200`}>
                  <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {subcategories.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1422370a] hover:bg-[#8f92973d] transition-colors duration-200">
                            <span className="text-sm text-gray-700">{sub.name}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onDeleteSubcategory(sub.id, category.id)}
                                className="p-1 text-[#E5181D] hover:bg-red-50 rounded-full transition-colors duration-200"
                                title="Supprimer la sous-catégorie"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onEditSubcategory(sub)}
                                className="p-1 text-[#142237] hover:bg-blue-50 rounded-full transition-colors duration-200"
                                title="Modifier la sous-catégorie"
                              >
                                <PenSquare className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => onAddSubcategory(category.id)}
                        className="text-[#142237] text-sm hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter une sous-catégorie
                      </button>
                    </div>
                  </td>
                  <td className="pl-[10%] py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDeleteCategory(category)}
                        className="text-[#E5181D] hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEditCategory(category)}
                        className="p-2 text-[#142237] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Modifier la catégorie"
                      >
                        <PenSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {categories.map((category) => {
          const subcategories = categorySubcategories[category.id] || [];
          return (
            <div key={category.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-[#142237]">{category.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDeleteCategory(category)}
                    className="text-[#E5181D] hover:bg-red-50 rounded-lg p-1 transition-colors duration-200"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEditCategory(category)}
                    className="text-[#142237] hover:bg-blue-50 rounded-lg p-1 transition-colors duration-200"
                    title="Modifier la catégorie"
                  >
                    <PenSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600 mb-2">Sous-catégories:</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1422370a] hover:bg-[#8f92973d] transition-colors duration-200">
                        <span className="text-sm text-gray-700">{sub.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onDeleteSubcategory(sub.id, category.id)}
                            className="p-1 text-[#E5181D] hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Supprimer la sous-catégorie"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onEditSubcategory(sub)}
                            className="p-1 text-[#142237] hover:bg-blue-50 rounded-full transition-colors duration-200"
                            title="Modifier la sous-catégorie"
                          >
                            <PenSquare className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucune sous-catégorie</p>
                  )}
                </div>
                <button
                  onClick={() => onAddSubcategory(category.id)}
                  className="text-[#142237] text-sm hover:underline flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une sous-catégorie
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CategoryTable;