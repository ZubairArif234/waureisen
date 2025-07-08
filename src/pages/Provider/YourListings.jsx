import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import i1 from "../../assets/i1.png";
import { useLanguage } from "../../utils/LanguageContext";
import { deleteListing, getListingDetails, getProviderListings } from "../../api/providerAPI";
import { changeMetaData } from "../../utils/extra";

// DeleteConfirmationModal component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
}) => {
  const { t } = useLanguage();
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
            <h3 className="text-lg font-medium">{t("delete_listing")}</h3>
          </div>

          <p className="text-gray-600 mb-6">
            {t("delete_confirmation")}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ListingCard with improved aspect ratio and overflow control
const ListingCard = ({ listing, onEdit, onDelete, onView }) => {
     console.log(listing);
     
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-visible shadow-sm hover:shadow-md transition-shadow">
      {/* Image container with 16:9 aspect ratio */}
      <div className="relative overflow-hidden rounded-t-lg aspect-video">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onView(listing.id,listing.title)}
        />

        {/* Status badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${{
            active: "bg-green-100 text-green-800",
            "pending approval": "bg-yellow-100 text-yellow-800",
          }[listing.status] || "bg-gray-100 text-gray-800"  }`}
        >
          {listing.status === "active"
            ? t("active_status")
            : listing.status === "pending approval"
            ? t("pending_status")
            : t("draft_status")}
        </div>

        {/* Source badge */}
        {/* <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
          {listing.listingSource || "Provider"}
        </div> */}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div onClick={() => onView(listing.id,listing.title)} className="cursor-pointer">
            <h3 className="font-medium text-gray-900 mb-1">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.location}</p>
          </div>

          {/* Options menu trigger */}
          <div className="relative">
            <button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Open options menu"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-50 w-32 py-1 border border-gray-200">
                  <button
                    onClick={() => {
                      onView(listing.id,listing.title);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("view")}
                  </button>
                  <button
                    onClick={() => {
                      onEdit(listing.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => {
                      onDelete(listing);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t("delete")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-brand font-medium">
            { listing.price} CHF/night
          </span>
        </div>
      </div>
    </div>
  );
};

// Main YourListings component with constrained layout
const YourListings = () => {
  useEffect(() => {
      
        changeMetaData(`Your Listing - Provider`);
      }, []);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, listing: null });

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProviderListings();
      
      const formatted = data.map((l) => ({
        id: l._id,
        title: l.title || "Unnamed Listing",
        location: l.location?.address || "Unknown location",
        price: (l.pricePerNight?.isDiscountActivate && l.pricePerNight?.discount) || l.pricePerNight?.price || 0,
        currency: l.pricePerNight?.currency || "CHF",
        status: l.status || "draft",
        image: l.images?.[0] || i1,
        bookings: l.totalBookings || 0,
        listingSource: l.source?.name || "waureisen",
        propertyType: l.listingType || "Other",
      }));
      
      setListings(formatted);
    } catch (err) {
      console.error(err);
      setError("Failed to load listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = listings.filter((item) => {
    const statusMatch = activeTab === "all" ? true : item.status === activeTab;
    const searchMatch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const handleEdit = (id) => navigate(`/provider/edit-listing/${id}`);
  const handleDelete = (item) =>{console.log(item);
   ; setDeleteModal({ isOpen: true, listing:item })};
  const confirmDelete = async (id) => { 
    try{
      setIsLoading(true)
 const res = await deleteListing(id);

 if (res) {
  setListings((prevAccommodations) =>
        prevAccommodations.filter((acc) => acc._id !== id)
      );}
      setIsLoading(false)
    }catch (error) {
      setIsLoading(false)
      console.log(error);
      
    }finally {
      fetchListings()
     setDeleteModal({ isOpen: false, listing:null })}
  
   };
  const handleView = (id,name) => navigate(`/accommodation/${name}?listing=${id}`, { state: { id } });
  const handleCreate = () => navigate(`/provider/create-listing`);
console.log(deleteModal);

  // Loading state
  if (isLoading && !listings.length) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="relative pt-20">
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <button
                onClick={() => navigate("/provider/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">{t("your_listings")}</h1>
            </div>
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4" />
              <p className="text-gray-600 ml-3">{t("loading_listings")}</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="relative pt-20">
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/provider/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">{t("your_listings")}</h1>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("retry")}
              </button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative pt-20">
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/provider/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">{t("your_listings")}</h1>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>{t("create_new_listing")}</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("search_listings_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "active"
                    ? "border-b-2 border-brand text-brand"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t("active")}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "all"
                    ? "border-b-2 border-brand text-brand"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t("all_listings")}
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((item,i) => (
              <ListingCard
                key={i}
                listing={item}
                onEdit={handleEdit}
                onDelete={()=>handleDelete(item)}
                onView={handleView}
              />
            ))}
          </div>

          {/* Empty state */}
          {!filtered.length && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">{t("no_listings_found")}</p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                {t("create_your_first_listing")}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listing: null })}
        onConfirm={()=>confirmDelete(deleteModal.listing.id)}
        listingTitle={deleteModal.listing?.title || ""}
      />

      {/* <Footer /> */}
    </div>
  );
};

export default YourListings;