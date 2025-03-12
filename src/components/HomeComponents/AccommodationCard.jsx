import React from 'react';

const AccommodationCard = ({ image, price, location, provider }) => {
  return (
    <div className="flex flex-col">
      <div className="rounded-xl overflow-hidden mb-3">
        <img 
          src={image} 
          alt={location}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
        <p className="text-brand text-sm">CHF {price.toFixed(2)} per night</p>
        <h3 className="font-medium text-gray-900">{location}</h3>
        <p className="text-gray-500 text-sm">{provider}</p>
      </div>
    </div>
  );
};

export default AccommodationCard;