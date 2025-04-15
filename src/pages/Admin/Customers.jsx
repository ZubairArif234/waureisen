import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, UserX, User, AlertTriangle, Eye, Download } from 'lucide-react';
import { getAllUsers, updateUserStatus, deleteUser } from '../../api/adminAPI';
import avatar from '../../assets/avatar.png';

// CustomerDetailModal component for viewing customer details
const CustomerDetailModal = ({ customer, isOpen, onClose, onBanUnban }) => {
  if (!isOpen || !customer) return null;
  
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
            <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Customer Profile */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img 
                src={customer.profilePicture && customer.profilePicture !== 'N/A' 
                    ? customer.profilePicture 
                    : avatar} 
                alt={customer.username} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = avatar;
                }}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{customer.firstName} {customer.lastName}</h4>
              <p className="text-gray-600">{customer.email}</p>
              <div className={`mt-1 text-sm ${
                customer.profileStatus === 'verified' || customer.profileStatus === 'pending verification'
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {customer.profileStatus === 'verified' 
                  ? 'Verified Account' 
                  : customer.profileStatus === 'banned'
                    ? 'Banned Account'
                    : 'Pending Verification'}
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{customer.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Number</p>
                <p className="font-medium">#{customer.customerNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="font-medium">{customer.totalBookings || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Dogs Information */}
          {customer.dogs && customer.dogs.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Dogs</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {customer.dogs.map((dog, index) => (
                  <div key={index} className="flex items-center gap-3 mb-2 last:mb-0">
                    <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4A481" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 5.172C10 3.12 12.5 2 14 2c0 3.33 2 4 2 8a6 6 0 1 1-12 0c0-2 2-5 2-5"></path>
                        <path d="M18 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
                        <path d="M6 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
                        <path d="M14 19c0 1-1 2-2 2s-2-1-2-2"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{dog.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-500">{dog.gender || 'Gender not specified'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Bookings */}
          {customer.bookings && customer.bookings.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Recent Bookings</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customer.bookings.map((booking, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.listing?.title || 'Unknown Property'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {booking.totalPrice} CHF
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
            {customer.profileStatus !== 'banned' ? (
              <button
                onClick={() => onBanUnban(customer._id, 'banned')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Ban User
              </button>
            ) : (
              <button
                onClick={() => onBanUnban(customer._id, 'verified')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Unban User
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// DeleteConfirmationModal component for confirming user deletion
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, customerName }) => {
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
            <h3 className="text-lg font-medium">Delete User</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{customerName}</span>"? This action cannot be undone and will remove all user data from the system.
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

const CustomerRow = ({ customer, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState('bottom'); // 'top' or 'bottom'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const statusColors = {
    verified: 'bg-green-100 text-green-800',
    'pending verification': 'bg-blue-100 text-blue-800',
    'not verified': 'bg-amber-100 text-amber-800',
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
    onAction('view', customer);
    setShowMenu(false);
  };

  const handleBanUnban = () => {
    onAction(customer.profileStatus === 'banned' ? 'unban' : 'ban', customer);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onAction('delete', customer);
    setShowMenu(false);
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={customer.profilePicture && customer.profilePicture !== 'N/A' 
                  ? customer.profilePicture 
                  : avatar} 
              alt={customer.username} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatar;
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
            <div className="text-xs text-gray-500">{customer.username}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
        {customer.email}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
        #{customer.customerNumber || 'N/A'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {customer.totalBookings || 0}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[customer.profileStatus] || 'bg-gray-100 text-gray-800'
        }`}>
          {customer.profileStatus === 'verified' 
            ? 'Active' 
            : customer.profileStatus === 'banned'
              ? 'Banned'
              : 'Pending'}
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
                
                {customer.profileStatus !== 'banned' ? (
                  <button
                    onClick={handleBanUnban}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-100"
                  >
                    <UserX className="w-5 h-5 text-red-500" />
                    <span>Ban user</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBanUnban}
                    className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-100"
                  >
                    <User className="w-5 h-5 text-green-500" />
                    <span>Unban user</span>
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
              
              {customer.profileStatus !== 'banned' ? (
                <button
                  onClick={handleBanUnban}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                >
                  <UserX className="w-4 h-4 text-red-500" />
                  <span>Ban user</span>
                </button>
              ) : (
                <button
                  onClick={handleBanUnban}
                  className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-green-500" />
                  <span>Unban user</span>
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

// Mobile card view for customers (displayed on small screens)
const CustomerCard = ({ customer, onAction }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img 
              src={customer.profilePicture && customer.profilePicture !== 'N/A' 
                  ? customer.profilePicture 
                  : avatar} 
              alt={customer.username} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatar;
              }}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
            <div className="text-xs text-gray-500">#{customer.customerNumber || 'N/A'}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onAction('view', customer)}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{customer.totalBookings || 0}</span> bookings
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          customer.profileStatus === 'verified' 
            ? 'bg-green-100 text-green-800' 
            : customer.profileStatus === 'banned'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
        }`}>
          {customer.profileStatus === 'verified' 
            ? 'Active' 
            : customer.profileStatus === 'banned'
              ? 'Banned'
              : 'Pending'}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t flex gap-2">
        <button
          onClick={() => onAction('view', customer)}
          className="flex-1 text-sm text-center py-1 text-brand hover:bg-brand/5 rounded"
        >
          View
        </button>
        {customer.profileStatus !== 'banned' ? (
          <button
            onClick={() => onAction('ban', customer)}
            className="flex-1 text-sm text-center py-1 text-red-600 hover:bg-red-50 rounded"
          >
            Ban
          </button>
        ) : (
          <button
            onClick={() => onAction('unban', customer)}
            className="flex-1 text-sm text-center py-1 text-green-600 hover:bg-green-50 rounded"
          >
            Unban
          </button>
        )}
        <button
          onClick={() => onAction('delete', customer)}
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
  const headers = ['Name', 'Email', 'CustomerNumber', 'Bookings', 'Status', 'JoinedDate'];
  
  // Convert data to CSV rows
  const csvRows = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(item => {
      const joinedDate = new Date(item.createdAt).toLocaleDateString();
      const values = [
        `${item.firstName} ${item.lastName}`,
        item.email,
        item.customerNumber || 'N/A',
        item.totalBookings || 0,
        item.profileStatus,
        joinedDate
      ];
      
      // Handle CSV special characters
      return values.map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    })
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Customers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search query and status
  const filteredCustomers = customers.filter(customer => 
    (selectedStatus === 'all' || 
     (selectedStatus === 'active' && customer.profileStatus === 'verified') ||
     (selectedStatus === 'banned' && customer.profileStatus === 'banned') ||
     (selectedStatus === 'pending' && 
      (customer.profileStatus === 'pending verification' || customer.profileStatus === 'not verified'))) &&
    (customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (customer.customerNumber && customer.customerNumber.includes(searchQuery)))
  );

  // Handle customer actions
  const handleCustomerAction = async (action, customer) => {
    switch (action) {
      case 'view':
        setSelectedCustomer(customer);
        setDetailModalOpen(true);
        break;
      case 'ban':
        try {
          setLoading(true);
          await updateUserStatus(customer._id, 'banned');
          
          // Update local state
          setCustomers(prev => 
            prev.map(c => 
              c._id === customer._id ? { ...c, profileStatus: 'banned' } : c
            )
          );
          
          // Update selected customer if detail modal is open
          if (selectedCustomer && selectedCustomer._id === customer._id) {
            setSelectedCustomer({...selectedCustomer, profileStatus: 'banned'});
          }
          
          setError(null);
        } catch (err) {
          console.error("Error banning customer:", err);
          setError("Failed to ban customer. Please try again.");
        } finally {
          setLoading(false);
        }
        break;
      case 'unban':
        try {
          setLoading(true);
          await updateUserStatus(customer._id, 'verified');
          
          // Update local state
          setCustomers(prev => 
            prev.map(c => 
              c._id === customer._id ? { ...c, profileStatus: 'verified' } : c
            )
          );
          
          // Update selected customer if detail modal is open
          if (selectedCustomer && selectedCustomer._id === customer._id) {
            setSelectedCustomer({...selectedCustomer, profileStatus: 'verified'});
          }
          
          setError(null);
        } catch (err) {
          console.error("Error unbanning customer:", err);
          setError("Failed to unban customer. Please try again.");
        } finally {
          setLoading(false);
        }
        break;
      case 'delete':
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle confirming customer deletion
  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        setLoading(true);
        await deleteUser(customerToDelete._id);
        
        // Remove the deleted customer from state
        setCustomers(prev => prev.filter(c => c._id !== customerToDelete._id));
        setError(null);
      } catch (err) {
        console.error("Error deleting customer:", err);
        setError("Failed to delete customer. Please try again.");
      } finally {
        setLoading(false);
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
      }
    }
  };

  // Handle ban/unban in the detail modal
  const handleDetailBanUnban = async (id, status) => {
    try {
      setLoading(true);
      await updateUserStatus(id, status);
      
      // Update local state
      setCustomers(prev => 
        prev.map(c => 
          c._id === id ? { ...c, profileStatus: status } : c
        )
      );
      
      // Update selected customer
      setSelectedCustomer(prev => ({...prev, profileStatus: status}));
      
      setError(null);
    } catch (err) {
      console.error("Error updating customer status:", err);
      setError("Failed to update customer status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Export data to Excel
  const handleExport = () => {
    exportToCSV(filteredCustomers, 'customers-export');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Customer Management
        </h1>
        <p className="text-gray-600">
          View and manage customers on the platform
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
              placeholder="Search customers..."
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
          disabled={loading || filteredCustomers.length === 0}
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      )}

      {/* Desktop View - Table */}
      {!loading && (
        <div className="hidden md:block bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
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
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <CustomerRow 
                      key={customer._id} 
                      customer={customer} 
                      onAction={handleCustomerAction}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                      No customers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCustomers.length > 0 && (
            <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{customers.length}</span> customers
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
      )}

      {/* Mobile View - Cards */}
      {!loading && (
        <div className="md:hidden space-y-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <CustomerCard 
                key={customer._id} 
                customer={customer} 
                onAction={handleCustomerAction}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
              No customers found matching your criteria
            </div>
          )}
          
          {/* Mobile Pagination */}
          {filteredCustomers.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {filteredCustomers.length} of {customers.length}
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
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onBanUnban={handleDetailBanUnban}
        />
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          customerName={`${customerToDelete.firstName} ${customerToDelete.lastName}`}
        />
      )}
    </div>
  );
};

export default Customers;