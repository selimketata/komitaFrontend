import React, { useState } from "react";
import { X } from "lucide-react";
import ReactModal from "react-modal";
import { toast } from 'react-toastify';
import { modalStyles } from "../styles";

const EditSubcategoryModal = ({ subcategory, onUpdate, onClose }) => {
  const [editedName, setEditedName] = useState(subcategory.name);

  const handleUpdate = async () => {
    if (editedName) {
      try {
        await onUpdate(subcategory.id, { name: editedName });
        onClose();
      } catch (error) {
        toast.error("Failed to update subcategory.");
      }
    } else {
      toast.error("Please enter a subcategory name");
    }
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
          <h2 className="text-2xl font-bold text-[#142237]">Modifier la sous-catégorie</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la sous-catégorie
            </label>
            <input
              id="subcategoryName"
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
            onClick={handleUpdate}
            className="px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
          >
            Modifier
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default EditSubcategoryModal;