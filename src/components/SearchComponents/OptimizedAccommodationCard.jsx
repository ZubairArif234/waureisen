// src/components/SearchComponents/OptimizedAccommodationCard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useListings } from '../../context/ListingContext';

/**
 * Optimized Accommodation Card with lazy loading and fallback logic
 * Simplified for reliability
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Listing ID
 * @param {boolean} props.preloaded - Whether the listing data is already loaded
 */
const OptimizedAccommodationCard = ({ 
  id, 
  preloaded = false
}) => {
  const navigate = useNavigate();
  const { 
    listingsMap, 
    loadedIds, 
    loadingIds, 
    fetchSingleListing, 
    setActiveListing 
  } = useListings();
  
  const [isLoaded, setIsLoaded] = useState(preloaded || loadedIds.includes(id));
  const [isLoading, setIsLoading] = useState(loadingIds.includes(id));
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get listing data from context if available
  const listing = listingsMap[id];
  
  // Fetch listing data if not already loaded/loading
  useEffect(() => {
    const loadListing = async () => {
      if (!listing && !isLoading && !isLoaded) {
        setIsLoading(true);
        await fetchSingleListing(id);
        setIsLoaded(true);
        setIsLoading(false);
      } else if (listing) {
        setIsLoaded(true);
        setIsLoading(false);
      }
    };
    
    loadListing();
  }, [id, listing, isLoaded, isLoading, fetchSingleListing]);
  
  // Navigate to detail page on click
  const handleClick = useCallback(() => {
    navigate(`/accommodation/${id}`, {
      state: {
        pricePerNight: listing?.pricePerNight || { price: 0, currency: "CHF" },
        checkInDate: null // Handle date logic based on your app's requirements
      }
    });
  }, [navigate, id, listing]);
  
  // Set as active listing on hover (for map synchronization)
  const handleMouseEnter = useCallback(() => {
    setActiveListing(id);
  }, [id, setActiveListing]);
  
  // Clear active listing on mouse leave
  const handleMouseLeave = useCallback(() => {
    setActiveListing(null);
  }, [setActiveListing]);
  
  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);
  
  // If listing is not yet loaded, show skeleton
  if (!listing) {
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
  }
  
  // Extract needed data from listing
  const { 
    images = [], 
    title = "Accommodation", 
    location = { address: "Unknown location" },
    provider = "Unknown",
    pricePerNight = { price: 0, currency: "CHF" }
  } = listing;
  
  const imageUrl = images && images.length > 0 ? images[0] : null;
  
  return (
    <div 
      className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 h-full cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-300 w-full">
        {imageUrl && (
          <>
            {/* Image with fade-in effect */}
            <img
              src={imageUrl}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
            />
          </>
        )}
        
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-white py-1 px-3 rounded-full shadow-md z-10">
          <span className="font-medium text-sm">
            {pricePerNight.price} {pricePerNight.currency}/night
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
        
        {/* Location */}
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-500 truncate">{location.address}</span>
        </div>
        
        {/* Provider */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{provider}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OptimizedAccommodationCard);