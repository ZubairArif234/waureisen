import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, MoreHorizontal, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import MockMap from '../../components/SearchComponents/MockMap';
import MapToggle from '../../components/SearchComponents/MapToggle';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';

// DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, listingTitle }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete Listing</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{listingTitle}</span>"? This action cannot be undone.
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

const ListingCard = ({ listing, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-48 object-cover"
          onClick={() => onView(listing.id)}
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          listing.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : listing.status === 'pending approval'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {listing.status === 'active' 
            ? 'Active' 
            : listing.status === 'pending approval'
            ? 'Pending' 
            : 'Draft'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div onClick={() => onView(listing.id)} className="cursor-pointer">
            <h3 className="font-medium text-gray-900 mb-1">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.location}</p>
          </div>
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
                      onView(listing.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      onEdit(listing.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(listing);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-brand font-medium">{listing.price} CHF/night</span>
          <span className="text-gray-500 text-sm">{listing.bookings} bookings</span>
        </div>
      </div>
    </div>
  );
};

const YourListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    listing: null 
  });
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      // Reset map view when switching to mobile
      if (!newIsDesktop && showMap) {
        setShowMap(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMap]);
  
  // Mock data for listings - would be fetched from API in real implementation
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'Modern Studio in City Center',
      location: 'Zurich, Switzerland',
      price: 120,
      status: 'active',
      image: i1,
      bookings: 5,
      propertyType: 'Studio'
    },
    {
      id: '2',
      title: 'Mountain View Chalet',
      location: 'Swiss Alps, Switzerland',
      price: 230,
      status: 'active',
      image: i2,
      bookings: 3,
      propertyType: 'Chalet'
    },
    {
      id: '3',
      title: 'Lakeside Apartment',
      location: 'Lucerne, Switzerland',
      price: 190,
      status: 'pending approval',
      image: s1,
      bookings: 0,
      propertyType: 'Apartment'
    },
    {
      id: '4',
      title: 'Cozy Cottage in the Woods',
      location: 'Black Forest, Germany',
      price: 150,
      status: 'draft',
      image: s2,
      bookings: 2,
      propertyType: 'Cabin'
    }
  ]);

  // Property types extracted from listings for filter
  const propertyTypes = ['all', ...Array.from(new Set(listings.map(l => l.propertyType)))];

  const handleEdit = (id) => {
    navigate(`/provider/edit-listing/${id}`);
  };

  const handleDelete = (listing) => {
    setDeleteModal({
      isOpen: true,
      listing
    });
  };

  const confirmDelete = () => {
    if (deleteModal.listing) {
      // In a real app, make API call to delete
      setListings(prevListings => 
        prevListings.filter(l => l.id !== deleteModal.listing.id)
      );
      setDeleteModal({ isOpen: false, listing: null });
    }
  };

  const handleView = (id) => {
    navigate(`/accommodation/${id}`);
  };

  const handleCreateListing = () => {
    navigate('/provider/create-listing');
  };

  // Apply filters to listings
  const filteredListings = listings.filter(listing => {
    // Filter by tab (status)
    const statusMatch = 
      activeTab === 'all' ? true : 
      activeTab === 'active' ? listing.status === 'active' :
      activeTab === 'pending' ? listing.status === 'pending approval' :
      listing.status === 'draft';
    
    // Filter by search query
    const searchMatch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by property type
    const typeMatch = 
      selectedPropertyType === 'all' ? true : 
      listing.propertyType === selectedPropertyType;
    
    return statusMatch && searchMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="relative pt-20">
        {/* Mobile Map Toggle */}
        <MapToggle 
          showMap={showMap} 
          onToggle={(show) => setShowMap(show)} 
        />

        <div className="flex">
          {/* Main Content */}
          <main 
            className={`w-full px-4 sm:px-6 lg:px-8 py-12 ${
              isDesktop ? 'lg:w-2/3' : 'w-full'
            } ${showMap && !isDesktop ? 'hidden' : ''}`}
          >
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/provider/listings')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-3xl font-semibold text-gray-900">Your Listings</h1>
              </div>
              
              <button
                onClick={handleCreateListing}
                className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Listing</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  {propertyTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type === 'all' ? 'All Property Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'all'
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Listings ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'active'
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Active ({listings.filter(l => l.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'pending'
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending ({listings.filter(l => l.status === 'pending approval').length})
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'draft'
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Drafts ({listings.filter(l => l.status === 'draft').length})
              </button>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>

            {/* No listings state */}
            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No listings found</p>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'all'
                    ? "You haven't created any listings yet."
                    : activeTab === 'active'
                    ? "You don't have any active listings."
                    : activeTab === 'pending'
                    ? "You don't have any pending listings."
                    : "You don't have any draft listings."}
                </p>
                <button
                  onClick={handleCreateListing}
                  className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                >
                  Create Your First Listing
                </button>
              </div>
            )}
          </main>

          {/* Map View */}
          <aside 
            className={`${
              showMap && !isDesktop 
                ? 'fixed inset-0 z-40' 
                : isDesktop 
                  ? 'hidden lg:block lg:w-1/3 sticky top-20 h-[calc(100vh-80px)]' 
                  : 'hidden'
            }`}
          >
            <MockMap listings={filteredListings} />
          </aside>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listing: null })}
        onConfirm={confirmDelete}
        listingTitle={deleteModal.listing?.title || ''}
      />

      <Footer />
    </div>
  );
};

export default YourListings;