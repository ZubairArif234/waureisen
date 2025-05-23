// src/components/SearchComponents/SkeletonCard.jsx
import React from 'react';

/**
 * Skeleton loader for accommodation cards
 * Preserves layout structure while content is loading
 */
const SkeletonCard = () => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 h-full animate-pulse">
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gray-300 w-full">
        {/* Price tag placeholder */}
        <div className="absolute bottom-3 left-3 bg-gray-200 py-1 px-3 rounded-full w-24 h-6" />
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title placeholder */}
        <div className="bg-gray-200 h-5 w-3/4 rounded" />
        
        {/* Location placeholder */}
        <div className="flex items-center space-x-1">
          <div className="bg-gray-200 h-4 w-1/2 rounded" />
        </div>
        
        {/* Provider placeholder */}
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 h-4 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;