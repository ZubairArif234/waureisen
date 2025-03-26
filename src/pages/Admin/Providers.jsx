import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Building2, User, UserX, AlertTriangle, Eye } from 'lucide-react';
import avatar from '../../assets/avatar.png';

// ProviderDetailModal component for viewing provider details
const ProviderDetailModal = ({ provider, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Provider Details</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Provider Profile */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img src={avatar} alt={provider.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{provider.name}</h4>
              <p className="text-gray-600">{provider.email}</p>
              <p className="text-gray-600">#{provider.customerNumber}</p>
              <div className={`mt-1 text-sm ${
                provider.status === 'active' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {provider.status === 'active' ? 'Active Account' : 'Banned Account'}
              </div>
            </div>
          </div>
          
          {/* Provider Information */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{provider.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{provider.joinedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="font-medium">{provider.listings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">{provider.accountType}</p>
              </div>
            </div>
          </div>
          
          {/* Provider's Listings */}
          {provider.activeListings && provider.activeListings.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Active Listings</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {provider.activeListings.map((listing, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {listing.property}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {listing.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {listing.price} CHF/night
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {provider.status === 'active' ? (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Ban Provider
              </button>
            ) : (
              <button
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
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, providerName }) => {
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
            <h3 className="text-lg font-medium">Delete Provider</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{providerName}</span>"? This action cannot be undone and will remove all provider data including their listings from the system.
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
  const [menuPosition, setMenuPosition] = useState('bottom'); // 'top' or 'bottom'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    banned: 'bg-red-100 text-red-800'
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

  // Handle actions with appropriate confirmation
  const handleView = () => {
    onAction('view', provider);
    setShowMenu(false);
  };

  const handleBanUnban = () => {
    onAction(provider.status === 'active' ? 'ban' : 'unban', provider);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onAction('delete', provider);
    setShowMenu(false);
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img src={avatar} alt={provider.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{provider.name}</div>
            <div className="text-xs text-gray-500">{provider.initials}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
        {provider.email}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {provider.listings}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[provider.status]}`}>
          {provider.status === 'active' ? 'Active' : 'Banned'}
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
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMenu(false)} />
              
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
                
                {provider.status === 'active' ? (
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
              className="absolute right-0 w-36 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1" 
              style={{ 
                ...(menuPosition === 'top' 
                  ? { bottom: '100%', marginBottom: '8px' } 
                  : { top: '100%', marginTop: '8px' }),
                overflow: 'visible'
              }}
            >
              <button
                onClick={handleView}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                <span>View details</span>
              </button>
              
              {provider.status === 'active' ? (
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
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img src={avatar} alt={provider.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{provider.name}</div>
            <div className="text-sm text-gray-500">{provider.email}</div>
          </div>
        </div>
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onAction('view', provider)}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{provider.listings}</span> listings
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          provider.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {provider.status === 'active' ? 'Active' : 'Banned'}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t flex gap-2">
        <button
          onClick={() => onAction('view', provider)}
          className="flex-1 text-sm text-center py-1 text-brand hover:bg-brand/5 rounded"
        >
          View
        </button>
        {provider.status === 'active' ? (
          <button
            onClick={() => onAction('ban', provider)}
            className="flex-1 text-sm text-center py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Ban
          </button>
        ) : (
          <button
            onClick={() => onAction('unban', provider)}
            className="flex-1 text-sm text-center py-1 text-green-600 hover:bg-green-50 rounded"
          >
            Unban
          </button>
        )}
        <button
          onClick={() => onAction('delete', provider)}
          className="flex-1 text-sm text-center py-1 text-red-600 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const Providers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  
  // Mock data for providers
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Luxury Properties Inc.',
      initials: 'LP',
      email: 'contact@luxuryproperties.com',
      phone: '+41 76 123 4567',
      listings: 24,
      status: 'active',
      joinedDate: 'Jan 10, 2023',
      accountType: 'Property Management Company',
      activeListings: [
        { property: 'Mountain View Chalet', location: 'Swiss Alps', price: '320' },
        { property: 'Beachfront Villa', location: 'Costa Brava, Spain', price: '450' },
        { property: 'Lake House', location: 'Lake Como, Italy', price: '280' }
      ]
    },
    {
      id: 2,
      name: 'Alpine Homes',
      initials: 'AH',
      email: 'info@alpinehomes.com',
      phone: '+41 78 456 7890',
      listings: 16,
      status: 'active',
      joinedDate: 'Feb 22, 2023',
      accountType: 'Independent Host',
      activeListings: [
        { property: 'Cozy Mountain Cabin', location: 'Zermatt, Switzerland', price: '180' },
        { property: 'Ski-in Apartment', location: 'Verbier, Switzerland', price: '220' }
      ]
    },
    {
      id: 3,
      name: 'Beach Villas Co.',
      initials: 'BV',
      email: 'bookings@beachvillas.com',
      phone: '+41 79 789 0123',
      listings: 9,
      status: 'banned',
      joinedDate: 'Mar 5, 2023',
      accountType: 'Property Management Company',
      activeListings: [
        { property: 'Luxury Beach House', location: 'Mallorca, Spain', price: '380' },
        { property: 'Oceanfront Condo', location: 'Ibiza, Spain', price: '290' }
      ]
    },
    {
      id: 4,
      name: 'City Stays',
      initials: 'CS',
      email: 'info@citystays.com',
      phone: '+41 76 234 5678',
      listings: 18,
      status: 'active',
      joinedDate: 'Apr 12, 2023',
      accountType: 'Property Management Company',
      activeListings: [
        { property: 'Downtown Loft', location: 'Zürich, Switzerland', price: '210' },
        { property: 'Modern Apartment', location: 'Geneva, Switzerland', price: '190' },
        { property: 'Riverside Suite', location: 'Basel, Switzerland', price: '170' }
      ]
    },
    {
      id: 5,
      name: 'Mountain Retreats',
      initials: 'MR',
      email: 'bookings@mountainretreats.com',
      phone: '+41 78 567 8901',
      listings: 12,
      status: 'active',
      joinedDate: 'Feb 8, 2023',
      accountType: 'Independent Host',
      activeListings: [
        { property: 'Alpine Lodge', location: 'Interlaken, Switzerland', price: '240' },
        { property: 'Mountain Cabin', location: 'Grindelwald, Switzerland', price: '195' }
      ]
    }
  ]);

  // Filter providers based on search query and status
  const filteredProviders = providers.filter(provider => 
    (selectedStatus === 'all' || provider.status === selectedStatus) &&
    (provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     provider.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle provider actions
  const handleProviderAction = (action, provider) => {
    switch (action) {
      case 'view':
        setSelectedProvider(provider);
        setDetailModalOpen(true);
        break;
      case 'ban':
        // Toggle status to banned
        setProviders(prev => 
          prev.map(p => 
            p.id === provider.id ? { ...p, status: 'banned' } : p
          )
        );
        break;
      case 'unban':
        // Toggle status to active
        setProviders(prev => 
          prev.map(p => 
            p.id === provider.id ? { ...p, status: 'active' } : p
          )
        );
        break;
      case 'delete':
        setProviderToDelete(provider);
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle confirming provider deletion
  const handleConfirmDelete = () => {
    if (providerToDelete) {
      setProviders(prev => prev.filter(p => p.id !== providerToDelete.id));
      setDeleteModalOpen(false);
      setProviderToDelete(null);
    }
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
          </select>
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listings
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProviders.length > 0 ? (
                filteredProviders.map(provider => (
                  <ProviderRow 
                    key={provider.id} 
                    provider={provider} 
                    onAction={handleProviderAction}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProviders.length}</span> of <span className="font-medium">{providers.length}</span> providers
            </div>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {filteredProviders.length > 0 ? (
          filteredProviders.map(provider => (
            <ProviderCard 
              key={provider.id} 
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
              <button disabled className="px-3 py-1 border rounded text-xs text-gray-400 bg-gray-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {providerToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          providerName={providerToDelete.name}
        />
      )}
    </div>
  );
};

export default Providers;