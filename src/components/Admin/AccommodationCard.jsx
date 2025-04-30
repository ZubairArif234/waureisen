import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Star, CheckCheck, AlertTriangle } from "lucide-react";
import { getFeaturedAccommodations } from "../../api/adminAPI";
import {
  getCloudinaryUrl,
  isCloudinaryUrl,
  handleImageError,
} from "../../utils/cloudinaryConfig";

const AccommodationCard = ({
  accommodation,
  onEdit,
  onToggleStatus,
  onDelete,
  onAddToFeatured,
  onRemoveFromFeatured,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom"); // 'top' or 'bottom'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [fetchingFeatured, setFetchingFeatured] = useState(false);
  const [featuredError, setFeaturedError] = useState(false);
  const [error, setError] = useState(null);

  const statusColors = {
    active: "bg-green-100 text-green-800",
    closed: "bg-amber-100 text-amber-800",
    pending: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    deleted: "bg-gray-100 text-gray-800",
  };

  // Function to set error with auto-clear
  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 8000);
  };

  // Check if this accommodation is in any featured section
  const [featuredSections, setFeaturedSections] = useState([]);

  useEffect(() => {
    if (!accommodation?._id) return;

    const fetchFeaturedStatus = async (retryCount = 0) => {
      try {
        setFetchingFeatured(true);
        setFeaturedError(false);

        const featured = await getFeaturedAccommodations();
        const sections = [];

        if (featured.featured_accommodations.includes(accommodation._id)) {
          sections.push("Featured");
        }
        if (featured.new_accommodations.includes(accommodation._id)) {
          sections.push("New");
        }
        if (featured.popular_accommodations.includes(accommodation._id)) {
          sections.push("Popular");
        }

        setFeaturedSections(sections);
      } catch (error) {
        console.error("Error fetching featured status:", error);

        // Retry on network errors
        if (!error.response && retryCount < 2) {
          console.log(
            `Retrying featured status fetch (attempt ${retryCount + 1})...`
          );
          const delay = Math.pow(2, retryCount) * 800;
          setTimeout(() => {
            fetchFeaturedStatus(retryCount + 1);
          }, delay);
          return;
        }

        // Don't show any featured status badges on error
        setFeaturedSections([]);
        setFeaturedError(true);
        setErrorWithTimeout("Failed to load featured status");
      } finally {
        setFetchingFeatured(false);
      }
    };

    fetchFeaturedStatus();
  }, [accommodation._id]);

  // Calculate menu position when showing
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;

      // Use a fixed estimate for menu height
      const estimatedMenuHeight = 120; // Estimate for 3 options

      // If there's not enough space below, position the menu above
      if (spaceBelow < estimatedMenuHeight) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
    }
  }, [showMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Menu options with consistent styling and behavior
  const menuOptions = [
    {
      label: "Edit",
      onClick: () => {
        setErrorWithTimeout("Edit functionality is currently disabled");
        setShowMenu(false);
      },
      className: "text-gray-400 hover:bg-gray-100 cursor-not-allowed",
      disabled: true
    },
    {
      label: accommodation.status === "active" ? "Deactivate" : "Activate",
      onClick: () => {
        onToggleStatus(accommodation._id, accommodation.status);
        setShowMenu(false);
      },
      className: "text-gray-700 hover:bg-gray-100",
    },
    {
      label: "Add to",
      onClick: () => {
        onAddToFeatured(accommodation._id);
        setShowMenu(false);
      },
      className: "text-gray-700 hover:bg-gray-100",
    },
    ...(featuredSections.length > 0
      ? [
          {
            label: "Remove from",
            onClick: () => {
              onRemoveFromFeatured(accommodation._id, featuredSections);
              setShowMenu(false);
            },
            className: "text-amber-600 hover:bg-amber-50",
          },
        ]
      : []),
    {
      label: "Delete",
      onClick: () => {
        onDelete(accommodation._id, accommodation.title);
        setShowMenu(false);
      },
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMenu]);

  // Get first image or use a default
  const firstImage = accommodation.images?.[0]?.url || "";
  const imgSrc = isCloudinaryUrl(firstImage)
    ? getCloudinaryUrl(firstImage, "c_fill,g_auto,h_300,w_500")
    : firstImage || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 transition-all duration-300 hover:shadow-md relative">
      {/* Error message */}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-800 text-sm p-2 text-center">
          {error}
        </div>
      )}
      
      {/* Featured badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-60px)]">
        {fetchingFeatured ? (
          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
            <div className="animate-spin h-3 w-3 border-b-2 border-gray-800 rounded-full mr-1"></div>
            Loading...
          </div>
        ) : featuredError ? (
          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </div>
        ) : (
          featuredSections.map((section) => (
            <div
              key={section}
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                section === "Featured"
                  ? "bg-orange-100 text-orange-800"
                  : section === "New"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {section === "Featured" ? (
                <Star className="h-3 w-3 mr-1" />
              ) : section === "New" ? (
                <CheckCheck className="h-3 w-3 mr-1" />
              ) : (
                <CheckCheck className="h-3 w-3 mr-1" />
              )}
              {section}
            </div>
          ))
        )}
      </div>

      {/* Status badge */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            statusColors[accommodation.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {accommodation.status || "N/A"}
        </span>
      </div>

      {/* Image container */}
      <div className="h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={accommodation.title}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, "/placeholder.jpg")}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
              {accommodation.title || "Unnamed Accommodation"}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {accommodation.location?.city}, {accommodation.location?.country}
            </p>
          </div>

          {/* More dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div
                className={`absolute ${
                  menuPosition === "top" ? "bottom-8" : "top-8"
                } right-0 w-36 bg-white shadow-lg rounded-md z-20 border border-gray-200 py-1 text-sm`}
              >
                {menuOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={option.onClick}
                    className={`w-full text-left px-4 py-2 ${option.className}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center justify-between">
          <div className="font-medium">
            €{accommodation.pricing?.basePrice || "N/A"}
            <span className="text-xs text-gray-500"> / night</span>
          </div>
          <div className="text-xs text-gray-500">
            ID: {accommodation._id.substring(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
