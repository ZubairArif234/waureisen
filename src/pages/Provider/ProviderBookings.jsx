import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Search, Filter, Calendar as CalendarIcon, ChevronDown, ChevronUp, Check, X, Users } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import avatar from '../../assets/avatar.png';
import { useLanguage } from '../../utils/LanguageContext';
import API from '../../api/config';
import { getProviderBookings, acceptBooking, cancelBooking } from '../../api/providerAPI';
import Pagination from '../../components/Shared/Pagination';
import toast from 'react-hot-toast';
import moment from 'moment';
import { changeMetaData } from '../../utils/extra';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const { t } = useLanguage();
  
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

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return t('booking_status_confirmed');
      case 'pending':
        return t('booking_status_pending');
      case 'canceled':
        return t('booking_status_canceled');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

// Mobile view booking card
const BookingCardMobile = ({ booking, onMessage, onAcceptBooking, onCancelBooking }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  // Get the listing image or use placeholder
  const listingImage = booking.listing?.photos?.[0] || avatar;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-4">
      <div className="p-4">
        {/* Header with thumbnail and status */}
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={listingImage} 
            alt={booking.listing?.title || 'Property'}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-900 text-sm">{booking.listing?.title || 'Property'}</h3>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-gray-500">{booking.listing?.location?.address || 'Unknown location'}</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-xs text-gray-600">
            <span className="block text-gray-400">{t('dates')}</span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>
                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <span className="block text-gray-400">{t('guests')}</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                {booking.capacity?.people || 1} {booking.capacity?.people !== 1 ? t('people') : t('person')}, 
                {' '}{booking.capacity?.dogs || 0} {booking.capacity?.dogs !== 1 ? t('dogs') : t('dog')}
              </span>
            </div>
          </div>
        </div>

        {/* Expand/collapse button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-1 text-xs text-brand"
        >
          <span>{expanded ? t('show_less') : t('show_more_details')}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">{t('customer')}</span>
                <div className="flex items-center gap-1 mt-1">
                  <img src={avatar} alt="Guest" className="w-4 h-4 rounded-full" />
                  <span>{booking.user?.username || booking.user?.firstName + ' ' + booking.user?.lastName || 'Guest'}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">{t('booking_id')}</span>
                <span>#{booking.id || booking._id}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">{t('total_amount')}</span>
                <span className="font-medium text-brand">{booking.totalPrice} {booking.currency || 'CHF'}</span>
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-gray-400">{t('booked_on')}</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2 mt-2">
              
              {booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAcceptBooking(booking.id || booking._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg p-2 text-xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>{t('accept')}</span>
                  </button>
                  
                  <button
                    onClick={() => onCancelBooking(booking.id || booking._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-2 text-xs"
                  >
                    <X className="w-3 h-3" />
                    <span>{t('cancel')}</span>
                  </button>
                </div>
              )}
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => onCancelBooking(booking.id || booking._id)}
                  className="w-full flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg p-2 text-xs"
                >
                  <X className="w-3 h-3" />
                  <span>{t('cancel_booking')}</span>
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
  useEffect(() => {
        
          changeMetaData(`Bookings - Provider`);
        }, []);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('checkInDate');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  
  
  const prevActiveTab = useRef(activeTab);
  
  
  const queryParams = new URLSearchParams(location.search);
  const bookingIdParam = queryParams.get('id');
  
  
  const [bookings, setBookings] = useState([]);
  
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


      
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Reset to page 1 when changing filters
        const pageToFetch = activeTab !== prevActiveTab.current ? 1 : currentPage;
        if (activeTab !== prevActiveTab.current) {
          setCurrentPage(1);
        }
        prevActiveTab.current = activeTab;
  
        // Map UI tab status to API status parameter
        const statusParam = activeTab === 'all' ? undefined : activeTab;
        
        const response = await getProviderBookings({ 
          status: statusParam,
          page: pageToFetch,
          limit: 10,
          sortOrder: 'desc', 
          sortBy: 'createdAt'
        });
        
        
        // Update state with the paginated data
        setBookings(response.bookings || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalBookings(response.pagination?.totalCount || 0);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [activeTab, currentPage, sortBy]);


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      window.scrollTo(0, 0);
    }
  };

  const handleMessage = (bookingId) => {
    navigate(`/provider/messages?booking=${bookingId}`);
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      
      // API call to accept booking
      const response = await acceptBooking(bookingId);
      
      // Update local state with the updated booking
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId || booking._id === bookingId
            ? { ...booking, status: 'confirmed' } 
            : booking
        )
      );
      
      // Show a success message
      toast.success(`Booking ${bookingId} has been accepted.`)
      
      // Redirect to messages page with booking ID as a parameter
      navigate(`/provider/messages?booking=${bookingId}`);
      
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to accept booking. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      
      // API call to cancel booking
      const response = await cancelBooking(bookingId);
      
      // Update local state with the canceled booking
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId || booking._id === bookingId
            ? { ...booking, status: 'canceled' } 
            : booking
        )
      );
      
      alert(`Booking ${bookingId} has been canceled.`);
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortBookings = (bookings, sortBy) => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case 'checkInDate':
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        case 'bookingDate':
          return new Date(a.createdAt) - new Date(b.createdAt);
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
      // Filter by search query
      const listingTitle = booking.listing?.title || '';
      const listingLocation = booking.listing?.location?.address || '';
      const guestName = booking.user?.username || booking.user?.firstName + ' ' + booking.user?.lastName || '';
      const bookingId = booking.id || booking._id || '';
      
      const searchMatch = 
        listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listingLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookingId.toString().toLowerCase().includes(searchQuery.toLowerCase());
      
      return searchMatch;
    }),
    sortBy
  );

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Render loading state
  if (isLoading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('bookings')}</h1>
          </div>
          
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 ml-3">{t('loading_bookings')}</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('bookings')}</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('retry')}
            </button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

 // Complete return section of ProviderBookings.jsx
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
        <h1 className="text-3xl font-semibold text-gray-900">{t('bookings')}</h1>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('search_bookings_placeholder')}
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
              <option value="all">{t('all_bookings')}</option>
              <option value="confirmed">{t('confirmed')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="canceled">{t('canceled')}</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            >
              <option value="checkInDate">{t('sort_by_checkin')}</option>
              <option value="bookingDate">{t('sort_by_booking_date')}</option>
              <option value="price">{t('sort_by_price')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && bookings.length === 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="space-y-4">
          {bookings.map(booking => (
            <BookingCardMobile 
              key={booking.id || booking._id} 
              booking={booking} 
              onMessage={handleMessage}
              onAcceptBooking={handleAcceptBooking}
              onCancelBooking={handleCancelBooking}
            />
          ))}
          
          {/* Pagination for Mobile View */}
          {bookings.length > 0 && !isLoading && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {bookings.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg mb-2">
                {totalBookings === 0 
                  ? t('no_bookings_found') 
                  : t('no_bookings_match_filters')}
              </p>
              <p className="text-gray-400 text-sm">
                {totalBookings === 0
                  ? (activeTab === 'all'
                      ? t('no_bookings_yet')
                      : `${t('no_bookings_with_status', { status: t(activeTab) })}`)
                  : t('try_adjusting_filters')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Desktop View - Table */}
      {!isMobile && (
        <div className="overflow-x-auto bg-white border rounded-lg">
          {isLoading && bookings.length === 0 && (
            <div className="flex justify-center py-4 border-b">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
            </div>
          )}
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booking_details')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('guest')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dates')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id || booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.listing?.photos?.[0] || avatar} 
                        alt={booking.listing?.title || 'Property'} 
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{booking.listing?.title || 'Property'}</div>
                        <div className="text-sm text-gray-500">{booking.listing?.location?.address || 'Unknown location'}</div>
                        <div className="text-xs text-gray-400">#{booking.id || booking._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={avatar} alt="Guest" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user?.username || booking.user?.firstName + ' ' + booking.user?.lastName || 'Guest'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.capacity?.people || 1} {booking.capacity?.people !== 1 ? t('people') : t('person')}, 
                          {' '}{booking.capacity?.dogs || 0} {booking.capacity?.dogs !== 1 ? t('dogs') : t('dog')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {moment(booking.checkInDate).format("DD, MMM YYYY")} - {moment(booking.checkOutDate).format("DD, MMM YYYY")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('booked_on')} {moment(booking.createdAt).format("DD, MMM YYYY")}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand">
                      {booking.totalPrice} {booking.currency || 'CHF'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking.id || booking._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>{t('accept')}</span>
                          </button>
                          
                          <button
                            onClick={() => handleCancelBooking(booking.id || booking._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>{t('cancel')}</span>
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <p className='flex justify-center items-center'>-</p>
                        // <button
                        //   onClick={() => handleCancelBooking(booking.id || booking._id)}
                        //   className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        // >
                        //   <X className="w-4 h-4" />
                        //   <span>{t('cancel')}</span>
                        // </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {bookings.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <p className="text-gray-500 text-lg mb-2">
                      {totalBookings === 0 
                        ? t('no_bookings_found') 
                        : t('no_bookings_match_filters')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {totalBookings === 0
                        ? (activeTab === 'all'
                            ? t('no_bookings_yet')
                            : `${t('no_bookings_with_status', { status: t(activeTab) })}`)
                        : t('try_adjusting_filters')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination for Desktop View */}
          {bookings.length > 0 && !isLoading && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </main>

    {/* <Footer /> */}
  </div>
);
};

export default ProviderBookings;