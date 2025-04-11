import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Search, Filter, MessageSquare, Calendar as CalendarIcon, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import avatar from '../../assets/avatar.png';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Mobile view booking card
const BookingCardMobile = ({ booking, onMessage, onAcceptBooking, onCancelBooking }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
      <div className="p-4">
        {/* Header with thumbnail and status */}
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={booking.listing.image} 
            alt={booking.listing.title}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-900 text-sm">{booking.listing.title}</h3>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-gray-500">{booking.listing.location}</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-xs text-gray-600">
            <span className="block text-gray-400">Dates</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{booking.checkInDate} - {booking.checkOutDate}</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <span className="block text-gray-400">Guests</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{booking.guests} {booking.guests === 1 ? 'person' : 'people'}, {booking.dogs} {booking.dogs === 1 ? 'dog' : 'dogs'}</span>
            </div>
          </div>
        </div>

        {/* Expand/collapse button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-1 text-xs text-brand"
        >
          <span>{expanded ? 'Show less' : 'Show more details'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">Customer</span>
                <div className="flex items-center gap-1 mt-1">
                  <img src={avatar} alt="Guest" className="w-4 h-4 rounded-full" />
                  <span>{booking.customer.name}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">Booking ID</span>
                <span>#{booking.id}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">Total Amount</span>
                <span className="font-medium text-brand">{booking.totalPrice} {booking.currency}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">Booked on</span>
                <span>{booking.bookingDate}</span>
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2 mt-2">
              <button
                onClick={() => onMessage(booking.id)}
                className="w-full flex items-center justify-center gap-1 bg-gray-100 text-gray-700 rounded-lg p-2 text-xs"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Message Guest</span>
              </button>
              
              {booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAcceptBooking(booking.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-2 text-xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>Accept</span>
                  </button>
                  
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-2 text-xs"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => onCancelBooking(booking.id)}
                  className="w-full flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-2 text-xs"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProviderBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('checkInDate');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data for the bookings - would be fetched from API in real implementation
  // This aligns with the backend Booking model structure
  const [bookings, setBookings] = useState([
    {
      id: 'B1001',
      listing: {
        id: 'L101',
        title: 'Modern Studio in City Center',
        location: 'Zurich, Switzerland',
        image: i1
      },
      customer: {
        id: 'U201',
        name: 'John Doe',
        email: 'john@example.com',
        image: avatar
      },
      checkInDate: '2025-04-12',
      checkOutDate: '2025-04-16',
      formattedCheckIn: 'Apr 12, 2025',
      formattedCheckOut: 'Apr 16, 2025',
      bookingDate: '2025-03-01',
      guests: 2,
      dogs: 1,
      status: 'confirmed',
      totalPrice: 480,
      currency: 'CHF',
      specialRequests: 'Early check-in if possible'
    },
    {
      id: 'B1002',
      listing: {
        id: 'L102',
        title: 'Mountain View Chalet',
        location: 'Swiss Alps, Switzerland',
        image: i2
      },
      customer: {
        id: 'U202',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        image: avatar
      },
      checkInDate: '2025-04-20',
      checkOutDate: '2025-04-23',
      formattedCheckIn: 'Apr 20, 2025',
      formattedCheckOut: 'Apr 23, 2025',
      bookingDate: '2025-03-05',
      guests: 4,
      dogs: 2,
      status: 'pending',
      totalPrice: 690,
      currency: 'CHF',
      specialRequests: 'Dog bed for large dog needed'
    },
    {
      id: 'B1003',
      listing: {
        id: 'L103',
        title: 'Lakeside Apartment',
        location: 'Lucerne, Switzerland',
        image: s1
      },
      customer: {
        id: 'U203',
        name: 'Robert Smith',
        email: 'robert@example.com',
        image: avatar
      },
      checkInDate: '2025-05-05',
      checkOutDate: '2025-05-10',
      formattedCheckIn: 'May 5, 2025',
      formattedCheckOut: 'May 10, 2025',
      bookingDate: '2025-03-20',
      guests: 3,
      dogs: 1,
      status: 'confirmed',
      totalPrice: 570,
      currency: 'CHF',
      specialRequests: ''
    },
    {
      id: 'B1004',
      listing: {
        id: 'L104',
        title: 'Cozy Cottage in the Woods',
        location: 'Black Forest, Germany',
        image: s2
      },
      customer: {
        id: 'U204',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        image: avatar
      },
      checkInDate: '2025-04-02',
      checkOutDate: '2025-04-08',
      formattedCheckIn: 'Apr 2, 2025',
      formattedCheckOut: 'Apr 8, 2025',
      bookingDate: '2025-02-15',
      guests: 2,
      dogs: 2,
      status: 'canceled',
      totalPrice: 450,
      currency: 'CHF',
      specialRequests: 'Late checkout requested'
    }
  ]);

  const handleMessage = (bookingId) => {
    navigate(`/provider/messages?booking=${bookingId}`);
  };

  const handleAcceptBooking = (bookingId) => {
    // In a real app, this would call an API to accept the booking
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' } 
          : booking
      )
    );
    alert(`Booking ${bookingId} has been accepted.`);
  };

  const handleCancelBooking = (bookingId) => {
    // In a real app, this would call an API to cancel the booking
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'canceled' } 
          : booking
      )
    );
    alert(`Booking ${bookingId} has been canceled.`);
  };

  const sortBookings = (bookings, sortBy) => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case 'checkInDate':
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        case 'bookingDate':
          return new Date(a.bookingDate) - new Date(b.bookingDate);
        case 'price':
          return b.totalPrice - a.totalPrice;
        default:
          return 0;
      }
    });
  };

  // Apply filters to bookings
  const filteredBookings = sortBookings(
    bookings.filter(booking => {
      // Filter by tab (status)
      const statusMatch = 
        activeTab === 'all' ? true : 
        booking.status === activeTab;
      
      // Filter by search query
      const searchMatch = 
        booking.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && searchMatch;
    }),
    sortBy
  );

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">Bookings</h1>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings by listing, guest, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="checkInDate">Sort by Check-in Date</option>
                <option value="bookingDate">Sort by Booking Date</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        {isMobile && (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <BookingCardMobile 
                key={booking.id} 
                booking={booking} 
                onMessage={handleMessage}
                onAcceptBooking={handleAcceptBooking}
                onCancelBooking={handleCancelBooking}
              />
            ))}
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg mb-2">No bookings found</p>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'all'
                    ? "You don't have any bookings yet."
                    : `You don't have any ${activeTab} bookings.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Desktop View - Table */}
        {!isMobile && (
          <div className="overflow-x-auto bg-white border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={booking.listing.image} 
                          alt={booking.listing.title} 
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{booking.listing.title}</div>
                          <div className="text-sm text-gray-500">{booking.listing.location}</div>
                          <div className="text-xs text-gray-400">#{booking.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img src={avatar} alt="Guest" className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                          <div className="text-xs text-gray-500">
                            {booking.guests} {booking.guests === 1 ? 'person' : 'people'}, {booking.dogs} {booking.dogs === 1 ? 'dog' : 'dogs'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Booked on {formatDate(booking.bookingDate)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand">
                        {booking.totalPrice} {booking.currency}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMessage(booking.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <p className="text-gray-500 text-lg mb-2">No bookings found</p>
                      <p className="text-gray-400 text-sm">
                        {activeTab === 'all'
                          ? "You don't have any bookings yet."
                          : `You don't have any ${activeTab} bookings.`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProviderBookings;