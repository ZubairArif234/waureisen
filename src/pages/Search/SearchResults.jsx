// src/pages/SearchResults.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import Navbar from "../../components/Shared/Navbar";
import OptimizedMapWithClustering from "../../components/SearchComponents/OptimizedMapWithClustering";
import ImprovedVirtualizedListings from "../../components/SearchComponents/ImprovedVirtualizedListings";
import MapToggle from "../../components/SearchComponents/MapToggle";
import SkeletonCard from "../../components/SearchComponents/SkeletonCard";
import Footer from "../../components/Shared/Footer";
import EnhancedSearchBar from "../../components/SearchComponents/SearchBarTwo";
import { useListings, ListingProvider } from "../../context/ListingContext";
import { SearchFiltersProvider, useSearchFilters } from "../../context/SearchFiltersContext";

// Lazy-loaded components for better initial load performance
const MoreFiltersModal = lazy(() => import('../../components/SearchComponents/MoreFiltersModal'));

/**
 * Main content component that uses the ListingContext
 * Using a separate component allows us to use hooks inside the provider
 */
const SearchResultsContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchFilters } = useSearchFilters();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const urlProcessedRef = useRef(false);
  const lastLocationRef = useRef('');
  
  const { 
    listings, 
    isLoading, 
    isInitialLoad,
    error, 
    showMap, 
    setShowMap,
    searchParams,
    updateSearchParams,
    clearError,
    hasMore,
    totalAccommodationsInRadius,
    isDraggingMap,
    setMapDragging
  } = useListings();
  
  // Filter listings based on price range
  const filteredListings = listings.filter(listing => {
    // If we're still loading or in initial load, don't filter by price
    if (isLoading || isInitialLoad) {
      return true;
    }

    const price = listing.pricePerNight?.price || 0;
    const { min, max } = searchFilters.ranges.price || { min: 0, max: 10000 };
    
    // If price is 0 and we're not in loading state, it means the listing is not available
    if (price === 0 && !isLoading) {
      return false;
    }
    
    return price >= min && price <= max;
  });
  
  useEffect(() => {
    // Prevent re-processing the same URL
    if (lastLocationRef.current === location.search) {
      return;
    }
    
    lastLocationRef.current = location.search;
    
    const urlParams = new URLSearchParams(location.search);
    
    // Extract location and coordinates
    const locationName = urlParams.get("location") || "";
    
    // Extract and validate coordinates
    let lat = urlParams.get("lat");
    let lng = urlParams.get("lng");
    
    // Parse to numbers
    lat = lat ? parseFloat(lat) : null;
    lng = lng ? parseFloat(lng) : null;
    
    console.log("Extracted coordinates from URL:", { lat, lng });
    
    // Validate coordinates
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng) || 
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn("Invalid or missing coordinates in URL, using defaults");
      lat = 46.818188;
      lng = 8.227512;
    }
    
    // Use a 500km radius by default
    const radius = parseFloat(urlParams.get("radius")) || 500;
    
    // Extract date range
    const dateRange = urlParams.get("dates") || "";
    const dates = dateRange ? dateRange.split(" - ") : [];
    
    // Extract guest counts
    const people = parseInt(urlParams.get("people")) || 1;
    const dogs = parseInt(urlParams.get("dogs")) || 0;
    
    // Extract filters
    const filtersParam = urlParams.get("filters");
    let filters = [];
    try {
      filters = filtersParam ? JSON.parse(filtersParam) : [];
    } catch (e) {
      console.error("Error parsing filters", e);
    }
    
    // Extract more filters
    const moreFiltersParam = urlParams.get("moreFilters");
    let moreFilters = {};
    try {
      moreFilters = moreFiltersParam ? JSON.parse(moreFiltersParam) : {};
    } catch (e) {
      console.error("Error parsing moreFilters", e);
    }
    
    // Extract price range
    const priceRange = { 
      min: parseInt(urlParams.get("priceMin")) || 0,
      max: parseInt(urlParams.get("priceMax")) || 10000
    };
    
    // Create search param object
    const newSearchParams = {
      lat, 
      lng,
      radius,
      locationName,
      filters: {
        dateRange: {
          start: dates[0] ? new Date(dates[0]) : null,
          end: dates[1] ? new Date(dates[1]) : null
        },
        amenities: filters,
        guestCount: people,
        dogCount: dogs,
        ...moreFilters
      },
      priceRange,
      searchFilters // Add search filters from context
    };
    
    console.log("Updating search params with coordinates:", { lat, lng });
    console.log("Updating search params with filters:", searchFilters);
    
    // Mark URL as processed to prevent loops
    urlProcessedRef.current = true;
    
    // Update search params in context
    updateSearchParams(newSearchParams);
  }, [location.search, updateSearchParams, searchFilters]);

  // Helper function to determine what to display for total count
  const getTotalDisplay = useCallback(() => {
    // If we're in initial load or reloading due to map drag, show "Searching..."
    if (isInitialLoad || isDraggingMap) {
      return "Searching accommodations...";
    }
    
    // If we have a total count from the API, use that
    if (totalAccommodationsInRadius > 0) {
      return `${totalAccommodationsInRadius} accommodations found`;
    }
    
    // Default case, no listings found
    return "No accommodations found";
  }, [isInitialLoad, isDraggingMap, totalAccommodationsInRadius]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      
      // Reset map view when switching to desktop
      if (newIsDesktop && showMap) {
        setShowMap(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMap, setShowMap]);
  
  // Handle search updates
  const handleSearch = useCallback((searchUrl, filters) => {
    // Reset URL processed flag when user performs a new search
    urlProcessedRef.current = false;
    
    // Update the URL without full page reload
    navigate(searchUrl);
    
    // Update search params with filters
    if (filters) {
      updateSearchParams(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          searchFilters: filters
        }
      }));
    }
  }, [navigate, updateSearchParams]);
  
  // Clear error on dismount
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);
  
  // Setup map drag event handlers
  useEffect(() => {
    const handleMapDragStart = () => {
      setMapDragging(true);
    };
    
    const handleMapDragEnd = () => {
      // Use a delay to ensure the new data is loaded
      setTimeout(() => {
        setMapDragging(false);
      }, 2000);
    };
    
    window.addEventListener('mapdragstart', handleMapDragStart);
    window.addEventListener('mapdragend', handleMapDragEnd);
    
    return () => {
      window.removeEventListener('mapdragstart', handleMapDragStart);
      window.removeEventListener('mapdragend', handleMapDragEnd);
    };
  }, [setMapDragging]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Enhanced Search Bar */}
      <div className="w-full mt-16 px-4 md:px-6 py-6 bg-white shadow-sm z-20 relative">
        <div className="max-w-4xl mx-auto">
          <EnhancedSearchBar
            initialLocation={searchParams.locationName || ""}
            initialDateRange={searchParams.filters.dateRange || { start: null, end: null }}
            initialGuests={{
              people: searchParams.filters.guestCount || 1,
              dogs: searchParams.filters.dogCount || 0
            }}
            onSearch={handleSearch}
          />
        </div>
      </div>
      
      {/* Mobile Map Toggle */}
      <MapToggle 
        showMap={showMap} 
        onToggle={(show) => setShowMap(show)} 
      />
      
      {/* Loading indicator for initial load */}
      {isInitialLoad && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm z-50 shadow-lg bg-brand">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Looking for accommodations...</span>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
        {/* List View */}
        <main
          className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:w-2/3 transition-opacity duration-300 ${
            showMap && !isDesktop ? "hidden" : ""
          } ${isInitialLoad ? "opacity-70" : "opacity-100"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                <span className="font-semibold">{getTotalDisplay()}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Within 500km radius 
              </p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <div className="flex-shrink-0 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-medium">Error: </span>
                {error}
              </div>
            </div>
          )}
          
          {/* Results List - Simple container */}
          <div className="p-1">
            <ImprovedVirtualizedListings listings={filteredListings} />
          </div>
        </main>
        
        {/* Map View */}
        <aside
          className={`${
            showMap && !isDesktop
              ? "fixed inset-0 z-40 bg-white"
              : isDesktop
              ? "lg:block lg:w-1/3 sticky top-20 right-0 h-[calc(100vh-80px)]"
              : "hidden"
          }`}
        >
          <div className="h-full">
            {/* Map Header for Mobile */}
            {showMap && !isDesktop && (
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Map View</h2>
                  <button
                    onClick={() => setShowMap(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Map Container */}
            <div className={`${showMap && !isDesktop ? 'h-[calc(100vh-80px)]' : 'h-full'} bg-gray-100 rounded-lg overflow-hidden`}>
              <OptimizedMapWithClustering listings={filteredListings} />
            </div>
          </div>
        </aside>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Lazy-loaded modals */}
      <Suspense fallback={null}>
        <MoreFiltersModal 
          isOpen={isMoreFiltersOpen}
          onClose={() => setIsMoreFiltersOpen(false)}
        />
      </Suspense>
    </div>
  );
};



/**
 * Main search results page component that wraps content with ListingProvider
 * This pattern allows context to be used within the component
 */
const SearchResults = () => {
  return (
    <SearchFiltersProvider>
      <ListingProvider>
        <SearchResultsContent />
      </ListingProvider>
    </SearchFiltersProvider>
  );
};

export default SearchResults;