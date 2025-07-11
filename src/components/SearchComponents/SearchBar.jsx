import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../HomeComponents/DateRangePicker';
import GuestSelector from '../HomeComponents/GuestSelector';
import { Search, Calendar, Users } from 'lucide-react';
import { loadGoogleMapsScript, initAutocomplete } from '../../utils/googleMapsUtils';
import { useLanguage } from '../../utils/LanguageContext';

const SearchBar = ({ 
  initialCode = "",
  initialLocation = '', 
  initialDateRange = { start: null, end: null }, 
  initialGuests = { people: 1, dogs: 0 }, 
  onSearch 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [location, setLocation] = useState(initialLocation);
  const [code, setCode] = useState(initialCode);
  const [inputValue, setInputValue] = useState(initialCode || initialLocation); // Combined input value
  const [placeData, setPlaceData] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [guests, setGuests] = useState(initialGuests);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placeSelectedRef = useRef(false);

  // Helper function to check if input is a listing code
  const isListingCode = (value) => {
    if (!value) return false;
    const regex = /^[A-Z]{2}/;
    return regex.test(value);
  };

  // Update state when props change
  // useEffect(() => {
  //   setLocation(initialLocation);
  //   setCode(initialCode);
  //   setInputValue(initialCode || initialLocation);
  //   setDateRange(initialDateRange);
  //   setGuests(initialGuests);
    
  //   // If we have a location, set the placeData
  //   if (initialLocation) {
  //     setPlaceData({
  //       address: initialLocation,
  //     });
  //   }
  // }, [initialLocation, initialDateRange, initialGuests, initialCode]);

  // Load Google Maps script
  useEffect(() => {
    try {
      loadGoogleMapsScript((success) => {
        if (success) {
          console.log("Google Maps script loaded successfully");
          // Initialize autocomplete when Google Maps script loads
          if (window.google && window.google.maps && window.google.maps.places) {
            autocompleteRef.current = initAutocomplete(locationInputRef, handlePlaceSelect);
          } else {
            console.warn('Google Maps Places library not loaded. Autocomplete disabled.');
          }
        } else {
          console.error("Failed to load Google Maps script");
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
    if (!place) {
      console.warn("No place data received in handlePlaceSelect");
      return;
    }

    if (!place.geometry || !place.geometry.location) {
      console.warn("Place selected with no geometry/location:", place);
      return;
    }

    // Get coordinates from the place
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Place has invalid coordinates:", { lat, lng });
      return;
    }

    console.log("Selected place with coordinates:", {
      address: place.formatted_address,
      lat: lat,
      lng: lng
    });

    // Update states for location-based search
    setLocation(place.formatted_address);
    setCode(''); // Clear code when location is selected
    setInputValue(place.formatted_address);
    setPlaceData({
      address: place.formatted_address,
      location: {
        lat: lat,
        lng: lng
      }
    });
    
    placeSelectedRef.current = true;
    setShowLocationSuggestions(false);
  };

  const handleSearch = () => {
    console.log("Input value:", inputValue);
    console.log("Place data before search:", placeData);
    
    let searchUrl = "/search?";
    
    // Check if input is a listing code
    if (isListingCode(inputValue)) {
      // Handle listing code
      console.log("Searching by listing code:", inputValue);
      searchUrl += `code=${encodeURIComponent(inputValue)}&`;
    } else {
      // Handle location search
      if (inputValue) {
        searchUrl += `location=${encodeURIComponent(inputValue)}&`;
      } else {
        // Default to Switzerland if no location provided
        searchUrl += `location=${encodeURIComponent("Switzerland")}&`;
      }
      
      // Add coordinates if available
      const coordinates = placeData?.location;
      if (coordinates?.lat && coordinates?.lng) {
        searchUrl += `lat=${coordinates.lat}&lng=${coordinates.lng}&`;
      }
    }
    
    // Add date range
    if (dateRange.start && dateRange.end) {
      const startDate = `${dateRange.start.toLocaleString('default', { month: 'short' })} ${String(dateRange.start.getDate()).padStart(2, '0')} ${dateRange.start.getFullYear()}`;
      const endDate = `${dateRange.end.toLocaleString('default', { month: 'short' })} ${String(dateRange.end.getDate()).padStart(2, '0')} ${dateRange.end.getFullYear()}`;
      searchUrl += `dates=${encodeURIComponent(startDate + ' - ' + endDate)}&`;
    }
    
    // Add guests
    searchUrl += `people=${guests.people}&`;
    if (guests.dogs && guests.dogs > 0) {
      searchUrl += `dogs=${guests.dogs}&`;
    }
    
    // Remove trailing '&' if present
    if (searchUrl.endsWith('&')) {
      searchUrl = searchUrl.slice(0, -1);
    }
    
    // Navigate to search page
    if (onSearch && typeof onSearch === 'function') {
      onSearch(searchUrl);
    } else {
      navigate(searchUrl);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (isListingCode(value)) {
      // Handle listing code input
      setCode(value);
      setLocation('');
      setPlaceData(null);
      setShowLocationSuggestions(false);
    } else {
      // Handle location input
      setLocation(value);
      setCode('');
      setShowLocationSuggestions(value.length > 0);
      placeSelectedRef.current = false;
      
      // Clear placeData if input is empty
      if (!value) {
        setPlaceData(null);
      }
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
      {/* Where Input with Google Places Autocomplete */}
      <div className="flex-1 min-w-0 relative">
        <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl border-2 border-transparent hover:border-brand focus-within:border-brand transition-colors">
          <Search className="h-5 w-5 text-brand flex-shrink-0" />
          <input
            ref={locationInputRef}
            type="text"
            placeholder={t('where') || 'Where to? / Enter code (e.g., CH93849)'}
            value={inputValue}
            onChange={handleLocationChange}
            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-500 focus:placeholder-brand"
            autoComplete="off"
          />
        </div>
      </div>

      {/* When Input */}
      <div className="flex-1 min-w-0">
        <div 
          className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl cursor-pointer border-2 border-transparent hover:border-brand focus-within:border-brand transition-colors"
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
          className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl cursor-pointer relative border-2 border-transparent hover:border-brand focus-within:border-brand transition-colors"
          onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
        >
          <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-500 text-sm">
            {guests.people} {guests.people === 1 ? t('person') : t('people')}, {guests.dogs} {guests.dogs === 1 ? t('dog') : t('dogs')}
          </span>
        </div>
        {isGuestSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10">
            <GuestSelector
              guests={guests}
              onChange={setGuests}
              onClose={() => setIsGuestSelectorOpen(false)}
              maxGuests={25}
              maxDogs={25}
            />
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full md:w-auto px-8 py-3 rounded-lg text-sm text-white font-medium flex-shrink-0 bg-brand hover:bg-brand/90 transition-colors"
      >
        {t('search')}
      </button>

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

export default SearchBar;