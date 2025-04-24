import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { 
  getProviderListings, 
  getProviderBookings,
  getUnavailableDates,
  blockDates,
  getProviderCalendarBookings
} from '../../api/providerAPI';


const formatDateWithoutTimezoneOffset = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateCalendarDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const previousMonthDaysCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalDaysToShow = previousMonthDaysCount + daysInMonth;
  const needSixRows = totalDaysToShow > 35; 
  const totalCells = needSixRows ? 42 : 35;
  const nextMonthDaysCount = totalCells - (previousMonthDaysCount + daysInMonth);
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousMonthYear = month === 0 ? year - 1 : year;
  const previousMonthDays = new Date(previousMonthYear, previousMonth + 1, 0).getDate();
  const days = [];
  
  for (let i = previousMonthDays - previousMonthDaysCount + 1; i <= previousMonthDays; i++) {
    days.push({
      date: new Date(previousMonthYear, previousMonth, i),
      isCurrentMonth: false,
      isPreviousMonth: true
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    days.push({
      date: new Date(nextMonthYear, nextMonth, i),
      isCurrentMonth: false,
      isNextMonth: true
    });
  }
  
  return days;
};

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  
  return [year, month, day].join('-');
};

const isDateInRange = (dateStr, startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return false;
  
  try {
    return dateStr >= startDateStr && dateStr <= endDateStr;
  } catch (error) {
    console.error('Error in date comparison:', error);
    return false;
  }
};


const Calendar = ({ currentDate, bookings, listings, unavailableDates, selectedListing, onBookingClick, onDateClick }) => {
  const { t } = useLanguage();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const calendarDays = generateCalendarDays(year, month);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const filteredBookings = selectedListing === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.listingId === selectedListing);
    
  const filteredUnavailableDates = selectedListing === 'all' 
    ? unavailableDates 
    : unavailableDates.filter(date => date.listingId === selectedListing);
  
  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  const getBookingsForDate = (date) => {
    const dateString = formatDate(date);
    const bookingsForDate = filteredBookings.filter(booking => 
      isDateInRange(dateString, booking.checkIn, booking.checkOut)
    );
    
    return bookingsForDate;
  };
  
  const isDateUnavailable = (date) => {
    const dateString = formatDate(date);
    return filteredUnavailableDates.some(unavailableDate => 
      unavailableDate.date === dateString
    );
  };
  

