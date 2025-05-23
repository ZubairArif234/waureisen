// Enhanced AccommodationCard.jsx with improved Interhome pricing handling

import React, { useState, memo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../api/config";
import { useLanguage } from "../../utils/LanguageContext";
import { fetchInterhomePrices } from "../../api/interhomeAPI";

const AccommodationCard = ({
  id = "1",
  image,
  images = [], // Images array prop
  price,
  location: propertyLocation,
  provider,
  listingSource,
  isFavorited = false,
  pricePerNight,
  onToggleFavorite,
  // Add Interhome-specific props
  Code,
  interhomePriceData,
  // Original listing object for passing complete data
  originalListing
}) => {
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(false);
  // Store local price data in case we need to fetch it
  const [localPriceData, setLocalPriceData] = useState(pricePerNight);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Get date parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const checkInDate = searchParams.get("dates")?.split(" - ")[0] || "";

  // Combine single image with images array, avoiding duplicates
  const allImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return image ? [image] : [];
    }
    // If we have both image and images array, and the first image in array matches the single image,
    // use only the images array to avoid duplicates
    if (image && images[0] === image) {
      return images;
    }
    // If we have both but they're different, combine them
    return image ? [image, ...images] : images;
  }, [image, images]);

  // Update local state when isFavorited prop changes
  useEffect(() => {
    setIsFavorite(isFavorited);
  }, [isFavorited]);

  // Handle image loading
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  // Handle slider navigation
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Format the date if needed
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formattedCheckInDate = formatDate(checkInDate);

  // Fetch Interhome price data if needed
  useEffect(() => {
    const fetchInterhomePrice = async () => {
      // Only fetch for Interhome listings with Code and when check-in date is available
      if (
        provider === 'Interhome' && 
        Code && 
        formattedCheckInDate && 
        !interhomePriceData &&
        !loading
      ) {
        setLoading(true);
        try {
          console.log(`Fetching Interhome price for ${Code} with date ${formattedCheckInDate}`);
          
          const response = await fetchInterhomePrices({
            accommodationCode: Code,
            checkInDate: formattedCheckInDate,
            los: true
          });
          
          // Process the price data
          if (response?.priceList?.prices?.price?.length > 0) {
            // Get options for 7-night stay, sorted by guest capacity
            const duration7Options = response.priceList.prices.price
              .filter(option => option.duration === 7)
              .sort((a, b) => a.paxUpTo - b.paxUpTo);
            
            if (duration7Options.length > 0) {
              // Get the first option (lowest guest capacity)
              const selectedOption = duration7Options[0];
              const calculatedPricePerNight = Math.round(selectedOption.price / 7);
              
              // Set the local price data
              setLocalPriceData({
                price: calculatedPricePerNight,
                currency: response.priceList.currency || 'CHF',
                totalPrice: selectedOption.price,
                duration: 7,
                paxUpTo: selectedOption.paxUpTo
              });
              
              console.log(`Price data fetched for ${Code}: ${calculatedPricePerNight} ${response.priceList.currency}/night`);
            }
          }
        } catch (error) {
          console.error(`Error fetching Interhome price for ${Code}:`, error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchInterhomePrice();
  }, [Code, formattedCheckInDate, provider, interhomePriceData, loading]);

  // Handle click to navigate to the accommodation details
  const handleClick = () => {
    // Determine the price data to pass
    // First use localPriceData if available (which could be from API fetch)
    // Then use pricePerNight from props
    // Finally fallback to a simple price object
    const priceData = localPriceData || pricePerNight || { price, currency: "CHF" };
    
    // Prepare Interhome-specific data if needed
    const interhomeData = {};
    if (provider === 'Interhome' && Code) {
      interhomeData.Code = Code;
      
      // Include any Interhome price data we have
      if (interhomePriceData) {
        interhomeData.interhomePriceData = interhomePriceData;
      }
    }
    
    // Navigate to the accommodation details page
    navigate(`/accommodation/${id}`, {
      state: {
        pricePerNight: priceData,
        checkInDate: formattedCheckInDate,
        ...interhomeData,
        // Pass the complete original listing if available
        originalListing
      },
    });
  };

  // Handle favorite toggling
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      // Call the API to update the favorite status
      if (newFavoriteState) {
        await API.post(`/users/favorites/${id}`);
      } else {
        await API.delete(`/users/favorites/${id}`);
      }

      // Call the callback if provided
      if (onToggleFavorite) {
        onToggleFavorite(id);
      }
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      // Revert to previous state on error
      setIsFavorite(isFavorite);
    }
  };

  // Determine the display source (provider or listing source)
  const displaySource = listingSource || provider || "Unknown";

  // Determine the price to display
  // First use localPriceData if available (which could be from API fetch)
  // Then use pricePerNight from props
  // Finally fallback to the price prop
  const displayPrice = localPriceData?.price || pricePerNight?.price || price || 0;
  const displayCurrency = localPriceData?.currency || pricePerNight?.currency || "CHF";

  return (
    <div className="flex flex-col">
      <div
        className="rounded-xl overflow-hidden mb-3 relative cursor-pointer"
        onClick={handleClick}
      >
        {/* Main image with lazy loading */}
        {allImages[currentImageIndex] ? (
          <img
            src={allImages[currentImageIndex]}
            alt={propertyLocation}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onLoad={() => handleImageLoad(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}

        {/* Navigation arrows - only show if there are multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded-md shadow">
            {currentImageIndex + 1}/{allImages.length}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Source badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded-md shadow">
          {displaySource}
        </div>
      </div>

      {/* Price and location info */}
      <div className="space-y-1 cursor-pointer" onClick={handleClick}>
        <p className="text-brand text-sm">
          {displayCurrency}{" "}
          {displayPrice.toFixed(2)} {t("per_night")}
          {loading && <span className="ml-2 text-xs text-gray-500">(Loading price...)</span>}
        </p>
        <h3 className="font-medium text-gray-900">{propertyLocation}</h3>
      </div>

      {/* Preload next image */}
      {allImages.length > 1 && (
        <img
          src={allImages[(currentImageIndex + 1) % allImages.length]}
          alt=""
          className="hidden"
          onLoad={() => handleImageLoad((currentImageIndex + 1) % allImages.length)}
        />
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AccommodationCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.image === nextProps.image &&
    JSON.stringify(prevProps.images) === JSON.stringify(nextProps.images) &&
    prevProps.price === nextProps.price &&
    prevProps.location === nextProps.location &&
    prevProps.provider === nextProps.provider &&
    prevProps.Code === nextProps.Code &&
    JSON.stringify(prevProps.pricePerNight) === JSON.stringify(nextProps.pricePerNight) &&
    prevProps.isFavorited === nextProps.isFavorited
  );
});