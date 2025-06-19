// src/context/ListingContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { getStreamedListings, getSingleListing, getListingsByIds } from '../api/listingAPI';
import { fetchInterhomePrices } from '../api/interhomeAPI';

// Initial state
const initialState = {
  // Listings data
  listings: [],
  listingsMap: {}, // Object mapping listing IDs to listing data for quick lookup
  loadingIds: [], // IDs of listings currently being loaded
  loadedIds: [], // IDs of listings that have been loaded
  isLoading: false,
  isInitialLoad: true,
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 12, // Number of items per page
  totalPages: 1,
  hasMore: true,
  
  // Errors
  error: null,
  
  // Search parameters
  searchParams: {
    lat: null,
    lng: null,
    radius: 150,
    locationName: '',
    filters: {
      dateRange: { start: null, end: null },
      amenities: [],
      guestCount: 1,
      dogCount: 0
    },
    priceRange: { min: 0, max: 10000 },
    searchFilters: {} // Add searchFilters to state
  },
  
  // Map state
  mapViewport: {
    center: { lat: 46.818188, lng: 8.227512 },
    zoom: 6,
    bounds: null
  },
  
  // UI state
  showMap: false,
  activeListingId: null,
  
  // Added states for map dragging and total count
  isDraggingMap: false,
  totalAccommodationsInRadius: 0
};

// Action types
const Actions = {
  FETCH_LISTINGS_START: 'FETCH_LISTINGS_START',
  FETCH_LISTINGS_SUCCESS: 'FETCH_LISTINGS_SUCCESS',
  FETCH_LISTINGS_ERROR: 'FETCH_LISTINGS_ERROR',
  
  FETCH_LISTING_START: 'FETCH_LISTING_START',
  FETCH_LISTING_SUCCESS: 'FETCH_LISTING_SUCCESS',
  FETCH_LISTING_ERROR: 'FETCH_LISTING_ERROR',
  
  UPDATE_SEARCH_PARAMS: 'UPDATE_SEARCH_PARAMS',
  UPDATE_MAP_VIEWPORT: 'UPDATE_MAP_VIEWPORT',
  
  SET_SHOW_MAP: 'SET_SHOW_MAP',
  SET_ACTIVE_LISTING: 'SET_ACTIVE_LISTING',
  
  RESET_LISTINGS: 'RESET_LISTINGS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  SET_MAP_DRAGGING: 'SET_MAP_DRAGGING',
  SET_TOTAL_ACCOMMODATIONS: 'SET_TOTAL_ACCOMMODATIONS',
  
  // New pagination action types
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_TOTAL_PAGES: 'SET_TOTAL_PAGES'
};