const renderCellContent = (day) => {
  const dateString = formatDate(day.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = formatDate(today) === dateString;
  const isPastDate = day.date < today;
  const bookingsForDay = getBookingsForDate(day.date);
  const isBooked = bookingsForDay.length > 0;
  const isUnavailable = isDateUnavailable(day.date);
  let baseCellClass = day.isCurrentMonth ? 'bg-white' : 'bg-gray-50';
  let statusClass = '';
  if (isPastDate) {
    statusClass = 'bg-gray-100 opacity-50';
  } else if (isBooked) {
    statusClass = 'bg-green-50';
  } else if (isUnavailable) {
    statusClass = 'bg-red-100';
  } else if (isToday) {
    statusClass = 'bg-blue-50 border border-blue-200';
  }
  
  return (
    <div 
      className={`h-full w-full rounded-lg p-1 ${baseCellClass} ${statusClass}`}
      onClick={() => day.isCurrentMonth && !isPastDate && !isBooked && onDateClick(dateString)}
    >
      <div className="text-right p-1">
        <span className={`text-sm ${
          day.isCurrentMonth 
            ? isToday ? 'font-bold text-blue-600' 
            : isPastDate ? 'text-red-400'
            : 'text-gray-900' 
            : 'text-gray-400'
        }`}>
          {day.date.getDate()}
        </span>
      </div>
      
      <div className="mt-1 space-y-1">
        {isUnavailable && (
          <div className="h-5 rounded bg-red-200 text-xs flex items-center justify-center text-red-600 font-medium">
            {t('unavailable')}
          </div>
        )}
        
        {bookingsForDay.map((booking, index) => (
          <div 
            key={booking.id}
            onClick={(e) => {
              e.stopPropagation();
              onBookingClick(booking);
            }}
            className={`text-xs p-1 rounded-sm truncate cursor-pointer ${
              booking.status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : booking.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            } ${index > 1 ? 'hidden md:block' : ''}`}
          >
            {booking.guestName}
            {bookingsForDay.length > 2 && index === 1 && (
              <span className="md:hidden"> +{bookingsForDay.length - 2} more</span>
            )}
          </div>
        ))}
        
        {bookingsForDay.length > 3 && (
          <div className="text-xs text-center text-gray-500 hidden md:block">
            +{bookingsForDay.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Calendar header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium">
            {monthNames[month]} {year}
          </h2>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <button
          onClick={() => {
            setMonth(currentDate.getMonth());
            setYear(currentDate.getFullYear());
          }}
          className="text-sm text-brand hover:underline"
        >
            {t('today')}
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr border-b">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`min-h-[100px] border-t border-r ${
              i % 7 === 0 ? 'border-l' : ''
            } ${i >= 35 ? 'border-b' : ''}`}
          >
            {renderCellContent(day)}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-100"></div>
          <span>{t('confirmed')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-yellow-100"></div>
          <span>{t('pending')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
          <span>{t('unavailable')}</span>
        </div>
      </div>
    </div>
  );
};

const BookingDetailsModal = ({ booking, onClose }) => {
  const { t } = useLanguage();
  if (!booking) return null;
  
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  const formatDisplayDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{booking.listingTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              &times;
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{t('guest')}</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  {booking.guestName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                  <div className="text-xs text-gray-500">
                    {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}, 
                    {' '}{booking.dogCount} {booking.dogCount === 1 ? 'dog' : 'dogs'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{t('check_in')}</div>
                <div className="text-sm text-gray-900">{formatDisplayDate(booking.checkIn)}</div>
              </div>
              <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{t('check_out')}</div>
                <div className="text-sm text-gray-900">{formatDisplayDate(booking.checkOut)}</div>
              </div>
            </div>
            
            <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{t('duration')}</div>
              <div className="text-sm text-gray-900">{nights} {nights === 1 ? t('night') : t('nights')}</div>
            </div>
            
            <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{t('status')}</div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('close')}
            </button>
            <button
              onClick={() => {
                onClose();
                alert(`Navigating to full booking details for ${booking.id}`);
              }}
              className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand/90"
            >
               {t('view_details')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const BlockDateModal = ({ isOpen, onClose, listings, selectedDate, onSave, bookings }) => {
  const { t } = useLanguage();
  const [selectedListing, setSelectedListing] = useState('');
  const [reason, setReason] = useState('maintenance');
  const [customReason, setCustomReason] = useState('');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(selectedDate && new Date(selectedDate) >= today ? selectedDate : minDate);
  const [endDate, setEndDate] = useState(selectedDate && new Date(selectedDate) >= today ? selectedDate : minDate);
  const [bookedDates, setBookedDates] = useState([]);
  
  useEffect(() => {
    if (selectedListing && bookings) {
      const listingBookings = bookings.filter(booking => 
        booking.listingId === selectedListing
      );
      const bookedDatesList = [];
      listingBookings.forEach(booking => {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        
        for (let date = new Date(checkIn); date <= checkOut; date.setDate(date.getDate() + 1)) {
          bookedDatesList.push(date.toISOString().split('T')[0]);
        }
      });
      
      setBookedDates(bookedDatesList);
    } else {
      setBookedDates([]);
    }
  }, [selectedListing, bookings]);
  
  useEffect(() => {
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj >= today) {
        setStartDate(selectedDate);
        setEndDate(selectedDate);
      }
    }
  }, [selectedDate]);

  const isDateRangeValid = () => {
    if (!startDate || !endDate || !selectedListing) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      if (bookedDates.includes(dateString)) {
        return false;
      }
    }
    
    return true;
  };
  
  const handleSave = () => {
    if (!isDateRangeValid()) {
      alert(t('cannot_block_booked_dates'));
      return;
    }
    
    console.log('Blocking dates:', {
      listingId: selectedListing,
      startDate,
      endDate,
      reason: reason === 'custom' ? customReason : reason
    });
    
    const reasonText = reason === 'custom' ? customReason : reason;
    onSave({
      listingId: selectedListing,
      startDate,
      endDate,
      reason: reasonText
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('block_dates')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              &times;
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="listing" className="block text-sm font-medium text-gray-700 mb-1">
              {t('property')}
              </label>
              <select
                id="listing"
                value={selectedListing}
                onChange={(e) => setSelectedListing(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              >
                <option value="" disabled>{t('select_property')}</option>
                {listings.map(listing => (
                  <option key={listing.id || listing._id} value={listing.id || listing._id}>{listing.title}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('start_date')}
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  min={minDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('end_date')}
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              {t('reason')}
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                 <option value="maintenance">{t('maintenance')}</option>
                <option value="personal">{t('personal_use')}</option>
                <option value="renovation">{t('renovation')}</option>
                <option value="custom">{t('other_specify')}</option>
              </select>
            </div>
            
            {reason === 'custom' && (
              <div>
                <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
                {t('specify_reason')}
                </label>
                <input
                  type="text"
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder={t('enter_reason')}
                  required
                />
              </div>
            )}
            
            {!isDateRangeValid() && selectedListing && startDate && endDate && (
              <div className="text-red-600 text-sm">
                {t('warning_dates_already_booked')}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
             {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedListing || !startDate || !endDate || !isDateRangeValid() || (reason === 'custom' && !customReason)}
              className={`px-4 py-2 bg-brand text-white rounded-md text-sm font-medium ${
                !selectedListing || !startDate || !endDate || !isDateRangeValid() || (reason === 'custom' && !customReason)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-brand/90'
              }`}
            >
              {t('block_dates')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProviderCalendar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState('all');
  const [currentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [listings, setListings] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedDateForBlock, setSelectedDateForBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWiderDateRange = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const paddedStartDate = new Date(currentYear, currentMonth - 2, 1);
    const paddedEndDate = new Date(currentYear, currentMonth + 3, 0);
    
    return {
      startDate: formatDate(paddedStartDate),
      endDate: formatDate(paddedEndDate)
    };
  };

  const fetchUnavailableDates = async () => {
    try {
      const { startDate, endDate } = getWiderDateRange();
      
      console.log(`Fetching unavailable dates for wider range: ${startDate} to ${endDate}`);
      
      const unavailableDatesData = await getUnavailableDates({
        listingId: selectedListing !== 'all' ? selectedListing : undefined,
        startDate: startDate,
        endDate: endDate
      });
      
      console.log('Unavailable dates from API:', unavailableDatesData);
      
      const formattedUnavailableDates = unavailableDatesData.map(date => ({
        date: typeof date.date === 'string' ? date.date : new Date(date.date).toISOString().split('T')[0],
        listingId: date.listing?._id || date.listing || date.listingId,
        reason: date.reason || 'unavailable'
      }));
      
      console.log('Formatted unavailable dates:', formattedUnavailableDates);
      setUnavailableDates(formattedUnavailableDates);
    } catch (err) {
      console.error('Error fetching unavailable dates:', err);
    }
  };
  
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get basic listings data
        const listingsData = await getProviderListings();
        setListings(listingsData);
        
        // Get wider date range for bookings
        const { startDate, endDate } = getWiderDateRange();
        
        // Fetch bookings for the calendar
        const bookingsData = await getProviderCalendarBookings({
          status: activeTab !== 'all' ? activeTab : undefined,
          listingId: selectedListing !== 'all' ? selectedListing : undefined,
          dateRange: `${startDate},${endDate}`
        });
        
        const formattedBookings = bookingsData.map(booking => ({
          id: booking._id || booking.id,
          checkIn: booking.checkInDate ? formatDateWithoutTimezoneOffset(new Date(booking.checkInDate)) : null,
          checkOut: booking.checkOutDate ? formatDateWithoutTimezoneOffset(new Date(booking.checkOutDate)) : null,
          guestName: booking.user?.username || booking.user?.firstName + ' ' + booking.user?.lastName || 'Guest',
          status: booking.status,
          listingId: booking.listing?._id || booking.listing,
          listingTitle: booking.listing?.title || 'Property',
          guestCount: booking.guestCount || 1,
          dogCount: booking.dogCount || 0
        }));
        
        setBookings(formattedBookings);
      
        await fetchUnavailableDates();
        
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Failed to load calendar data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCalendarData();
  }, [selectedListing, activeTab]);
  
  const handleOpenBlockModal = (date) => {
    setSelectedDateForBlock(date);
    setIsBlockModalOpen(true);
  };
  
  const handleBlockDates = async (blockData) => {
    try {
      setIsLoading(true);
      console.log('Sending block dates request with data:', blockData);
      const response = await blockDates(blockData);
      console.log('Block dates API response:', response);
      await fetchUnavailableDates();
      
      alert(t('dates_blocked_successfully'));
    } catch (error) {
      console.error('Error blocking dates:', error);
      alert(t('error_blocking_dates'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !bookings.length && !listings.length) {
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
            <h1 className="text-3xl font-semibold text-gray-900">{t('calendar')}</h1>
          </div>
          
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 ml-3">{t('loading_calendar')}</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

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
            <h1 className="text-3xl font-semibold text-gray-900">{t('calendar')}</h1>
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('calendar')}</h1>
            </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              
            <select
              value={selectedListing}
              onChange={(e) => setSelectedListing(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
            >
              <option value="all">{t('all_properties')}</option>
              {listings.map(listing => (
                <option key={listing.id || listing._id} value={listing.id || listing._id}>
                  {listing.title}
                </option>
              ))}
            </select>
            </div>
            
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
                {t('block_dates')}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
        <Calendar 
          currentDate={currentDate}
          bookings={bookings}
          listings={listings}
          unavailableDates={unavailableDates}
          selectedListing={selectedListing}
          onBookingClick={(booking) => setSelectedBooking(booking)}
          onDateClick={handleOpenBlockModal}
        />
        </div>
      </main>
      
      {/* Booking details modal */}
      {selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
      
      {/* Block date modal */}
      <BlockDateModal 
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        listings={listings}
        bookings={bookings}
        selectedDate={selectedDateForBlock ? formatDate(selectedDateForBlock) : null}
        onSave={handleBlockDates}
      />
      
      <Footer />
    </div>
  );
};

export default ProviderCalendar;