import React from 'react';
import ReactModal from 'react-modal';
import { X } from 'lucide-react';
import ServiceForm from './ServiceForm';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(20, 34, 55, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '80vw',
    width: '100%',
    padding: '0',
    border: 'none',
    borderRadius: '0.5rem',
    background: '#fff',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'visible'
  }
};

const ServiceModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  formData,
  handleChange,
  keywords,
  handleKeywordsChange,
  handleAddKeyword,
  handleRemoveKeyword,
  handleImageUpload,
  categories,
  subcategories
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel={title}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#142237]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <ServiceForm
            formData={formData}
            handleChange={handleChange}
            keywords={keywords}
            handleKeywordsChange={handleKeywordsChange}
            handleAddKeyword={handleAddKeyword}
            handleRemoveKeyword={handleRemoveKeyword}
            handleImageUpload={handleImageUpload}
            categories={categories}
            subcategories={subcategories}
          />

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#142237] rounded-lg hover:bg-[#1d2f4a] transition-colors duration-200"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default ServiceModal; 