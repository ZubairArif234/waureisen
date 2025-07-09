import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  User,
  UserX,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react";
import {
  getAllProviders,
  updateProviderStatus,
  deleteProvider,
} from "../../api/adminAPI";
import avatar from "../../assets/avatar.png";
import { toast } from "react-hot-toast";
import { changeMetaData } from "../../utils/extra";

// Skeleton for loading state
const SkeletonTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded-full w-16 mx-auto"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// ProviderDetailModal component for viewing provider details
const ProviderDetailModal = ({ provider, isOpen, onClose, onBanUnban }) => {
  if (!isOpen || !provider) return null;

  // Determine provider status text based on both profileStatus and registrationStatus
  const getStatusText = () => {
    if (provider.profileStatus === "banned") {
      return "Banned Account";
    } else if (provider.registrationStatus === "incomplete") {
      return "Pending Registration";
    } else {
      return "Active Account";
    }
  };

  // Determine status color class
  const getStatusColorClass = () => {
    if (provider.profileStatus === "banned") {
      return "text-red-600";
    } else if (provider.registrationStatus === "incomplete") {
      return "text-amber-600";
    } else {
      return "text-green-600";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className=" h-[80vh] overflow-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl">
        <div className="p-6 flex flex-col justify-between h-full">
          <div >

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Provider Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Provider Profile */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img
                src={provider.profilePicture ? provider.profilePicture : avatar}
                alt={provider.displayName || provider.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = avatar;
                }}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {provider.displayName ||
                  `${provider.firstName} ${provider.lastName}`}
              </h4>
              <p className="text-gray-600">{provider.email}</p>
              <div
                className={`mt-1 text-sm ${getStatusColorClass()}`}
              >
                {getStatusText()}
              </div>
            </div>
          </div>

          {/* Provider Information */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">
                  {provider.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">
                  {new Date(provider.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="font-medium">{provider.listings?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">
                  {provider.role === "provider" ? "Provider" : "User"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Status</p>
                <p className={`font-medium ${provider.registrationStatus === "incomplete" ? "text-amber-600" : "text-green-600"}`}>
                  {provider.registrationStatus === "incomplete" ? "Incomplete" : "Complete"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile Status</p>
                <p className={`font-medium ${
                  getStatusText() === "Active Account" ? "text-green-600" :
                  provider.profileStatus === "banned" ? "text-red-600" : 
                  "text-amber-600"
                }`}>
                  {getStatusText() === "Active Account" ? "Active" : 
                   getStatusText() === "Pending Registration" ? "Pending" :
                   provider.profileStatus.charAt(0).toUpperCase() + provider.profileStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Provider's Bio */}
          {provider.bio && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">About</h4>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {provider.bio}
              </p>
            </div>
          )}

          {/* Provider's Listings */}
          {/* {provider.listings && provider.listings.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Active Listings
              </h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Property
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {provider.listings.map((listing, index) => (
                      <tr key={listing._id || index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {listing.title || "Unnamed listing"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {listing.location?.address || "Unknown location"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {listing.pricePerNight?.price || "N/A"}{" "}
                          {listing.pricePerNight?.currency || "CHF"}/night
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {provider.profileStatus !== "banned" ? (
              <button
                onClick={() => onBanUnban(provider._id, "banned")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Ban Provider
              </button>
            ) : (
              <button
                onClick={() => onBanUnban(provider._id, "verified")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Unban Provider
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// DeleteConfirmationModal component for confirming provider deletion
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  providerName,
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
            <h3 className="text-lg font-medium">Delete Provider</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "
            <span className="font-medium">{providerName}</span>"? This action
            cannot be undone and will remove all provider data including their
            listings from the system.
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

const ProviderRow = ({ provider, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom"); // 'top' or 'bottom'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Update status colors based on both registration and profile status
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    banned: "bg-red-100 text-red-800"
  };

  // Determine provider status display value
  const getProviderStatus = () => {
    if (provider.profileStatus === "banned") {
      return "banned";
    } else if (provider.registrationStatus === "incomplete") {
      return "pending";
    } else {
      return "active";
    }
  };

  const providerStatus = getProviderStatus();

  // Calculate menu position when showing
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;

      // Lower threshold for mobile (100px) vs desktop (150px)
      const threshold = window.innerWidth < 768 ? 100 : 150;

      // If there's not enough space below, position menu above
      if (spaceBelow < threshold) {
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

  // Handle actions with appropriate confirmation
  const handleView = () => {
    onAction("view", provider);
    setShowMenu(false);
  };

  const handleBanUnban = () => {
    onAction(provider.profileStatus === "banned" ? "unban" : "ban", provider);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onAction("delete", provider);
    setShowMenu(false);
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={provider.profilePicture ? provider.profilePicture : avatar}
              alt={provider.displayName || provider.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatar;
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {provider.displayName ||
                `${provider.firstName || ""} ${provider.lastName || ""}`}
            </div>
            <div className="text-xs text-gray-500">{provider.username}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
        {provider.email}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {provider.myListing || 0}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[providerStatus] || "bg-gray-100 text-gray-800"
          }`}
        >
          {providerStatus === "active"
            ? "Active"
            : providerStatus === "banned"
            ? "Banned"
            : "Pending"}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="relative" ref={menuRef}>
          <button
            ref={buttonRef}
            className="p-2 hover:bg-gray-100 rounded-full"
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

                <button
                  onClick={handleView}
                  className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-100"
                >
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span>View details</span>
                </button>

                {provider.profileStatus !== "banned" ? (
                  <button
                    onClick={handleBanUnban}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-100"
                  >
                    <UserX className="w-5 h-5 text-red-500" />
                    <span>Ban provider</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBanUnban}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-100"
                  >
                    <User className="w-5 h-5 text-green-500" />
                    <span>Unban provider</span>
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 text-red-600"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>Delete</span>
                </button>

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
              className="fixed right-auto w-36 bg-white rounded-md shadow-lg z-[1000] border border-gray-200 py-1"
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
                        buttonRef.current?.getBoundingClientRect().bottom || 0,
                    }),
                overflow: "visible",
              }}
            >
              <button
                onClick={handleView}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                <span>View details</span>
              </button>

              {provider.profileStatus !== "banned" ? (
                <button
                  onClick={handleBanUnban}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                >
                  <UserX className="w-4 h-4 text-red-500" />
                  <span>Ban provider</span>
                </button>
              ) : (
                <button
                  onClick={handleBanUnban}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-green-500" />
                  <span>Unban provider</span>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Mobile card view for providers (displayed on small screens)
const ProviderCard = ({ provider, onAction }) => {
  // Determine provider status display value
  const getProviderStatus = () => {
    if (provider.profileStatus === "banned") {
      return "banned";
    } else if (provider.registrationStatus === "incomplete") {
      return "pending";
    } else {
      return "active";
    }
  };

  const providerStatus = getProviderStatus();

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={provider.profilePicture ? provider.profilePicture : avatar}
              alt={provider.displayName || provider.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatar;
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900 capitalize">
              {provider.displayName ||
                `${provider.firstName || ""} ${provider.lastName || ""}`}
            </div>
            <div className="text-sm text-gray-500">{provider.email}</div>
          </div>
        </div>
        {/* <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onAction("view", provider)}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div> */}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{provider.listings?.length || 0}</span>{" "}
          listings
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            providerStatus === "active"
              ? "bg-green-100 text-green-800"
              : providerStatus === "banned"
              ? "bg-red-100 text-red-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {providerStatus === "active"
            ? "Active"
            : providerStatus === "banned"
            ? "Banned"
            : "Pending"}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t flex gap-2">
        <button
          onClick={() => onAction("view", provider)}
          className="flex-1 text-sm text-center py-1 text-brand hover:bg-brand/5 rounded"
        >
          View
        </button>
        {provider.profileStatus !== "banned" ? (
          <button
            onClick={() => onAction("ban", provider)}
            className="flex-1 text-sm text-center py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Ban
          </button>
        ) : (
          <button
            onClick={() => onAction("unban", provider)}
            className="flex-1 text-sm text-center py-1 text-green-600 hover:bg-green-50 rounded"
          >
            Unban
          </button>
        )}
        <button
          onClick={() => onAction("delete", provider)}
          className="flex-1 text-sm text-center py-1 text-red-600 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Utility function to export data to CSV
const exportToCSV = (data, filename) => {
  // Create headers
  const headers = ["Name", "Email", "Listings", "Status", "JoinedDate"];

  // Convert data to CSV rows
  const csvRows = [
    // Headers row
    headers.join(","),
    // Data rows
    ...data.map((item) => {
      const displayName =
        item.displayName ||
        `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
        item.username;
      const joinedDate = new Date(item.createdAt).toLocaleDateString();
      
      // Set provider status based on both profileStatus and registrationStatus
      let status = "Active";
      if (item.profileStatus === "banned") {
        status = "Banned";
      } else if (item.registrationStatus === "incomplete") {
        status = "Pending";
      }
      
      const values = [
        displayName,
        item.email,
        item.listings?.length || 0,
        status,
        joinedDate,
      ];

      // Handle CSV special characters
      return values
        .map((value) => {
          const stringValue = String(value);
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",");
    }),
  ].join("\n");

  // Create and download the file
  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Providers = () => {
    useEffect(() => {
          
            changeMetaData(`Providers - Admin`);
          }, []);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const data = await getAllProviders();
        setProviders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to load providers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Helper function to get provider status
  const getProviderStatus = (provider) => {
    if (provider.profileStatus === "banned") {
      return "banned";
    } else if (provider.registrationStatus === "incomplete") {
      return "pending";
    } else {
      return "active";
    }
  };

  // Filter providers based on search query and status
  const filteredProviders = providers.filter(
    (provider) => {
      const providerStatus = getProviderStatus(provider);
      
      return (selectedStatus === "all" || selectedStatus === providerStatus) &&
        (provider.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         provider.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         provider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         provider.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (provider.displayName &&
           provider.displayName
             .toLowerCase()
             .includes(searchQuery.toLowerCase())))
    }
  );

  // Handle provider actions
  const handleProviderAction = async (action, provider) => {
    switch (action) {
      case "view":
        setSelectedProvider(provider);
        setDetailModalOpen(true);
        break;
      case "ban":
        try {
          setLoading(true);
          // console.log("Attempting to ban provider:", provider._id);

          // Set error to null before attempting the action
          setError(null);

          const response = await updateProviderStatus(provider._id, "banned");
          console.log("Ban provider response:", response);

          // Update local state
          setProviders((prev) =>
            prev.map((p) =>
              p._id === provider._id ? { ...p, profileStatus: "banned" } : p
            )
          );

          // Update selected provider if detail modal is open
          if (selectedProvider && selectedProvider._id === provider._id) {
            setSelectedProvider({
              ...selectedProvider,
              profileStatus: "banned",
            });
          }

          toast.success("Provider banned successfully");
        } catch (err) {
          console.error("Error banning provider:", err);
          setError(
            `Failed to ban provider: ${
              err.response?.data?.message || err.message
            }`
          );
          toast.error("Failed to ban provider");
        } finally {
          setLoading(false);
        }
        break;
      case "unban":
        try {
          setLoading(true);
          // console.log("Attempting to unban provider:", provider._id);

          // Set error to null before attempting the action
          setError(null);

          const response = await updateProviderStatus(provider._id, "verified");
          console.log("Unban provider response:", response);

          // Update local state
          setProviders((prev) =>
            prev.map((p) =>
              p._id === provider._id ? { ...p, profileStatus: "verified" } : p
            )
          );

          // Update selected provider if detail modal is open
          if (selectedProvider && selectedProvider._id === provider._id) {
            setSelectedProvider({
              ...selectedProvider,
              profileStatus: "verified",
            });
          }

          toast.success("Provider unbanned successfully");
        } catch (err) {
          console.error("Error unbanning provider:", err);
          setError(
            `Failed to unban provider: ${
              err.response?.data?.message || err.message
            }`
          );
          toast.error("Failed to unban provider");
        } finally {
          setLoading(false);
        }
        break;
      case "delete":
        setProviderToDelete(provider);
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle confirming provider deletion
  const handleConfirmDelete = async () => {
    if (providerToDelete) {
      try {
        setLoading(true);
        await deleteProvider(providerToDelete._id);

        // Remove the deleted provider from state
        setProviders((prev) =>
          prev.filter((p) => p._id !== providerToDelete._id)
        );
        setError(null);
      } catch (err) {
        console.error("Error deleting provider:", err);
        setError("Failed to delete provider. Please try again.");
      } finally {
        setLoading(false);
        setDeleteModalOpen(false);
        setProviderToDelete(null);
      }
    }
  };

  // Handle ban/unban in the detail modal
  const handleDetailBanUnban = async (id, status) => {
    try {
      setLoading(true);
      console.log(
        `Attempting to update provider ${id} status to ${status} from detail modal`
      );

      // Set error to null before attempting the action
      setError(null);

      const response = await updateProviderStatus(id, status);
      console.log(`Provider status update response:`, response);

      // Update local state
      setProviders((prev) =>
        prev.map((p) => (p._id === id ? { ...p, profileStatus: status } : p))
      );

      // Update selected provider
      setSelectedProvider((prev) => ({ ...prev, profileStatus: status }));

      const actionText = status === "banned" ? "banned" : "unbanned";
      toast.success(`Provider ${actionText} successfully`);
    } catch (err) {
      console.error("Error updating provider status:", err);
      setError(
        `Failed to update provider status: ${
          err.response?.data?.message || err.message
        }`
      );
      toast.error("Failed to update provider status");
    } finally {
      setLoading(false);
    }
  };

  // Export data to Excel
  const handleExport = () => {
    exportToCSV(filteredProviders, "providers-export");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Provider Management
        </h1>
        <p className="text-gray-600">
          View and manage accommodation providers on the platform
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading || filteredProviders.length === 0}
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && <SkeletonTable />}

      {/* Providers Table */}
      {!loading && (
        <div className="hidden md:block bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Listings
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProviders.length > 0 ? (
                  filteredProviders.map((provider) => (
                    <ProviderRow
                      key={provider._id}
                      provider={provider}
                      onAction={handleProviderAction}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No providers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProviders.length > 0 && (
            <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredProviders.length}</span>{" "}
                of <span className="font-medium">{providers.length}</span>{" "}
                providers
              </div>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile View - Cards */}
      {!loading && (
        <div className="md:hidden space-y-4">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <ProviderCard
                key={provider._id}
                provider={provider}
                onAction={handleProviderAction}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
              No providers found matching your criteria
            </div>
          )}

          {/* Mobile Pagination */}
          {filteredProviders.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {filteredProviders.length} of {providers.length}
              </div>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 border rounded text-xs text-gray-400 bg-gray-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onBanUnban={handleDetailBanUnban}
        />
      )}

      {/* Delete Confirmation Modal */}
      {providerToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          providerName={
            providerToDelete.displayName ||
            `${providerToDelete.firstName || ""} ${
              providerToDelete.lastName || ""
            }`.trim() ||
            providerToDelete.username
          }
        />
      )}
    </div>
  );
};

export default Providers;