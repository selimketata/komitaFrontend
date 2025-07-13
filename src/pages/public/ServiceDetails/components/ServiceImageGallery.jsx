import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ServiceImageGallery({ images, currentIndex, onImageChange }) {
  const [visibleThumbnails, setVisibleThumbnails] = useState([]);
  const maxVisibleThumbnails = 3;

  // Update visible thumbnails when images or currentIndex changes
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    // Calculate which thumbnails should be visible
    let startIdx = Math.max(0, currentIndex - Math.floor(maxVisibleThumbnails / 2));
    if (startIdx + maxVisibleThumbnails > images.length) {
      startIdx = Math.max(0, images.length - maxVisibleThumbnails);
    }
    
    const visibleIndices = [];
    for (let i = 0; i < maxVisibleThumbnails && startIdx + i < images.length; i++) {
      visibleIndices.push(startIdx + i);
    }
    
    setVisibleThumbnails(visibleIndices);
  }, [images, currentIndex, maxVisibleThumbnails]);

  // If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg shadow-inner">
        <p className="text-gray-500 font-medium">Aucune image disponible</p>
      </div>
    );
  }

  const handlePrevImage = () => {
    onImageChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNextImage = () => {
    onImageChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };



  return (
    <div className="relative">
      {/* Main image with navigation arrows */}
      <div className="w-full h-[400px] overflow-hidden relative rounded-lg shadow-md group">
        <div className={`w-full h-full transition-transform duration-500 ease-in-out`}>
          <img 
            src={images[currentIndex]?.id 
              ? `https://komitabackend.onrender.com/api/v1/images/${images[currentIndex].id}/data` 
              : '/assets/default-image.png'}
            alt="Service" 
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/default-image.png';
            }}
          />
        </div>
        
        
        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-800" />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-800" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnail navigation - limited to 3 visible thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 px-4 pb-4">
          <div className="flex justify-center items-center">
            {images.length > maxVisibleThumbnails && (
              <button 
                onClick={handlePrevImage}
                className="mr-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                aria-label="Previous thumbnails"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            
            <div className="flex space-x-3">
              {visibleThumbnails.map(index => (
                <button
                  key={index}
                  onClick={() => onImageChange(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                    index === currentIndex ? 'border-[#E5181D] scale-110' : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img 
                    src={images[index]?.id 
                      ? `https://komitabackend.onrender.com/api/v1/images/${images[index].id}/data` 
                      : '/assets/default-image.png'}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/default-image.png';
                    }}
                  />
                </button>
              ))}
            </div>
            
            {images.length > maxVisibleThumbnails && (
              <button 
                onClick={handleNextImage}
                className="ml-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                aria-label="Next thumbnails"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          {/* Dots indicator for all images */}
          <div className="flex justify-center mt-3 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onImageChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-[#E5181D] w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceImageGallery;