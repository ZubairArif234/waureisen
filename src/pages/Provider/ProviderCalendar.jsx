import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

// Mock data for bookings and availability
const MOCK_BOOKINGS = [
  {
    id: 'B1001',
    listingId: '1',
    listingTitle: 'Modern Studio in City Center',
    guestName: 'John Doe',
    checkIn: '2025-04-12',
    checkOut: '2025-04-16',
    status: 'confirmed',
    guestCount: 2,
    dogCount: 1
  },
  {
    id: 'B1002',
    listingId: '2',
    listingTitle: 'Mountain View Chalet',
    guestName: 'Alice Johnson',
    checkIn: '2025-04-20',
    checkOut: '2025-04-23',
    status: 'pending',
    guestCount: 4,
    dogCount: 2
  },
  {
    id: 'B1003',
    listingId: '3',
    listingTitle: 'Lakeside Apartment',
    guestName: 'Robert Smith',
    checkIn: '2025-05-05',
    checkOut: '2025-05-10',
    status: 'confirmed',
    guestCount: 3,
    dogCount: 1
  }
];

// Mock listing data
const MOCK_LISTINGS = [
  { id: '1', title: 'Modern Studio in City Center' },
  { id: '2', title: 'Mountain View Chalet' },
  { id: '3', title: 'Lakeside Apartment' },
  { id: '4', title: 'Cozy Cottage in the Woods' }
];

// Custom unavailable dates (e.g., for maintenance)
const MOCK_UNAVAILABLE_DATES = [
  { listingId: '1', date: '2025-04-10', reason: 'Maintenance' },
  { listingId: '1', date: '2025-04-11', reason: 'Maintenance' },
  { listingId: '2', date: '2025-05-01', reason: 'Personal Use' },
  { listingId: '2', date: '2025-05-02', reason: 'Personal Use' },
  { listingId: '2', date: '2025-05-03', reason: 'Personal Use' }
];

// Helper function to generate days for the calendar
const generateCalendarDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const previousMonthDaysCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
  const nextMonthDaysCount = 42 - (previousMonthDaysCount + daysInMonth); // 6 rows × 7 days = 42 total cells
  
  // Previous month's days
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousMonthYear = month === 0 ? year - 1 : year;
  const previousMonthDays = new Date(previousMonthYear, previousMonth + 1, 0).getDate();
  
  const days = [];
  
  // Add days from previous month
  for (let i = previousMonthDays - previousMonthDaysCount + 1; i <= previousMonthDays; i++) {
    days.push({
      date: new Date(previousMonthYear, previousMonth, i),
      isCurrentMonth: false,
      isPreviousMonth: true
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Add days from next month
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

// Format date to string (YYYY-MM-DD)
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  
  return [year, month, day].join('-');
};

// Check if a date is within a range
const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return d >= start && d <= end;
};

// Calendar component
const Calendar = ({ currentDate, bookings, listings, unavailableDates, selectedListing, onBookingClick }) => {
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
    return filteredBookings.filter(booking => 
      isDateInRange(dateString, booking.checkIn, booking.checkOut)
    );
  };
  
  const isDateUnavailable = (date) => {
    const dateString = formatDate(date);
    return filteredUnavailableDates.some(unavailableDate => 
      unavailableDate.date === dateString
    );
  };
  
  const renderCellContent = (day) => {
    const dateString = formatDate(day.date);
    const bookingsForDay = getBookingsForDate(day.date);
    const isUnavailable = isDateUnavailable(day.date);
    const today = new Date();
    const isToday = formatDate(today) === dateString;
    
    return (
      <div className={`h-full w-full rounded-lg p-1 ${
        isToday ? 'bg-blue-50 border border-blue-200' : ''
      }`}>
        <div className="text-right p-1">
          <span className={`text-sm ${
            day.isCurrentMonth 
              ? isToday ? 'font-bold text-blue-600' : 'text-gray-900' 
              : 'text-gray-400'
          }`}>
            {day.date.getDate()}
          </span>
        </div>
        
        <div className="mt-1 space-y-1">
          {isUnavailable && (
            <div className="h-5 rounded bg-gray-200 text-xs flex items-center justify-center text-gray-600 font-medium">
              Unavailable
            </div>
          )}
          
          {bookingsForDay.map((booking, index) => (
            <div 
              key={booking.id}
              onClick={() => onBookingClick(booking)}
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
          Today
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
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-yellow-100"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

// Booking details modal
const BookingDetailsModal = ({ booking, onClose }) => {
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
              <div className="text-sm font-medium text-gray-500 mb-1">Guest</div>
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
                <div className="text-sm font-medium text-gray-500 mb-1">Check-in</div>
                <div className="text-sm text-gray-900">{formatDisplayDate(booking.checkIn)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Check-out</div>
                <div className="text-sm text-gray-900">{formatDisplayDate(booking.checkOut)}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Duration</div>
              <div className="text-sm text-gray-900">{nights} {nights === 1 ? 'night' : 'nights'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
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
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to booking details in a real app
                alert(`Navigating to full booking details for ${booking.id}`);
              }}
              className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand/90"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Block date modal
const BlockDateModal = ({ isOpen, onClose, listings, selectedDate, onSave }) => {
  const [selectedListing, setSelectedListing] = useState('');
  const [reason, setReason] = useState('maintenance');
  const [customReason, setCustomReason] = useState('');
  const [startDate, setStartDate] = useState(selectedDate || '');
  const [endDate, setEndDate] = useState(selectedDate || '');
  
  useEffect(() => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  }, [selectedDate]);
  
  const handleSave = () => {
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
            <h2 className="text-lg font-semibold text-gray-900">Block Dates</h2>
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
                Property
              </label>
              <select
                id="listing"
                value={selectedListing}
                onChange={(e) => setSelectedListing(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              >
                <option value="" disabled>Select a property</option>
                {listings.map(listing => (
                  <option key={listing.id} value={listing.id}>{listing.title}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
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
                Reason
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="maintenance">Maintenance</option>
                <option value="personal">Personal Use</option>
                <option value="renovation">Renovation</option>
                <option value="custom">Other (specify)</option>
              </select>
            </div>
            
            {reason === 'custom' && (
              <div>
                <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Specify Reason
                </label>
                <input
                  type="text"
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="Enter reason"
                  required
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedListing || !startDate || !endDate || (reason === 'custom' && !customReason)}
              className={`px-4 py-2 bg-brand text-white rounded-md text-sm font-medium ${
                !selectedListing || !startDate || !endDate || (reason === 'custom' && !customReason)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-brand/90'
              }`}
            >
              Block Dates
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProviderCalendar = () => {
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState('all');
  const [currentDate] = useState(new Date());
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [unavailableDates, setUnavailableDates] = useState(MOCK_UNAVAILABLE_DATES);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedDateForBlock, setSelectedDateForBlock] = useState(null);
  
  const handleOpenBlockModal = (date) => {
    setSelectedDateForBlock(date);
    setIsBlockModalOpen(true);
  };
  
  const handleBlockDates = (blockData) => {
    // In a real app, you would call an API to block these dates
    console.log('Blocking dates:', blockData);
    
    const startDate = new Date(blockData.startDate);
    const endDate = new Date(blockData.endDate);
    const newUnavailableDates = [];
    
    // Create entries for each day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      newUnavailableDates.push({
        listingId: blockData.listingId,
        date: formatDate(d),
        reason: blockData.reason
      });
    }
    
    setUnavailableDates([...unavailableDates, ...newUnavailableDates]);
    alert('Dates have been blocked successfully!');
  };
  
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
            <h1 className="text-3xl font-semibold text-gray-900">Calendar</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedListing}
                onChange={(e) => setSelectedListing(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              >
                <option value="all">All Properties</option>
                {MOCK_LISTINGS.map(listing => (
                  <option key={listing.id} value={listing.id}>{listing.title}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Block Dates
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <Calendar 
            currentDate={currentDate}
            bookings={bookings}
            listings={MOCK_LISTINGS}
            unavailableDates={unavailableDates}
            selectedListing={selectedListing}
            onBookingClick={(booking) => setSelectedBooking(booking)}
            onDateClick={handleOpenBlockModal}
          />
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings
                  .filter(booking => selectedListing === 'all' || booking.listingId === selectedListing)
                  .map((booking) => {
                    const checkInDate = new Date(booking.checkIn);
                    const checkOutDate = new Date(booking.checkOut);
                    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr 
                        key={booking.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.listingTitle}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.guestName}</div>
                          <div className="text-xs text-gray-500">
                            {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}, 
                            {' '}{booking.dogCount} {booking.dogCount === 1 ? 'dog' : 'dogs'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {nights} {nights === 1 ? 'night' : 'nights'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                {(!bookings.length || (selectedListing !== 'all' && !bookings.some(b => b.listingId === selectedListing))) && (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center">
                      <p className="text-gray-500 text-lg mb-2">No bookings found</p>
                      <p className="text-gray-400 text-sm">
                        {selectedListing === 'all' 
                          ? "You don't have any bookings yet." 
                          : `You don't have any bookings for this property.`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
        listings={MOCK_LISTINGS}
        selectedDate={selectedDateForBlock ? formatDate(selectedDateForBlock) : null}
        onSave={handleBlockDates}
      />
      
      <Footer />
    </div>
  );
};

export default ProviderCalendar;