// Reducer function
function listingReducer(state, action) {
  switch (action.type) {
    case Actions.FETCH_LISTINGS_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
   case Actions.FETCH_LISTINGS_SUCCESS: {
  const newListings = action.payload.listings || [];
  const newListingsMap = { ...state.listingsMap };
  
  // With pagination, we replace the listings instead of appending
  if (action.payload.replace) {
    // Add new listings to the map
    newListings.forEach(listing => {
      if (listing && listing._id) {
        newListingsMap[listing._id] = listing;
      }
    });
        
        return {
      ...state,
      listings: newListings,
      listingsMap: newListingsMap,
      loadedIds: [...state.loadedIds, ...newListings.map(l => l._id).filter(id => !state.loadedIds.includes(id))],
      isLoading: false,
      isInitialLoad: false,
      hasMore: action.payload.hasMore,
      totalPages: action.payload.totalPages || state.totalPages
    };
  } else {
    // Legacy infinite scroll behavior - append listings
    // Add new listings to the map
    newListings.forEach(listing => {
      if (listing && listing._id) {
        newListingsMap[listing._id] = listing;
      }
    });
        
        return {
      ...state,
      listings: [...state.listings, ...newListings],
      listingsMap: newListingsMap,
      loadedIds: [...state.loadedIds, ...newListings.map(l => l._id)],
      isLoading: false,
      isInitialLoad: false,
      hasMore: action.payload.hasMore
    };
  }
}
    
    case Actions.FETCH_LISTINGS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isInitialLoad: false // Also set to false on error to prevent endless loading state
      };
      
    case Actions.FETCH_LISTING_START:
      return {
        ...state,
        loadingIds: [...state.loadingIds, action.payload]
      };
      
    case Actions.FETCH_LISTING_SUCCESS: {
      const listing = action.payload;
      if (!listing || !listing._id) {
        return state; // Guard against invalid listing objects
      }
      
      const newListingsMap = { ...state.listingsMap, [listing._id]: listing };
      
      // Check if this listing is already in the list
      const exists = state.listings.some(l => l._id === listing._id);
      
      return {
        ...state,
        listings: exists 
          ? state.listings.map(l => l._id === listing._id ? listing : l) 
          : [...state.listings, listing],
        listingsMap: newListingsMap,
        loadingIds: state.loadingIds.filter(id => id !== listing._id),
        loadedIds: [...state.loadedIds.filter(id => id !== listing._id), listing._id]
      };
    }
    
    case Actions.FETCH_LISTING_ERROR:
      return {
        ...state,
        loadingIds: state.loadingIds.filter(id => id !== action.payload.id),
        error: action.payload.error
      };
      
    case Actions.UPDATE_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          ...action.payload
        }
      };
      
    case Actions.UPDATE_MAP_VIEWPORT:
      return {
        ...state,
        mapViewport: {
          ...state.mapViewport,
          ...action.payload
        }
      };
      
    case Actions.SET_SHOW_MAP:
      return {
        ...state,
        showMap: action.payload
      };
      
    case Actions.SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: action.payload
      };
      
    case Actions.RESET_LISTINGS:
      return {
        ...state,
        listings: [],
        loadingIds: [],
        loadedIds: [],
        listingsMap: {},
        currentPage: 1,
        hasMore: true,
        isInitialLoad: true,
        error: null
      };
      
    case Actions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case Actions.SET_MAP_DRAGGING:
      return {
        ...state,
        isDraggingMap: action.payload
      };
      
    case Actions.SET_TOTAL_ACCOMMODATIONS:
  return {
    ...state,
    totalAccommodationsInRadius: action.payload,
    // Calculate total pages based on total accommodations
    totalPages: Math.ceil(action.payload / state.itemsPerPage) || 1
  };
    // New action handlers for pagination
    case Actions.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
      
    case Actions.SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.payload
      };
      
    default:
      return state;
  }
}

// Create context
const ListingContext = createContext();

