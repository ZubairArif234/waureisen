import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Sliders,
  AlertTriangle,
  Star,
} from "lucide-react";
import {
  getPaginatedListings,
  deleteListing,
  closeListing,
  getFeaturedAccommodations,
  addToFeaturedSection,
  removeFromFeaturedSection,
} from "../../api/adminAPI";
import {
  getCloudinaryUrl,
  isCloudinaryUrl,
  handleImageError,
} from "../../utils/cloudinaryConfig";
import AddToFeaturedModal from "../../components/Admin/AddToFeaturedModal";

// Default sources to use while loading or if API doesn't return any
const DEFAULT_SOURCES = [
  { id: "interhome", name: "Interhome" },
  { id: "provider", name: "Provider" },
  { id: "admin", name: "Admin" },
];

// Skeleton card for loading state
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="w-3/4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

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
  const statusColors = {
    active: "bg-green-100 text-green-800",
    closed: "bg-amber-100 text-amber-800",
    pending: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    deleted: "bg-gray-100 text-gray-800",
  };

  // Check if this accommodation is in any featured section
  const [featuredSections, setFeaturedSections] = useState([]);

  useEffect(() => {
    if (!accommodation?._id) return;

    const fetchFeaturedStatus = async () => {
      try {
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
        // Don't show any featured status badges on error
        setFeaturedSections([]);
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

      // Use a fixed estimate for menu height instead of calculating from menuOptions
      const estimatedMenuHeight = 120; // Estimate for 3 options (Edit, Activate/Deactivate, Delete)

      // If there's not enough space below, position the menu above
      if (spaceBelow < estimatedMenuHeight) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
    }
  }, [showMenu]); // Remove menuOptions.length from dependencies

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
        onEdit(accommodation._id);
        setShowMenu(false);
      },
      className: "text-gray-700 hover:bg-gray-100",
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
      <div className="relative">
        {(accommodation.photos && accommodation.photos.length > 0) ||
        (accommodation.images && accommodation.images.length > 0) ? (
          <img
            src={
              accommodation.photos && accommodation.photos.length > 0
                ? isCloudinaryUrl(accommodation.photos[0])
                  ? accommodation.photos[0]
                  : getCloudinaryUrl(accommodation.photos[0])
                : isCloudinaryUrl(accommodation.images[0])
                ? accommodation.images[0]
                : getCloudinaryUrl(accommodation.images[0])
            }
            alt={accommodation.title}
            className="w-full h-48 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
          {accommodation.source?.name || "Unknown"}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{accommodation.title}</h3>
            <p className="text-sm text-gray-500">
              {accommodation.location?.address || "No location"}
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Open options menu"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {/* Mobile Dropdown Menu - Opens at bottom of screen */}
            {showMenu && window.innerWidth < 768 && (
              <>
                {/* Backdrop for mobile */}
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => setShowMenu(false)}
                />

                {/* Menu fixed to bottom of screen */}
                <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg z-50 p-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>

                  {menuOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={option.onClick}
                      className={`w-full text-left px-4 py-3 text-sm ${
                        option.className
                      } ${
                        index < menuOptions.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full py-3 mt-2 text-sm font-medium text-gray-500 border-t border-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Desktop Dropdown Menu - Smart positioning */}
            {showMenu && window.innerWidth >= 768 && (
              <div
                ref={menuRef}
                className="fixed right-auto w-32 bg-white rounded-md shadow-lg z-[1000] border border-gray-200 py-1"
                style={{
                  left: buttonRef.current
                    ? buttonRef.current.getBoundingClientRect().left - 100
                    : "auto",
                  ...(menuPosition === "top"
                    ? {
                        bottom:
                          window.innerHeight -
                          (buttonRef.current?.getBoundingClientRect().top || 0),
                      }
                    : {
                        top:
                          buttonRef.current?.getBoundingClientRect().bottom ||
                          0,
                      }),
                  overflow: "visible",
                }}
              >
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.onClick}
                    className={`w-full text-left px-4 py-2 text-sm ${option.className}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[accommodation.status] || statusColors.pending
            }`}
          >
            {accommodation.status.charAt(0).toUpperCase() +
              accommodation.status.slice(1)}
          </div>

          {featuredSections.length > 0 && (
            <div className="flex gap-1">
              {featuredSections.map((section, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center"
                >
                  <Star className="w-3 h-3 mr-1" /> {section}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete Listing</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "
            <span className="font-medium">{listingTitle}</span>"? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Accommodations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOperation, setLoadingOperation] = useState(""); // Track specific operation
  const [accommodations, setAccommodations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentFeaturedCounts, setCurrentFeaturedCounts] = useState({
    featured_accommodations: 0,
    new_accommodations: 0,
    popular_accommodations: 0,
  });

  // Delete confirmation modal
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  // Add to featured modal
  const [addToFeaturedModalOpen, setAddToFeaturedModalOpen] = useState(false);
  const [removeFromFeaturedModalOpen, setRemoveFromFeaturedModalOpen] =
    useState(false);
  const [selectedForFeatured, setSelectedForFeatured] = useState(null);
  const [featuredSectionsToRemove, setFeaturedSectionsToRemove] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  // Remove the form submission functions and keep the direct search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Search as you type
    setSearch(e.target.value);
    if (page !== 1) {
      setPage(1); // Reset to first page when searching
    }
  };

  useEffect(() => {
    fetchAccommodations();
    fetchFeaturedCounts();
  }, [page, search]); // Refetch when page or search changes

  // Fetch accommodations with pagination, filtering, and search
  const fetchAccommodations = async (retryCount = 0) => {
    try {
      setLoading(true);
      setLoadingOperation("fetchingAccommodations");

      // Build query parameters
      const queryParams = {
        page: currentPage,
        search: searchTerm,
      };

      // Add filters if selected
      if (selectedSource) {
        queryParams.source = selectedSource;
      }
      if (selectedStatus) {
        queryParams.status = selectedStatus;
      }

      // Fetch listings with pagination and filters
      const response = await getPaginatedListings(
        queryParams.page,
        9, // Fixed page size
        queryParams.search
      );

      setAccommodations(response.listings || []);
      setTotalPages(response.totalPages || 1);

      // Extract unique sources
      if (response.listings?.length > 0) {
        const uniqueSources = extractUniqueSources(response.listings);
        setSources(uniqueSources);
      }

      setError("");
    } catch (err) {
      console.error("Error fetching accommodations:", err);

      // Handle network errors with retry
      if (!err.response && retryCount < 2) {
        // Wait a moment then retry
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying fetchAccommodations after ${delay}ms...`);

        setTimeout(() => {
          fetchAccommodations(retryCount + 1);
        }, delay);
        return;
      }

      if (err.message?.includes("Network error")) {
        setError(
          "Network error while loading accommodations. Please check your connection and try again."
        );
      } else {
        setError("Failed to load accommodations. Please try again.");
      }

      // Clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
      setLoadingOperation("");
    }
  };

  // Fetch counts of featured items
  const fetchFeaturedCounts = async (retryCount = 0) => {
    try {
      const featured = await getFeaturedAccommodations();

      // Update featured counts
      setCurrentFeaturedCounts({
        featured_accommodations: featured.featured_accommodations.length,
        new_accommodations: featured.new_accommodations.length,
        popular_accommodations: featured.popular_accommodations.length,
      });
    } catch (err) {
      console.error("Error fetching featured counts:", err);

      // Handle network errors with retry
      if (!err.response && retryCount < 2) {
        // Wait a moment then retry
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying fetchFeaturedCounts after ${delay}ms...`);

        setTimeout(() => {
          fetchFeaturedCounts(retryCount + 1);
        }, delay);
        return;
      }

      // We don't show error for this as it's not critical
      // But we set default values
      setCurrentFeaturedCounts({
        featured_accommodations: 0,
        new_accommodations: 0,
        popular_accommodations: 0,
      });
    }
  };

  // Handler for adding to featured section (displays modal)
  const handleAddToFeatured = (id) => {
    const accommodation = accommodations.find((acc) => acc._id === id);
    setAddToFeaturedModalOpen(true);
    setSelectedForFeatured(accommodation);
  };

  // Handler for confirming add to featured
  const handleConfirmAddToFeatured = async (section) => {
    // Create section-specific loading state
    const sectionName =
      section === "featured_accommodations"
        ? "Featured"
        : section === "new_accommodations"
        ? "New"
        : "Popular";

    setLoading(true);
    setSuccessMessage(""); // Clear any previous success messages
    setError(""); // Clear any previous errors

    // Add a specific processing message
    setSuccessMessage(`Adding to ${sectionName} section... Please wait.`);

    try {
      const response = await addToFeaturedSection(
        selectedForFeatured._id,
        section
      );

      // Check if there were any skipped listings
      if (
        response.data?.skippedListings &&
        response.data.skippedListings.length > 0
      ) {
        // Get the first skipped listing
        const skipped = response.data.skippedListings[0];
        setError(
          `Cannot add to recommendations: ${skipped.title || "Listing"} is ${
            skipped.reason
          }`
        );
        // Clear the error after 5 seconds
        setTimeout(() => {
          setError("");
        }, 5000);

        setSuccessMessage(""); // Clear the processing message
        setLoading(false);
        setAddToFeaturedModalOpen(false);
        setSelectedForFeatured(null);
        return;
      }

      // Clear the processing message
      setSuccessMessage("");

      // Show success message with section name
      setSuccessMessage(`Successfully added to ${sectionName} Accommodations!`);

      // Refresh the featured counts to update the UI
      await fetchFeaturedCounts();

      // Clear the success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Update the UI to show the change immediately
      await fetchAccommodations();

      setError("");
    } catch (err) {
      console.error("Error adding to featured section:", err);
      setSuccessMessage(""); // Clear any processing message

      // Show more helpful error messages
      if (err.response?.data?.message?.includes("Listing with ID")) {
        setError(
          `The listing could not be added. The server reported: ${err.response.data.message}`
        );
      } else if (err.message?.includes("Network error")) {
        setError(
          `Network error while adding to ${sectionName} Accommodations. Please check your connection and try again.`
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          `Failed to add to ${sectionName} Accommodations. Please try again.`
        );
      }

      // Clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
      setAddToFeaturedModalOpen(false);
      setSelectedForFeatured(null);
    }
  };

  // Handler for removing from featured section (displays modal)
  const handleRemoveFromFeatured = (id, featuredSections) => {
    const accommodation = accommodations.find((acc) => acc._id === id);
    setRemoveFromFeaturedModalOpen(true);
    setSelectedForFeatured(accommodation);
    setFeaturedSectionsToRemove(featuredSections);
  };

  // Handler for confirming remove from featured
  const handleConfirmRemoveFromFeatured = async (section) => {
    // Create section-specific loading state
    const sectionName =
      section === "featured_accommodations"
        ? "Featured"
        : section === "new_accommodations"
        ? "New"
        : "Popular";

    setLoading(true);
    setSuccessMessage(""); // Clear any previous success messages
    setError(""); // Clear any previous errors

    // Add a specific processing message
    setSuccessMessage(`Removing from ${sectionName} section... Please wait.`);

    try {
      await removeFromFeaturedSection(selectedForFeatured._id, section);

      // Clear processing message
      setSuccessMessage("");

      // Show success message
      setSuccessMessage(
        `Successfully removed from ${sectionName} Accommodations!`
      );

      // Refresh the featured counts
      await fetchFeaturedCounts();

      // Clear the success message after a few seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // The card will re-fetch the featured status
      await fetchAccommodations();

      setError("");
    } catch (err) {
      console.error("Error removing from featured section:", err);
      setSuccessMessage(""); // Clear processing message

      // Show more helpful error messages
      if (err.message?.includes("Network error")) {
        setError(
          `Network error while removing from ${sectionName} Accommodations. Please check your connection and try again.`
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          `Failed to remove from ${sectionName} Accommodations. Please try again.`
        );
      }

      // Clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
      setRemoveFromFeaturedModalOpen(false);
      setSelectedForFeatured(null);
      setFeaturedSectionsToRemove([]);
    }
  };

  // Extract unique sources from accommodation data
  const extractUniqueSources = (accommodationData) => {
    // Create a Map to store unique sources with id as the key
    const sourcesMap = new Map();

    // Add default sources first (they'll be overwritten if actual data exists)
    DEFAULT_SOURCES.forEach((source) => {
      sourcesMap.set(source.id, source);
    });

    // Extract sources from accommodation data
    accommodationData.forEach((acc) => {
      if (acc.source && acc.source.name) {
        const sourceId = acc.source.name.toLowerCase();
        if (!sourcesMap.has(sourceId)) {
          sourcesMap.set(sourceId, {
            id: sourceId,
            name: acc.source.name,
          });
        }
      }
    });

    // Convert map to array
    return Array.from(sourcesMap.values());
  };

  // Handler for editing an accommodation
  const handleEdit = (id) => {
    navigate(`/admin/accommodations/edit/${id}`);
  };

  // Handler for toggling status (activate/deactivate)
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);

      // If listing is active, close it; otherwise no direct API to reactivate
      if (currentStatus === "active") {
        await closeListing(id);

        // Update state to reflect the change
        setAccommodations((prevAccommodations) =>
          prevAccommodations.map((acc) =>
            acc._id === id ? { ...acc, status: "closed" } : acc
          )
        );
      } else {
        // For now, we'll just update the UI without an API call
        // In a real app, you would make an API call to reactivate
        setAccommodations((prevAccommodations) =>
          prevAccommodations.map((acc) =>
            acc._id === id ? { ...acc, status: "active" } : acc
          )
        );
      }
    } catch (err) {
      console.error("Error toggling accommodation status:", err);
      setError("Failed to update accommodation status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting an accommodation
  const handleDelete = (id, title) => {
    setConfirmDeleteOpen(true);
    setSelectedForDelete(id);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteListing(selectedForDelete);

      // Remove the deleted accommodation from state
      setAccommodations((prevAccommodations) =>
        prevAccommodations.filter((acc) => acc._id !== selectedForDelete)
      );

      setError(null);
    } catch (err) {
      console.error("Error deleting accommodation:", err);
      setError("Failed to delete accommodation. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDeleteOpen(false);
      setSelectedForDelete(null);
    }
  };

  // Add pagination controls
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Filter accommodations based on selected source
  const filteredAccommodations = accommodations.filter((acc) => {
    // Skip filtering if accommodation object is invalid
    if (!acc) return false;

    // Check source filter match
    return (
      selectedSource === "all" ||
      (acc.source &&
        acc.source.name &&
        acc.source.name.toLowerCase() === selectedSource)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast notifications for errors and success messages */}
      {error && (
        <div
          className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center max-w-md animate-fade-in"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto pl-3 -mr-1 text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div
          className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md flex items-center max-w-md animate-fade-in"
          role="alert"
        >
          {loadingOperation ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
              <span>{successMessage}</span>
            </div>
          ) : (
            <>
              <Star className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="ml-auto pl-3 -mr-1 text-green-700 font-bold"
              >
                ×
              </button>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Listings Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all accommodation listings
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/accommodations/new")}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Listing
        </button>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row items-stretch gap-3 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="all">All Sources</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9)
            .fill()
            .map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
        </div>
      )}

      {/* Accommodations Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation) => (
            <AccommodationCard
              key={accommodation._id}
              accommodation={accommodation}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onAddToFeatured={handleAddToFeatured}
              onRemoveFromFeatured={handleRemoveFromFeatured}
            />
          ))}
        </div>
      )}

      {/* No results message */}
      {!loading && filteredAccommodations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No listings found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={handlePreviousPage}
            disabled={page <= 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page <= 1
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page >= totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {filteredAccommodations.length > 0 ? (page - 1) * limit + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {selectedSource !== "all"
                  ? Math.min(
                      (page - 1) * limit + filteredAccommodations.length,
                      totalItems
                    )
                  : Math.min(page * limit, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {selectedSource !== "all"
                  ? filteredAccommodations.length
                  : totalItems}
              </span>{" "}
              results
              {selectedSource !== "all" &&
                ` (filtered from ${totalItems} total)`}
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={handlePreviousPage}
                disabled={page <= 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  page <= 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>
              {/* Page numbers would go here */}
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  page >= totalPages
                    ? "text-gray-300"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setSelectedForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        listingTitle={selectedForDelete?.title || "this listing"}
      />

      {/* Add to Featured Modal */}
      <AddToFeaturedModal
        isOpen={addToFeaturedModalOpen}
        onClose={() => {
          setAddToFeaturedModalOpen(false);
          setSelectedForFeatured(null);
        }}
        onConfirm={handleConfirmAddToFeatured}
        listingId={selectedForFeatured?._id}
        listingTitle={selectedForFeatured?.title || "this listing"}
        currentCounts={currentFeaturedCounts}
        maxAllowed={6}
      />

      {/* Remove from Featured Modal */}
      <AddToFeaturedModal
        isOpen={removeFromFeaturedModalOpen}
        onClose={() => {
          setRemoveFromFeaturedModalOpen(false);
          setSelectedForFeatured(null);
          setFeaturedSectionsToRemove([]);
        }}
        onConfirm={handleConfirmRemoveFromFeatured}
        listingId={selectedForFeatured?._id}
        listingTitle={selectedForFeatured?.title || "this listing"}
        currentCounts={currentFeaturedCounts}
        maxAllowed={6}
        sections={featuredSectionsToRemove}
        isRemoveMode={true}
      />
    </div>
  );
};

export default Accommodations;
