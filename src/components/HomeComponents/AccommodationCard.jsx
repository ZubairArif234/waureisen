import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLanguage } from "../../utils/LanguageContext";

const AccommodationCard = ({
  id = "1",
  image,
  price,
  location: propertyLocation, // Renamed from location to propertyLocation
  provider,
  listingSource, // Add listingSource prop
  isFavorited = false,
  pricePerNight,
}) => {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const checkInDate = searchParams.get("dates")?.split(" - ")[0] || "";

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

  // Determine the display source - use listingSource with priority
  // If not available, use provider, but never default to "Waureisen"
  const displaySource = listingSource || provider || "Unknown";

  return (
    <div className="flex flex-col">
      <div
        className="rounded-xl overflow-hidden mb-3 relative cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={image}
          alt={propertyLocation}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        {/* Source badge with improved styling */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded-md shadow">
          {displaySource}
        </div>
      </div>
      <div className="space-y-1 cursor-pointer" onClick={handleClick}>
        <p className="text-brand text-sm">CHF {price.toFixed(2)} {t("per_night")}</p>
        <p className="text-brand text-sm">{pricePerNight?.currency || "CHF"} {(pricePerNight?.price || price).toFixed(2)} per night</p>
        <h3 className="font-medium text-gray-900">{propertyLocation}</h3>
      </div>
    </div>
  );
};

export default AccommodationCard;
