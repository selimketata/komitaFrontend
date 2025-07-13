import React from 'react';
import { useNavigate } from 'react-router-dom';

function ServiceNotFound({ message }) {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{message || 'Service non trouvé'}</h2>
        <p className="text-gray-600 mb-6">
          Nous n'avons pas pu trouver le service que vous recherchez. Il a peut-être été supprimé ou déplacé.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/service')}
            className="bg-[#E5181D] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voir tous les services
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceNotFound;