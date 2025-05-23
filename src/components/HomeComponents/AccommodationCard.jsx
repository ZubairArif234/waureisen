import React, { useState, memo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../api/config";
import { useLanguage } from "../../utils/LanguageContext";

const AccommodationCard = ({
  id = "1",
  image,
  images = [], // Add images array prop
  price,
  location: propertyLocation,
  provider,
  listingSource,
  isFavorited = false,
  pricePerNight,
  onToggleFavorite,
  owner, // Add owner prop to get provider details
}) => {
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const checkInDate = searchParams.get("dates")?.split(" - ")[0] || "";
  const { t } = useLanguage();

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

  // Update local state when prop changes
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

  const handleClick = () => {
    navigate(`/accommodation/${id}`, {
      state: {
        pricePerNight: pricePerNight || { price, currency: "CHF" },
        checkInDate: formattedCheckInDate,
      },
    });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      if (newFavoriteState) {
        await API.post(`/users/favorites/${id}`);
      } else {
        await API.delete(`/users/favorites/${id}`);
      }

      if (onToggleFavorite) {
        onToggleFavorite(id);
      }
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      setIsFavorite(isFavorite);
    }
  };

  // Improved display source logic
  const getDisplaySource = () => {
    // If listingSource is provided and it's not "waureisen", use it
    if (listingSource && listingSource.toLowerCase() !== "waureisen") {
      return listingSource;
    }
    
    // If provider is provided and it's not "waureisen", use it
    if (provider && provider.toLowerCase() !== "waureisen") {
      return provider;
    }
    
    // If we have owner information, try to use that
    if (owner) {
      // If owner has a display name, use it
      if (owner.displayName) {
        return owner.displayName;
      }
      
      // If owner has firstName and lastName, combine them
      if (owner.firstName || owner.lastName) {
        return `${owner.firstName || ''} ${owner.lastName || ''}`.trim();
      }
      
      // If owner has username, use it
      if (owner.username) {
        return owner.username;
      }
    }
    
    // Check if this is an Interhome listing
    if (listingSource?.toLowerCase() === "interhome" || provider?.toLowerCase() === "interhome") {
      return "Interhome";
    }
    
    // For all other cases where we can't determine the source, use "Host"
    return "Host";
  };

  const displaySource = getDisplaySource();

  return (
    <div className="flex flex-col">
      <div
        className="rounded-xl overflow-hidden mb-3 relative cursor-pointer"
        onClick={handleClick}
      >
        {/* Main image with lazy loading */}
        <img
          src={allImages[currentImageIndex]}
          alt={propertyLocation}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onLoad={() => handleImageLoad(currentImageIndex)}
        />

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

      <div className="space-y-1 cursor-pointer" onClick={handleClick}>
        <p className="text-brand text-sm">
          {pricePerNight?.currency || "CHF"}{" "}
          {(pricePerNight?.price || price).toFixed(2)} {t("per_night")}
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
    prevProps.images === nextProps.images &&
    prevProps.price === nextProps.price &&
    prevProps.location === nextProps.location &&
    prevProps.pricePerNight?.price === nextProps.pricePerNight?.price &&
    prevProps.isFavorited === nextProps.isFavorited &&
    prevProps.owner === nextProps.owner
  );
});