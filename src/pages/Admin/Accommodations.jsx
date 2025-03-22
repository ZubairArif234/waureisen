import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Plus, Sliders, AlertTriangle } from 'lucide-react';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const AccommodationCard = ({ accommodation, onEdit, onToggleStatus, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState('bottom'); // 'top' or 'bottom'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-amber-100 text-amber-800'
  };

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
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
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
      label: 'Edit',
      onClick: () => {
        onEdit(accommodation.id);
        setShowMenu(false);
      },
      className: 'text-gray-700 hover:bg-gray-100'
    },
    {
      label: accommodation.status === 'active' ? 'Deactivate' : 'Activate',
      onClick: () => {
        onToggleStatus(accommodation.id);
        setShowMenu(false);
      },
      className: 'text-gray-700 hover:bg-gray-100'
    },
    {
      label: 'Delete',
      onClick: () => {
        onDelete(accommodation.id);
        setShowMenu(false);
      },
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
      <div className="relative">
        <img 
          src={accommodation.image} 
          alt={accommodation.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
          {accommodation.source}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{accommodation.title}</h3>
            <p className="text-sm text-gray-500">{accommodation.location}</p>
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
                <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMenu(false)} />
                
                {/* Menu fixed to bottom of screen */}
                <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg z-50 p-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  
                  {menuOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={option.onClick}
                      className={`w-full text-left px-4 py-3 text-sm ${option.className} ${
                        index < menuOptions.length - 1 ? 'border-b border-gray-100' : ''
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
                className="absolute right-0 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1" 
                style={{ 
                  ...(menuPosition === 'top' 
                    ? { bottom: '100%', marginBottom: '8px' } 
                    : { top: '100%', marginTop: '8px' }),
                  overflow: 'visible'
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
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[accommodation.status]}`}>
            {accommodation.status === 'active' ? 'Active' : 'Closed'}
          </div>
          <div className="text-brand font-medium">
            {accommodation.price} CHF/night
          </div>
        </div>
      </div>
    </div>
  );
};

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

const Accommodations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // State for accommodations
  const [accommodations, setAccommodations] = useState([
    {
      id: 1,
      title: 'Mountain View Chalet',
      location: 'Swiss Alps, Switzerland',
      price: 250,
      source: 'Admin',
      status: 'active',
      image: i1
    },
    {
      id: 2,
      title: 'Beachfront Villa',
      location: 'Costa Brava, Spain',
      price: 350,
      source: 'Provider',
      status: 'active',
      image: i2
    },
    {
      id: 3,
      title: 'Lake House',
      location: 'Lake Como, Italy',
      price: 400,
      source: 'Interhome',
      status: 'closed',
      image: i3
    },
  ]);

  // Handler for editing an accommodation
  const handleEdit = (id) => {
    navigate(`/admin/accommodations/edit/${id}`);
  };

  // Handler for toggling status (activate/deactivate)
  const handleToggleStatus = (id) => {
    setAccommodations(prevAccommodations => 
      prevAccommodations.map(acc => 
        acc.id === id 
          ? { ...acc, status: acc.status === 'active' ? 'closed' : 'active' } 
          : acc
      )
    );
  };

  // Handler for deleting an accommodation
  const handleDelete = (id) => {
    const accommodation = accommodations.find(acc => acc.id === id);
    setDeleteModal({ 
      isOpen: true, 
      id, 
      title: accommodation?.title || 'this listing' 
    });
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    setAccommodations(prevAccommodations => 
      prevAccommodations.filter(acc => acc.id !== deleteModal.id)
    );
    setDeleteModal({ isOpen: false, id: null, title: '' });
  };

  const filteredAccommodations = accommodations.filter(acc => 
    (selectedSource === 'all' || acc.source === selectedSource) &&
    (acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     acc.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
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
          onClick={() => navigate('/admin/accommodations/new')}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Listing
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <option value="Admin">Admin</option>
            <option value="Provider">Provider</option>
            <option value="Interhome">Interhome</option>
          </select>
        </div>
        
        {/* Advanced Filters Button */}
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
          <Sliders className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">Filters</span>
        </button>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations.map(accommodation => (
          <AccommodationCard 
            key={accommodation.id} 
            accommodation={accommodation}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>
      
      {/* No results message */}
      {filteredAccommodations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No listings found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        listingTitle={deleteModal.title}
      />
    </div>
  );
};

export default Accommodations;