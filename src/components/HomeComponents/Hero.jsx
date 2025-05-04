import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Shared/Navbar';
import DateRangePicker from './DateRangePicker';
import GuestSelector from './GuestSelector';
import { Search, Calendar, Users } from 'lucide-react';
import bgImage from '../../assets/bg.png';
import { loadGoogleMapsScript, initAutocomplete } from '../../utils/googleMapsUtils';
import { useLanguage } from '../../utils/LanguageContext';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [placeData, setPlaceData] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({
    people: 1,
    dogs: 0
  });
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    try {
      loadGoogleMapsScript(() => {
        // Initialize autocomplete when Google Maps script loads
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteRef.current = initAutocomplete(locationInputRef, handlePlaceSelect);
        } else {
          console.warn('Google Maps Places library not loaded. Autocomplete disabled.');
        }
      });
    } catch (error) {
      console.error('Error loading Google Maps script:', error);
    }

    return () => {
      // Clean up listeners if needed
      if (autocompleteRef.current) {
        // Cleanup would go here if needed
      }
    };
  }, []);

  const handlePlaceSelect = (place) => {
    if (place && place.formatted_address) {
      setLocation(place.formatted_address);
      setPlaceData({
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      });
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setShowLocationSuggestions(e.target.value.length > 0);
    // The actual suggestions are handled by Google Places Autocomplete
  };

  const handleSearch = () => {
    if (!location) {
      return;
    }

    // Format dates for URL with year included
    let dateParam = '';
    if (dateRange.start && dateRange.end) {
      // Use ISO format for dates to ensure year is included
      const startDate = `${dateRange.start.toLocaleString('default', { month: 'short' })} ${String(dateRange.start.getDate()).padStart(2, '0')} ${dateRange.start.getFullYear()}`;
      const endDate = `${dateRange.end.toLocaleString('default', { month: 'short' })} ${String(dateRange.end.getDate()).padStart(2, '0')} ${dateRange.end.getFullYear()}`;
      dateParam = `&dates=${dateRange.start} - ${dateRange.end}`;
      
      // Log the formatted dates for debugging
      console.log('Formatted date range for URL:', startDate, '-', endDate);
    }

    // Build the search URL with coordinates if available
    let searchUrl = `/search?location=${encodeURIComponent(location)}${dateParam}&people=${guests.people}&dogs=${guests.dogs}`;
    
    if (placeData && placeData.location) {
      searchUrl += `&lat=${placeData.location.lat}&lng=${placeData.location.lng}`;
    }

    navigate(searchUrl);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden z-10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <Navbar />

      <div className="relative z-20 pt-40 md:pt-56 min-h-screen flex items-center">
        <div className="w-full px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="md:max-w-2xl pl-4 md:pl-0">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 font-poppins">
                {t('holiday_with_dog')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white mb-8 font-bold font-poppins">
                {t('find_suitable_accommodation')}
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
              {/* Where Input with Google Places Autocomplete */}
              <div className="flex-1 min-w-0 relative">
                <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                  <Search className="h-5 w-5 text-brand flex-shrink-0" />
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder={t('where')}
                    value={location}
                    onChange={handleLocationChange}
                    className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-500 focus:placeholder-brand"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* When Input */}
              <div className="flex-1 min-w-0">
                <div 
                  className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer"
                  onClick={() => setIsCalendarOpen(true)}
                >
                  <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-500">
                    {dateRange.start && dateRange.end
                      ? `${dateRange.start.getDate()} ${dateRange.start.toLocaleString('default', { month: 'short' })} ${dateRange.start.getFullYear()} - ${dateRange.end.getDate()} ${dateRange.end.toLocaleString('default', { month: 'short' })} ${dateRange.end.getFullYear()}`
                      : t('when')}
                  </span>
                </div>
              </div>

              {/* People & Dog Input */}
              <div className="flex-1 min-w-0 relative">
                <div 
                  className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer relative"
                  onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
                >
                  <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 text-sm">
                    {guests.people} {guests.people === 1 ? t('person') : t('people')}, {guests.dogs} {guests.dogs === 1 ? t('dog') : t('dogs')}
                  </span>
                </div>
                {isGuestSelectorOpen && (
                  <GuestSelector
                    guests={guests}
                    onChange={setGuests}
                    onClose={() => setIsGuestSelectorOpen(false)}
                    maxGuests={20}
                    maxDogs={20}
                  />
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-3 rounded-lg text-sm text-white font-medium flex-shrink-0 bg-brand hover:bg-brand/90 transition-colors"
              >
                {t('search')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedRange={dateRange}
        onRangeSelect={(range) => {
          setDateRange(range);
          if (range.start && range.end) {
            setIsCalendarOpen(false);
          }
        }}
      />
    </div>
  );
};

export default Hero;