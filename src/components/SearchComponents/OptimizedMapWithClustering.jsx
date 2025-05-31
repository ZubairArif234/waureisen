// src/components/SearchComponents/OptimizedMapWithClustering.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../../context/ListingContext';

/**
 * Optimized Map component with marker clustering and improved empty state
 */
const OptimizedMapWithClustering = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const centerMarkerRef = useRef(null);
  const clusterMarkersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const circleRef = useRef(null);
  const userInitiatedMoveRef = useRef(false);
  const previousCenterRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const googleMapsLoadedRef = useRef(false);
  const initialRenderRef = useRef(true);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  
  const { 
    listings, 
    listingsMap,
    loadedIds,
    mapViewport, 
    updateMapViewport,
    searchParams,
    activeListingId,
    isLoading,
    isInitialLoad,
    isDraggingMap,
    setMapDragging
  } = useListings();
  
  // Helper function to determine if a listing has valid coordinates
  const hasValidCoordinates = useCallback((listing) => {
    if (!listing || !listing.location || !listing.location.coordinates) {
      return false;
    }
    
    const [lng, lat] = listing.location.coordinates;
    return (
      !isNaN(lat) && !isNaN(lng) && 
      lat >= -90 && lat <= 90 && 
      lng >= -180 && lng <= 180
    );
  }, []);
  
  // Format date for URL parameters
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  // Get check-in date from search params if available
  const formattedStartDate = searchParams?.filters?.dateRange?.start 
    ? formatDate(searchParams.filters.dateRange.start) 
    : null;
  
  // Get map bounds safely
  const getBounds = useCallback((map) => {
    if (!map) return null;
    
    try {
      const bounds = map.getBounds();
      if (!bounds) return null;
      
      return {
        ne: {
          lat: bounds.getNorthEast().lat(),
          lng: bounds.getNorthEast().lng()
        },
        sw: {
          lat: bounds.getSouthWest().lat(),
          lng: bounds.getSouthWest().lng()
        }
      };
    } catch (error) {
      console.error("Error getting map bounds:", error);
      return null;
    }
  }, []);
  
  // Update marker visibility based on current map bounds
  const updateMarkersVisibility = useCallback(() => {
    if (!mapInstanceRef.current) return;
    
    try {
      const bounds = mapInstanceRef.current.getBounds();
      if (!bounds) return;
      
      // Update visibility for each marker
      Object.values(markersRef.current).forEach(marker => {
        if (marker && marker.getPosition) {
          const isVisible = bounds.contains(marker.getPosition());
          marker.setVisible(isVisible);
        }
      });
    } catch (error) {
      console.error('Error updating marker visibility:', error);
    }
  }, []);
  
  // Show info window for a marker
  const showInfoWindow = useCallback((marker) => {
    // Close any existing info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
    
    if (!marker || !marker.listingData || !mapInstanceRef.current) {
      return;
    }
    
    const listing = marker.listingData;
    const id = listing._id;
    
    // Create enhanced info window with more details and styling
    infoWindowRef.current.setContent(`
      <div style="max-width: 250px; font-family: Arial, sans-serif; padding: 5px;">
        <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #333;">${listing.title || 'Accommodation'}</h3>
        ${listing.images && listing.images.length > 0 ? 
          `<div style="width: 100%; height: 120px; background-image: url('${listing.images[0]}'); background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 8px;"></div>` : 
          ''}
        
        <div style="margin: 0; font-size: 12px; color: #666; display: flex; align-items: center;">
          <span>${listing.capacity ? `${listing.capacity.people} ${listing.capacity.people === 1 ? 'guest' : 'guests'}, ${listing.capacity.dogs || 0} ${listing.capacity.dogs === 1 ? 'dog' : 'dogs'}` : ''}</span>
        </div>
        ${listing.distanceInfo ? 
          `<div style="margin: 5px 0; font-size: 13px; color: #333;">${listing.distanceInfo.distanceText}</div>` : 
          ''}
        <div style="margin-top: 10px; display: flex; justify-content: center;">
          <button id="view-details-${id}" 
            style="background-color: #B4A481; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
            View Details
          </button>
        </div>
      </div>
    `);
    
    // Open the info window
    infoWindowRef.current.open(mapInstanceRef.current, marker);
    
    // Add event listener for the "View Details" button after the info window is opened
    window.google.maps.event.addListenerOnce(infoWindowRef.current, 'domready', () => {
      const viewDetailsButton = document.getElementById(`view-details-${id}`);
      if (viewDetailsButton) {
        viewDetailsButton.addEventListener('click', () => {
          // Navigate to the accommodation details page with price info
          navigate(`/accommodation/${id}`, {
            state: {
              pricePerNight: listing.pricePerNight || { price: 0, currency: "CHF" },
              checkInDate: formattedStartDate
            }
          });
        });
      }
    });
  }, [navigate, formattedStartDate]);
  
  // Create marker for a listing with error handling
  const createMarker = useCallback((listing) => {
    if (!mapInstanceRef.current || !window.google || !hasValidCoordinates(listing)) {
      return null;
    }
    
    try {
      const id = listing._id;
      const [longitude, latitude] = listing.location.coordinates;
      
      const position = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
      
      // Check for valid position
      if (isNaN(position.lat) || isNaN(position.lng)) {
        console.log(`Skipping marker for listing ${id} - NaN coordinates`);
        return null;
      }
      
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: listing.title || 'Accommodation',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#B4A481',
          fillOpacity: 0.7,
          strokeWeight: 1,
          strokeColor: '#ffffff'
        },
        listingId: id,
        animation: window.google.maps.Animation.DROP,
        optimized: true
      });
      
      // Store the listing data with the marker for info window
      marker.listingData = listing;
      
      // Add click event
      marker.addListener('click', () => {
        showInfoWindow(marker);
      });
      
      return marker;
    } catch (error) {
      console.error(`Error creating marker for listing ${listing._id}:`, error);
      return null;
    }
  }, [hasValidCoordinates, showInfoWindow]);
  
  // Create initial markers for existing listings
  const createInitialMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !listings || listings.length === 0) return;
    
    console.log(`Creating markers for ${listings.length} listings`);
    
    // Process listings in batches to avoid blocking the UI
    const processBatch = (startIndex, endIndex) => {
      for (let i = startIndex; i < endIndex && i < listings.length; i++) {
        const listing = listings[i];
        if (!markersRef.current[listing._id] && hasValidCoordinates(listing)) {
          const marker = createMarker(listing);
          if (marker) {
            markersRef.current[listing._id] = marker;
          }
        }
      }
      
      // Process next batch or update visibility when done
      if (endIndex < listings.length) {
        setTimeout(() => processBatch(endIndex, endIndex + 10), 10);
      } else {
        updateMarkersVisibility();
      }
    };
    
    // Start processing in batches of 10
    processBatch(0, 10);
  }, [listings, createMarker, hasValidCoordinates, updateMarkersVisibility]);
  
  // Initialize map with error handling
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error("Map initialization failed: DOM element or Google Maps not available");
      return;
    }
    
    try {
      // CRITICAL FIX: Always prioritize the search params coordinates
      // Make sure we use parseFloat for all coordinates
      const center = {
        lat: searchParams && searchParams.lat ? parseFloat(searchParams.lat) : 46.818188,
        lng: searchParams && searchParams.lng ? parseFloat(searchParams.lng) : 8.227512
      };
      
      console.log("Initializing map with center:", center);
      
      const zoom = mapViewport?.zoom || 6;
      
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy',
        disableDefaultUI: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      // Add center marker
      const centerMarker = new window.google.maps.Marker({
        position: center,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ffffff',
          fillOpacity: 0.7,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        },
        title: 'Selected Location',
        zIndex: 1000 // Higher z-index to keep center marker on top
      });
      
      // Store reference to center marker
      centerMarkerRef.current = centerMarker;
      
      // Add radius circle - default to 500km radius (500,000 meters)
      const searchRadiusInMeters = (searchParams?.radius || 500) * 1000; // Convert km to meters
      const circle = new window.google.maps.Circle({
        map: map,
        center: center,
        radius: searchRadiusInMeters,
        fillColor: '#B4A481',
        fillOpacity: 0.1,
        strokeColor: '#B4A481',
        strokeWeight: 1,
        strokeOpacity: 0.5
      });
      
      circleRef.current = circle;
      
      // Setup info window (shared between all markers)
      const infoWindow = new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;
      
      // Add map event listeners with safer event handling
      map.addListener('dragstart', () => {
        userInitiatedMoveRef.current = true;
        
        // Safely dispatch the drag start event
        try {
          // Use a custom event that's less likely to cause conflicts
          const dragStartEvent = new CustomEvent('mapdragstart', { bubbles: true });
          if (mapRef.current) {
            mapRef.current.dispatchEvent(dragStartEvent);
          } else {
            window.dispatchEvent(dragStartEvent);
          }
        } catch (error) {
          console.error("Error dispatching map drag start event:", error);
        }
        
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      });
      
      map.addListener('dragend', () => {
        if (userInitiatedMoveRef.current) {
          const mapCenter = map.getCenter();
          const newCenter = {
            lat: mapCenter.lat(),
            lng: mapCenter.lng()
          };
          
          // Update center marker position
          if (centerMarkerRef.current) {
            centerMarkerRef.current.setPosition(newCenter);
          }
          
          // Update circle center
          if (circleRef.current) {
            circleRef.current.setCenter(newCenter);
          }
          
          // Only trigger update if moved significantly (more than 0.01 degrees)
          if (
            !previousCenterRef.current ||
            Math.abs(previousCenterRef.current.lat - newCenter.lat) > 0.01 ||
            Math.abs(previousCenterRef.current.lng - newCenter.lng) > 0.01
          ) {
            console.log('Map moved, updating viewport', newCenter);
            updateMapViewport({
              center: newCenter,
              zoom: map.getZoom(),
              bounds: getBounds(map)
            });
            
            previousCenterRef.current = newCenter;
          }
          
          userInitiatedMoveRef.current = false;
          
          // Safely dispatch the drag end event after a short delay
          setTimeout(() => {
            try {
              // Use a custom event that's less likely to cause conflicts
              const dragEndEvent = new CustomEvent('mapdragend', { bubbles: true });
              if (mapRef.current) {
                mapRef.current.dispatchEvent(dragEndEvent);
              } else {
                window.dispatchEvent(dragEndEvent);
              }
            } catch (error) {
              console.error("Error dispatching map drag end event:", error);
            }
          }, 100);
        }
      });
      
      map.addListener('zoom_changed', () => {
        // Debounce zoom changes
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
          updateMapViewport({
            zoom: map.getZoom(),
            bounds: getBounds(map)
          });
          
          // Update markers visibility based on zoom level
          updateMarkersVisibility();
        }, 300);
      });
      
      mapInstanceRef.current = map;
      previousCenterRef.current = center;
      setIsLoaded(true);
      
      // Mark that we've initialized with search params
      initialRenderRef.current = false;
      
      // Special fix for search parameters - make sure they're properly set in the map
      if (searchParams && searchParams.lat && searchParams.lng) {
        // Ensure the map and all markers are using the search coordinates
        const searchCenter = {
          lat: parseFloat(searchParams.lat),
          lng: parseFloat(searchParams.lng)
        };
        
        console.log('Forcing map to use search coordinates:', searchCenter);
        
        // Directly set map center
        map.setCenter(searchCenter);
        
        // Update center marker
        if (centerMarkerRef.current) {
          centerMarkerRef.current.setPosition(searchCenter);
        }
        
        // Update circle center
        if (circleRef.current) {
          circleRef.current.setCenter(searchCenter);
          circleRef.current.setRadius((searchParams.radius || 500) * 1000);
        }
        
        // Update previous center
        previousCenterRef.current = searchCenter;
      }
      
      // Initial marker creation - for any existing listings
      if (listings && listings.length > 0) {
        console.log(`Creating initial markers for ${listings.length} listings`);
        createInitialMarkers();
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize Google Maps. Please refresh the page.");
    }
  }, [mapViewport, searchParams, updateMapViewport, getBounds, listings, createInitialMarkers, updateMarkersVisibility, hasValidCoordinates]);
  
  // Load Google Maps script safely
  const loadGoogleMapsScript = useCallback(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      googleMapsLoadedRef.current = true;
      initMap();
      return;
    }
    
    try {
      // Check if the script is already in the document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // If the script exists but Google Maps isn't loaded yet, wait for it
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps);
            googleMapsLoadedRef.current = true;
            initMap();
          }
        }, 100);
        
        // Set a timeout to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkGoogleMaps);
          if (!googleMapsLoadedRef.current) {
            setMapError("Google Maps failed to load. Please refresh the page.");
          }
        }, 10000);
        
        return;
      }
      
      // If no script exists, create and add it
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error("Google Maps API key is missing");
        setMapError("Google Maps API key is missing. Please check your configuration.");
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        googleMapsLoadedRef.current = true;
        initMap();
      };
      
      script.onerror = (error) => {
        console.error("Error loading Google Maps script:", error);
        setMapError("Failed to load Google Maps. Please check your internet connection and try again.");
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error in loadGoogleMapsScript:", error);
      setMapError("An error occurred while loading Google Maps.");
    }
  }, [initMap]);
  
  // Initialize Google Maps
  useEffect(() => {
    loadGoogleMapsScript();
    
    return () => {
      // Clean up markers on unmount
      try {
        Object.values(markersRef.current).forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = {};
        
        // Clear any pending timers
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      } catch (error) {
        console.error("Error cleaning up map resources:", error);
      }
    };
  }, [loadGoogleMapsScript]);
  
  // Update markers when listings change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.google) return;
    
    console.log(`Updating markers for ${listings.length} listings`);
    
    // Track existing IDs to avoid recreating markers
    const existingIds = Object.keys(markersRef.current);
    const listingIds = listings.map(l => l._id);
    
    // Process listings in batches
    const processBatch = (startIndex, endIndex) => {
      for (let i = startIndex; i < endIndex && i < listings.length; i++) {
        const listing = listings[i];
        if (!markersRef.current[listing._id] && hasValidCoordinates(listing)) {
          const marker = createMarker(listing);
          if (marker) {
            markersRef.current[listing._id] = marker;
          }
        }
      }
      
      // Process next batch or update visibility when done
      if (endIndex < listings.length) {
        setTimeout(() => processBatch(endIndex, endIndex + 5), 10);
      } else {
        // Remove markers for listings that are no longer in the list
        existingIds.forEach(id => {
          if (!listingIds.includes(id) && markersRef.current[id]) {
            markersRef.current[id].setMap(null);
            delete markersRef.current[id];
          }
        });
        
        updateMarkersVisibility();
      }
    };
    
    try {
      // Start processing in small batches
      processBatch(0, 5);
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [isLoaded, listings, hasValidCoordinates, createMarker, updateMarkersVisibility]);
  
  // Update map position when viewport changes
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !mapViewport) return;
    
    try {
      // Always make sure we have valid center coordinates
      if (!mapViewport.center || !mapViewport.center.lat || !mapViewport.center.lng) {
        console.warn("Invalid map viewport center, cannot update map");
        return;
      }
      
      // CRITICAL FIX: Only allow updates to map position when user initiated the move
      // This prevents automatic updates from overriding our search coordinates
      if (!userInitiatedMoveRef.current && initialRenderRef.current === false) {
        console.log('Ignoring automatic viewport change');
        return;
      }
      
      const { center, zoom } = mapViewport;
      
      console.log('Updating map position to', center);
      
      // Update map center
      mapInstanceRef.current.setCenter(center);
      
      // Update center marker
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setPosition(center);
      }
      
      // Update circle center
      if (circleRef.current) {
        circleRef.current.setCenter(center);
      }
      
      // Only set zoom if explicitly provided and different from current
      if (zoom !== undefined && mapInstanceRef.current.getZoom() !== zoom) {
        mapInstanceRef.current.setZoom(zoom);
      }
      
      previousCenterRef.current = center;
      
      // Update marker visibility after changing map position
      setTimeout(updateMarkersVisibility, 100);
    } catch (error) {
      console.error("Error updating map position:", error);
    }
  }, [isLoaded, mapViewport, updateMarkersVisibility]);
  
  // Highlight active listing on map
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !activeListingId) return;
    
    try {
      // Find the marker for the active listing
      const marker = markersRef.current[activeListingId];
      if (!marker) return;
      
      // Show info window for the active marker
      showInfoWindow(marker);
      
      // Pan to the marker
      mapInstanceRef.current.panTo(marker.getPosition());
    } catch (error) {
      console.error("Error highlighting active listing:", error);
    }
  }, [isLoaded, activeListingId, showInfoWindow]);
  
  // If there's a map error, show it
  if (mapError) {
    return (
      <div className="h-full relative">
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-red-800 font-medium mb-2">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Improved loading state during dragging */}
      {isDraggingMap && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
          <div className="text-center p-4">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-base font-medium text-gray-800">Looking for accommodations in this area...</p>
          </div>
        </div>
      )}
      
      {isLoaded && !isDraggingMap && !isInitialLoad && !isLoading && listings && listings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none">
          <div className="text-center p-4 bg-white bg-opacity-90 rounded-lg shadow-lg pointer-events-auto">
            <p className="text-base font-medium text-gray-200">No accommodations found within 500km</p>
            <p className="text-sm text-gray-600 mt-2">Try adjusting your search criteria or choosing a different location</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedMapWithClustering);