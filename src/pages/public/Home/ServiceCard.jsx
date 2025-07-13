import React from 'react';
import { Star, MapPin, CircleChevronRight, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ id, view, title, keywords, description, rating, location, image, date }) => {
  const commonContent = (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg sm:text-xl mb-1">{title}</h3> 
          <p className="text-gray-500 text-xs sm:text-sm">{keywords}</p> 
        </div>
        <span className="text-gray-400 text-xs sm:text-sm">{date}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {['Restaurant', 'Traiteurs', 'Chefs Particulier', 'Recette fait maison'].map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
          <MoreHorizontal size={14} className="mr-1" />
        </span>
      </div>
      <p className="text-gray-600 text-xs sm:text-sm mb-4 flex-grow">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="image.jpg" alt="Owner" className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full mr-2" />
          <span className="text-xs sm:text-sm font-medium">John Doe</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Star className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">{rating}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#E5181D]" />
            <span className="text-xs sm:text-sm">{location}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <Link to={`/service/${id}`} className="mt-4 bg-[#E5181D] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center w-full sm:w-1/4">
          Consulter <CircleChevronRight size={16} className="ml-1 mt-1" />
        </Link>
      </div>
    </div>
  );

  
   
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row m-4"> 
        <img src={image} alt={title} className="w-full sm:w-1/3 h-48 object-cover sm:h-auto" />
        <div className="p-6 flex-1 flex flex-col">
          {commonContent}
        </div>
      </div>

  
};

export default ServiceCard;