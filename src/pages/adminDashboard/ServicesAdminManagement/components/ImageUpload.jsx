import React from 'react';
import { Image } from 'lucide-react';

const ImageUpload = ({ images, handleImageUpload }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Image className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 800x400px)</p>
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
              >
                {image.fileName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 