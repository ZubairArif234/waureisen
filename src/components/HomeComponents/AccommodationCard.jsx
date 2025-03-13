import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const AccommodationCard = ({ id = '1', image, price, location, provider }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div 
        className="rounded-xl overflow-hidden mb-3 relative cursor-pointer"
        onClick={() => navigate(`/accommodation/${id}`)}
      >
        <img 
          src={image} 
          alt={location}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking the heart
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      <div 
        className="space-y-1 cursor-pointer"
        onClick={() => navigate(`/accommodation/${id}`)}
      >
        <p className="text-brand text-sm">CHF {price.toFixed(2)} per night</p>
        <h3 className="font-medium text-gray-900">{location}</h3>
        <p className="text-gray-500 text-sm">{provider}</p>
      </div>
    </div>
  );
};

export default AccommodationCard;