// Provider component
export function ListingProvider({ children }) {
  const [state, dispatch] = useReducer(listingReducer, initialState);
  
  // FIXED: Properly manage user interaction tracking
  const userInitiatedMoveRef = useRef(false);
  const hasInitializedFromUserLocationRef = useRef(false);
  
  // Debouncing map viewport changes
  const [debouncedViewport, setDebouncedViewport] = useState(state.mapViewport);
  
  // Update search params
  const updateSearchParams = useCallback((params) => {
    dispatch({ type: Actions.UPDATE_SEARCH_PARAMS, payload: params });
  }, []);
  
  // FIXED: Enhanced map viewport update with proper user interaction tracking
  const updateMapViewport = useCallback((viewport, isUserInitiated = false) => {
    dispatch({ type: Actions.UPDATE_MAP_VIEWPORT, payload: viewport });
    
    // Track if this is a user-initiated move
    if (isUserInitiated) {
      userInitiatedMoveRef.current = true;
    }
    
    // Debounce viewport changes to avoid too many re-renders/API calls
    const timeoutId = setTimeout(() => {
      setDebouncedViewport(viewport);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // NEW: Method to set map center from user location without triggering search
  const setMapCenterFromUserLocation = useCallback((lat, lng, zoom = 6) => {
    const newViewport = {
      center: { lat, lng },
      zoom,
      bounds: null
    };
    
    // Update viewport without marking as user initiated
    dispatch({ type: Actions.UPDATE_MAP_VIEWPORT, payload: newViewport });
    setDebouncedViewport(newViewport);
    
    // Mark that we've initialized from user location
    hasInitializedFromUserLocationRef.current = true;
    
    // Don't set userInitiatedMoveRef to true here - wait for actual user interaction
  }, []);
  
  // Toggle map visibility
  const setShowMap = useCallback((show) => {
    dispatch({ type: Actions.SET_SHOW_MAP, payload: show });
  }, []);
  
  // Set active listing
  const setActiveListing = useCallback((id) => {
    dispatch({ type: Actions.SET_ACTIVE_LISTING, payload: id });
  }, []);
  
  // Reset listings (when search params change significantly)
  const resetListings = useCallback(() => {
    dispatch({ type: Actions.RESET_LISTINGS });
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: Actions.CLEAR_ERROR });
  }, []);
  
  // Set map dragging state
  const setMapDragging = useCallback((isDragging) => {
    dispatch({ type: Actions.SET_MAP_DRAGGING, payload: isDragging });
    
    // FIXED: When user starts dragging, mark it as user initiated
    if (isDragging) {
      userInitiatedMoveRef.current = true;
    }
  }, []);
  
  // Set total accommodations count
  const setTotalAccommodations = useCallback((count) => {
    dispatch({ type: Actions.SET_TOTAL_ACCOMMODATIONS, payload: count });
  }, []);
  
  // Set current page
  const setCurrentPage = useCallback((page) => {
    dispatch({ type: Actions.SET_CURRENT_PAGE, payload: page });
  }, []);
  
  // Helper function to process Interhome price data
  const processInterhomePricing = useCallback(async (listing, checkInDate) => {
    if (!listing) return null;
    
    if (listing.provider === 'Interhome' && listing.Code && checkInDate) {
      try {
        const priceData = await fetchInterhomePrices({
          accommodationCode: listing.Code,
          checkInDate,
          los: true,
        });
        
        // Process Interhome price data
        if (priceData?.priceList?.prices?.price?.length > 0) {
          const duration7Options = priceData.priceList.prices.price
            .filter(option => option.duration === 7)
            .sort((a, b) => a.paxUpTo - b.paxUpTo);
          
          if (duration7Options.length > 0) {
            const selectedOption = duration7Options[0];
            const calculatedPricePerNight = Math.round(selectedOption.price / 7);
            
            return {
              ...listing,
              interhomePriceData: priceData,
              pricePerNight: {
                price: calculatedPricePerNight,
                currency: priceData.priceList.currency || 'CHF',
                totalPrice: selectedOption.price,
                duration: 7,
                paxUpTo: selectedOption.paxUpTo,
              },
            };
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch Interhome prices for ${listing.Code}:`, error);
      }
    }
    return listing;
  }, []);
  
  // Format date for API calls
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  // Fetch listings for a specific page
  const fetchListingsPage = useCallback(async (page = 1) => {
    const { lat, lng, radius, filters, priceRange, searchFilters } = state.searchParams;
    
    // Skip if lat/lng not set
    if (!lat || !lng) return [];
    
    try {
      dispatch({ type: Actions.FETCH_LISTINGS_START });
      
      // Log the filters being sent
      console.log('Sending search filters to API:', searchFilters);
      
      // Pass filters to the backend
      const result = await getStreamedListings({
        limit: state.itemsPerPage,
        skip: (page - 1) * state.itemsPerPage,
        page: page,
        lat,
        lng,
        radius,
        filters: JSON.stringify(filters),
        priceMin: priceRange?.min,
        priceMax: priceRange?.max,
        searchFilters // Pass the search filters from state
      });
      
      // Update total accommodations count if available
      if (result.total !== undefined) {
        dispatch({ 
          type: Actions.SET_TOTAL_ACCOMMODATIONS, 
          payload: result.total 
        });
      }
      
      // Update total pages if available
      if (result.totalPages) {
        dispatch({
          type: Actions.SET_TOTAL_PAGES,
          payload: result.totalPages
        });
      }
      
      // Ensure we have valid listings
      if (!result.listings || !Array.isArray(result.listings)) {
        console.error('Invalid listings data received:', result);
        dispatch({ 
          type: Actions.FETCH_LISTINGS_ERROR, 
          payload: 'Invalid listings data received from server' 
        });
        return [];
      }
      
      // The backend should now handle Interhome price data,
      // but we'll check if there's any need for client-side processing
      const listings = result.listings;
      
      // Use first date from filters if available for price calculations
      const checkInDate = filters.dateRange?.start 
        ? formatDate(filters.dateRange.start) 
        : null;
      
      // Only run client-side processing if necessary 
      // (if any Interhome listings are missing price data)
      let processedListings = listings;
      const needPriceProcessing = checkInDate && listings.some(listing => 
        listing.provider === 'Interhome' && 
        listing.Code && 
        (!listing.interhomePriceData || !listing.pricePerNight)
      );
      
      if (needPriceProcessing) {
        console.log('Running client-side price processing for Interhome listings');
        processedListings = await Promise.all(
          listings.map(listing => processInterhomePricing(listing, checkInDate))
        );
      }
      
      // Filter out any null results
      const validListings = processedListings.filter(listing => listing !== null);
      
      dispatch({ 
        type: Actions.FETCH_LISTINGS_SUCCESS, 
        payload: {
          listings: validListings,
          hasMore: result.hasMore,
          totalPages: result.totalPages || Math.ceil(result.total / state.itemsPerPage) || 1,
          replace: true // Flag to replace listings instead of appending
        }
      });
      
      return validListings;
    } catch (error) {
      console.error(`Error fetching listings for page ${page}:`, error);
      dispatch({ 
        type: Actions.FETCH_LISTINGS_ERROR, 
        payload: error.message 
      });
      return [];
    }
  }, [
    state.searchParams,
    state.itemsPerPage,
    formatDate,
    processInterhomePricing,
    getStreamedListings,
    dispatch
  ]);
  
  // Fetch initial batch of listings
  const fetchInitialListings = useCallback(async () => {
    // Reset to page 1
    dispatch({ type: Actions.SET_CURRENT_PAGE, payload: 1 });
    
    // Use the new fetchListingsPage method
    return fetchListingsPage(1);
  }, [fetchListingsPage]);
  
  // Legacy fetch more listings (for infinite scroll, can be removed when pagination is fully implemented)
  const fetchMoreListings = useCallback(async () => {
    // Skip if already loading or no more listings or dragging the map
    if (state.isLoading || !state.hasMore || state.isDraggingMap) return [];
    
    const nextPage = state.currentPage + 1;
    setCurrentPage(nextPage);
    return fetchListingsPage(nextPage);
  }, [
    state.isLoading,
    state.hasMore,
    state.isDraggingMap,
    state.currentPage,
    setCurrentPage,
    fetchListingsPage
  ]);
  
  // Fetch a single listing by ID
  const fetchSingleListing = useCallback(async (id) => {
    // Skip if already loading or loaded
    if (!id || state.loadingIds.includes(id) || state.loadedIds.includes(id)) return null;
    
    try {
      dispatch({ type: Actions.FETCH_LISTING_START, payload: id });
      
      const listing = await getSingleListing(id);
      
      // Validate listing data
      if (!listing || !listing._id) {
        throw new Error(`Invalid listing data received for ID ${id}`);
      }
      
      // Use first date from filters if available for price calculations
      const checkInDate = state.searchParams.filters.dateRange?.start 
        ? formatDate(state.searchParams.filters.dateRange.start) 
        : null;
      
      // Process listing for Interhome price data if needed
      const processedListing = await processInterhomePricing(listing, checkInDate);
      
      if (!processedListing) {
        throw new Error(`Failed to process listing data for ID ${id}`);
      }
      
      dispatch({ 
        type: Actions.FETCH_LISTING_SUCCESS, 
        payload: processedListing 
      });
      
      return processedListing;
    } catch (error) {
      console.error(`Error fetching single listing ${id}:`, error);
      dispatch({ 
        type: Actions.FETCH_LISTING_ERROR, 
        payload: { id, error: error.message } 
      });
      
      return null;
    }
  }, [
    state.loadingIds, 
    state.loadedIds, 
    state.searchParams.filters, 
    formatDate, 
    processInterhomePricing
  ]);
  
  // Fetch multiple listings by IDs (batch)
  const fetchListingsBatch = useCallback(async (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
    
    // Filter out IDs that are already loading or loaded
    const idsToFetch = ids.filter(id => 
      !state.loadingIds.includes(id) && !state.loadedIds.includes(id)
    );
    
    if (idsToFetch.length === 0) return [];
    
    try {
      // Mark all listings as loading
      idsToFetch.forEach(id => {
        dispatch({ type: Actions.FETCH_LISTING_START, payload: id });
      });
      
      const listings = await getListingsByIds(idsToFetch);
      
      // Validate listings data
      if (!listings || !Array.isArray(listings)) {
        throw new Error('Invalid listings data received');
      }
      
      // Use first date from filters if available for price calculations
      const checkInDate = state.searchParams.filters.dateRange?.start 
        ? formatDate(state.searchParams.filters.dateRange.start) 
        : null;
      
      // Process listings for Interhome price data if needed
      const processedListings = await Promise.all(
        listings.map(listing => processInterhomePricing(listing, checkInDate))
      );
      
      // Filter out any null results and add each listing individually
      const validListings = processedListings.filter(listing => listing !== null);
      
      validListings.forEach(listing => {
        dispatch({ 
          type: Actions.FETCH_LISTING_SUCCESS, 
          payload: listing 
        });
      });
      
      // For any IDs that didn't result in valid listings, mark as error
      const successIds = validListings.map(l => l._id);
      const failedIds = idsToFetch.filter(id => !successIds.includes(id));
      
      failedIds.forEach(id => {
        dispatch({ 
          type: Actions.FETCH_LISTING_ERROR, 
          payload: { id, error: 'Listing not found' } 
        });
      });
      
      return validListings;
    } catch (error) {
      console.error('Error fetching batch listings:', error);
      
      // Mark all as error
      idsToFetch.forEach(id => {
        dispatch({ 
          type: Actions.FETCH_LISTING_ERROR, 
          payload: { id, error: error.message } 
        });
      });
      
      return [];
    }
  }, [
    state.loadingIds, 
    state.loadedIds, 
    state.searchParams.filters, 
    formatDate, 
    processInterhomePricing
  ]);
  
  // FIXED: Handle initial user location setting
  useEffect(() => {
    // When user provides lat/lng coordinates, update map center first
    if (state.searchParams.lat && state.searchParams.lng && !hasInitializedFromUserLocationRef.current) {
      console.log('Setting map center from user location:', state.searchParams.lat, state.searchParams.lng);
      setMapCenterFromUserLocation(state.searchParams.lat, state.searchParams.lng);
    }
  }, [state.searchParams.lat, state.searchParams.lng, setMapCenterFromUserLocation]);
  
  // Handle fetching when search params change
  useEffect(() => {
    if (state.searchParams.lat && state.searchParams.lng) {
      console.log('Search params changed, resetting and fetching listings');
      resetListings();
      
      // Use a small timeout to ensure the reset has completed in the state
      const timer = setTimeout(() => {
        fetchInitialListings();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [
    state.searchParams.lat, 
    state.searchParams.lng, 
    state.searchParams.radius,
    // Use JSON.stringify for objects to properly detect changes
    JSON.stringify(state.searchParams.filters),
    JSON.stringify(state.searchParams.priceRange),
    resetListings,
    fetchInitialListings
  ]);
  
// FIXED: Handle map viewport changes with proper user interaction tracking
useEffect(() => {
  // Skip if no coordinates or during initial loading
  if (
    !debouncedViewport.center ||
    !debouncedViewport.center.lat ||
    !debouncedViewport.center.lng ||
    !hasInitializedFromUserLocationRef.current
  ) return;
  
  // FIXED: Only update search params if this is a user-initiated move
  // AND the coordinates have actually changed significantly
  if (userInitiatedMoveRef.current) {
    const latDiff = Math.abs(state.searchParams.lat - debouncedViewport.center.lat);
    const lngDiff = Math.abs(state.searchParams.lng - debouncedViewport.center.lng);
    
    // Only update if moved more than ~100 meters (rough approximation)
    if (latDiff > 0.001 || lngDiff > 0.001) {
      console.log('User moved map, updating search params', debouncedViewport.center);
      updateSearchParams({
        lat: debouncedViewport.center.lat,
        lng: debouncedViewport.center.lng
      });
    }
  }
}, [debouncedViewport, state.searchParams.lat, state.searchParams.lng, updateSearchParams]);

  // Add listener for custom map drag events
  useEffect(() => {
    const handleMapDragStart = () => {
      setMapDragging(true);
    };
    
    const handleMapDragEnd = () => {
      // Use a delay to avoid flickering UI during state transitions
      setTimeout(() => {
        setMapDragging(false);
      }, 1500);
    };
    
    window.addEventListener('mapdragstart', handleMapDragStart);
    window.addEventListener('mapdragend', handleMapDragEnd);
    
    return () => {
      window.removeEventListener('mapdragstart', handleMapDragStart);
      window.removeEventListener('mapdragend', handleMapDragEnd);
    };
  }, [setMapDragging]);
  
  // Add a debug timer to check if listings are actually loading
  useEffect(() => {
    if (state.isInitialLoad && !state.isLoading && state.listings.length === 0) {
      // If we're in initial load state but not actively loading,
      // and don't have any listings yet, try to fix it after a delay
      const timer = setTimeout(() => {
        if (state.isInitialLoad && state.listings.length === 0) {
          console.log('Stuck in initial load state, trying to reset');
          dispatch({ 
            type: Actions.FETCH_LISTINGS_ERROR, 
            payload: 'Loading timed out' 
          });
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [state.isInitialLoad, state.isLoading, state.listings.length]);
  
  const contextValue = {
    ...state,
    updateSearchParams,
    updateMapViewport,
    setMapCenterFromUserLocation, // NEW: Expose this method
    setShowMap,
    setActiveListing,
    resetListings,
    clearError,
    fetchMoreListings,
    fetchSingleListing,
    fetchListingsBatch,
    fetchInitialListings,
    setMapDragging,
    setTotalAccommodations,
    // Add new pagination methods
    setCurrentPage,
    fetchListingsPage
  };
  
  return (
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  );
}

// Custom hook for using the context
export function useListings() {
  const context = useContext(ListingContext);
  
  if (!context) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  
  return context;
}