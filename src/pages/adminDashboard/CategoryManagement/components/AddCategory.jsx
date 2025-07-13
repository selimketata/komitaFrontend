import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import ReactModal from "react-modal";
import { toast } from 'react-toastify';
import { modalStyles } from "../styles";

const AddCategory = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const handleAdd = async () => {
    if (newCatName) {
      const newCategory = {
        name: newCatName
      };
      await onAdd(newCategory);
      setOpen(false);
      setNewCatName("");
    } else {
      toast.error("Veuillez remplir le nom de la catégorie");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200 shadow-md"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">Nouvelle catégorie</span>
      </button>
      <ReactModal
        isOpen={open}
        style={modalStyles}
        className="w-[90%] max-w-md"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#142237]">Nouvelle catégorie</h2>
            <button
              onClick={() => setOpen(false)}
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
                placeholder="Saisir le nom de la catégorie"
                value={newCatName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#142237] focus:border-transparent outline-none transition-all duration-200"
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#142237] text-white rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
            >
              Ajouter
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default AddCategory;