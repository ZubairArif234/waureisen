import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../HomeComponents/DateRangePicker';
import GuestSelector from '../HomeComponents/GuestSelector';
import { Search, Calendar, Users, SlidersHorizontal } from 'lucide-react';
import { loadGoogleMapsScript, initAutocomplete } from '../../utils/googleMapsUtils';
import { useLanguage } from '../../utils/LanguageContext';
import MoreFiltersModal from './MoreFiltersModal';
import { useSearchFilters } from '../../context/SearchFiltersContext';

const SearchBarTwo = ({ 
  initialLocation = '', 
  initialDateRange = { start: null, end: null }, 
  initialGuests = { people: 1, dogs: 0 }, 
  onSearch 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { searchFilters } = useSearchFilters();
  const [location, setLocation] = useState(initialLocation);
  const [placeData, setPlaceData] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [guests, setGuests] = useState(initialGuests);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placeSelectedRef = useRef(false);

  // Update state when props change
  useEffect(() => {
    setLocation(initialLocation);
    setDateRange(initialDateRange);
    setGuests(initialGuests);
    
    // If we have a location, set the placeData
    if (initialLocation) {
      setPlaceData({
        address: initialLocation,
        // location: {
        //   lat: 46.8182,
        //   lng: 8.2275
        // }
      });
    }
  }, [initialLocation, initialDateRange, initialGuests]);

  // Load Google Maps script
  useEffect(() => {
    try {
      loadGoogleMapsScript((success) => {
        if (success) {
          console.log("Google Maps script loaded successfully");
          if (window.google && window.google.maps && window.google.maps.places) {
            autocompleteRef.current = initAutocomplete(locationInputRef, handlePlaceSelect);
            
            // Style the Google Places dropdown
            const styleGoogleDropdown = () => {
              const pacContainers = document.querySelectorAll('.pac-container');
              pacContainers.forEach(container => {
                container.style.zIndex = '9999';
                container.style.marginTop = '8px';
                container.style.borderRadius = '12px';
                container.style.border = '1px solid #e5e7eb';
                container.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                container.style.fontSize = '14px';
                container.style.minWidth = '300px';
                container.style.maxWidth = '400px';
              });
              
              const pacItems = document.querySelectorAll('.pac-item');
              pacItems.forEach(item => {
                item.style.padding = '12px 16px';
                item.style.borderBottom = '1px solid #f3f4f6';
                item.style.cursor = 'pointer';
              });
              
              const pacItemQueries = document.querySelectorAll('.pac-item-query');
              pacItemQueries.forEach(query => {
                query.style.fontSize = '14px';
                query.style.fontWeight = '500';
                query.style.color = '#1f2937';
              });
              
              const pacMatched = document.querySelectorAll('.pac-matched');
              pacMatched.forEach(matched => {
                matched.style.fontWeight = '600';
              });
            };
            
            // Apply styles after a short delay to ensure elements are rendered
            setTimeout(styleGoogleDropdown, 100);
            
            // Also apply styles when dropdown appears
            const observer = new MutationObserver(styleGoogleDropdown);
            observer.observe(document.body, { childList: true, subtree: true });
            
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
      if (autocompleteRef.current) {
        // Cleanup would go here if needed
      }
    };
  }, []);

  const handlePlaceSelect = (place) => {
    console.log(place , "ye konsi hai")
    if (!place) {
      console.warn("No place data received in handlePlaceSelect");
      return;
    }

    if (!place.geometry || !place.geometry.location) {
      console.warn("Place selected with no geometry/location:", place);
      return;
    }

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

    setLocation(place.formatted_address);
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
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Place data before search:", placeData);  
    console.log("Current search filters from context:", searchFilters);
    
    const coordinates = placeData?.location ;
    let lat = urlParams.get("lat")
    let lng = urlParams.get("lng")

    let searchUrl = `/search?location=${encodeURIComponent(location)}`;
    searchUrl += `&lat=${coordinates?.lat ? coordinates?.lat : lat}&lng=${coordinates?.lng ? coordinates?.lng : lng}`;
    
    let dateParam = '';
    if (dateRange.start && dateRange.end) {
      const startDate = `${dateRange.start.toLocaleString('default', { month: 'short' })} ${String(dateRange.start.getDate()).padStart(2, '0')} ${dateRange.start.getFullYear()}`;
      const endDate = `${dateRange.end.toLocaleString('default', { month: 'short' })} ${String(dateRange.end.getDate()).padStart(2, '0')} ${dateRange.end.getFullYear()}`;
      dateParam = `&dates=${startDate} - ${endDate}`;
    }

    let guestParam = `&people=${guests.people}`;
  if (guests.dogs && guests.dogs > 0) {
    guestParam += `&dogs=${guests.dogs}`;
  }
    searchUrl += `${dateParam}${guestParam}`;
    
    // Get filters from URL if they exist
    const urlFilters = urlParams.get('searchFilters');
    
    // Use filters from URL if available, otherwise use context
    let filtersToSend = null;
    if (urlFilters) {
      try {
        filtersToSend = JSON.parse(urlFilters);
        console.log('Using filters from URL:', filtersToSend);
      } catch (e) {
        console.error('Error parsing filters from URL:', e);
      }
    } else if (searchFilters) {
      // Ensure we have the correct structure
      filtersToSend = {
        selected: searchFilters.selected || {},
        ranges: searchFilters.ranges || {}
      };
      console.log('Using filters from context:', filtersToSend);
    }
    
    // Only add filters if they exist and have values
    if (filtersToSend) {
      const hasSelectedFilters = Object.values(filtersToSend.selected || {}).some(arr => arr && arr.length > 0);
      const hasRangeFilters = Object.values(filtersToSend.ranges || {}).some(range => 
        range && (range.min !== undefined || range.max !== undefined)
      );
      
      if (hasSelectedFilters || hasRangeFilters) {
        console.log('Sending filters to API:', filtersToSend);
        searchUrl += `&searchFilters=${encodeURIComponent(JSON.stringify(filtersToSend))}`;
      }
    }
    
    if (onSearch && typeof onSearch === 'function') {
      // Pass the filters directly to the onSearch function
      onSearch(searchUrl, filtersToSend);
    } else {
      navigate(searchUrl);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setShowLocationSuggestions(e.target.value.length > 0);
    placeSelectedRef.current = false;
    
    if (!e.target.value) {
      setPlaceData(null);
    }
  };

  return (
    <>
      {/* Main container - small and responsive */}
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        {/* Compact Search Bar */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1 sm:p-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Where Input */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-lg">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {/* Always show input field */}
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder={t('where') || 'Where to?'}
                  value={location}
                  onChange={handleLocationChange}
                  className="bg-transparent outline-none w-full text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="w-px h-4 sm:h-6 bg-gray-200 hidden sm:block"></div>

            {/* When Input */}
            <div className="flex-1 min-w-0">
              <div 
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => setIsCalendarOpen(true)}
              >
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {/* Desktop text */}
                <span className="text-sm text-gray-600 truncate hidden sm:block">
                  {dateRange.start && dateRange.end
                    ? `${dateRange.start.getDate()} ${dateRange.start.toLocaleString('default', { month: 'short' })} - ${dateRange.end.getDate()} ${dateRange.end.toLocaleString('default', { month: 'short' })}`
                    : t('when') || 'When?'}
                </span>
                {/* Mobile text */}
                <span className="text-xs text-gray-500 truncate block sm:hidden">
                  {dateRange.start && dateRange.end
                    ? `${dateRange.start.getDate()}/${dateRange.start.getMonth() + 1} - ${dateRange.end.getDate()}/${dateRange.end.getMonth() + 1}`
                    : t('when') || 'When?'}
                </span>
              </div>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="w-px h-4 sm:h-6 bg-gray-200 hidden sm:block"></div>

            {/* Who Input */}
            <div className="flex-1 min-w-0 relative">
              <div 
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
              >
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {/* Desktop text */}
                <span className="text-sm text-gray-600 truncate hidden sm:block">
                  {guests.people} {guests.people === 1 ? t('person') || 'guest' : t('people') || 'guests'}, {guests.dogs} {guests.dogs === 1 ? t('dog') || 'dog' : t('dogs') || 'dogs'}
                </span>
                {/* Mobile text */}
                <span className="text-xs text-gray-500 truncate block sm:hidden">
                  {guests.people + guests.dogs}
                </span>
              </div>
              
              {/* Guest Selector Popup */}
              {isGuestSelectorOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
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
              className="bg-brand hover:bg-brand/90 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setIsMoreFiltersOpen(true)}
          className="flex items-center gap-2 px-2 sm:px-4 py-2 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors bg-white flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:block">{t('filters') || 'Filter'}</span>
        </button>
      </div>

      {/* Date Range Picker Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-auto">
            <DateRangePicker
              isOpen={true}
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
        </div>
      )}

     

      {/* More Filters Modal */}
      <MoreFiltersModal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
      />
    </>
  );
};

export default SearchBarTwo;