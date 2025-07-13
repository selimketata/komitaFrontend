import React, { useState } from "react";
import { X } from "lucide-react";
import ReactModal from "react-modal";
import { modalStyles } from "../styles";

const EditCategoryModal = ({ category, onUpdate, onClose }) => {
  const [editedName, setEditedName] = useState(category.name);

  const handleUpdateCategory = () => {
    onUpdate({
      id: category.id,
      name: editedName
    });
    onClose();
  };

  return (
    <ReactModal
      isOpen={true}
      style={modalStyles}
      className="w-[90%] max-w-md"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#142237]">Modifier la catégorie</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie
            </label>
            <input
              id="categoryName"
              type="text"
              value={editedName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none transition-all duration-200"
              onChange={(e) => setEditedName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdateCategory}
            className="px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
          >
            Modifier
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default EditCategoryModal;