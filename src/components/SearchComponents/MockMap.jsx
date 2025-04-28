import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MockMap = ({ center, listings, locationName, onMapChange, radius = 5500 }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const mapChangeTimeoutRef = useRef(null);
  const activeInfoWindowRef = useRef(null);
  const userInitiatedMoveRef = useRef(false);
  
  // Get check-in date from URL params
  const searchParams = new URLSearchParams(location.search);
  const checkInDate = searchParams.get("dates")?.split(" - ")[0] || "";
  
  // Format date function - same as in AccommodationCard
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(checkInDate);

  // Initialize map
  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    // Initialize map
    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 8, // More appropriate zoom level
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
        title: locationName || 'Selected Location',
        zIndex: 1000 // Higher z-index to keep center marker on top
      });

      // Add radius circle - fixed 500km
      const searchRadiusInMeters = radius * 1000; // Convert km to meters
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

      // Add listing markers
      if (listings && listings.length > 0) {
        addListingMarkers(map, listings);
      }

      // Add map move listeners - only trigger on manual user interaction
      map.addListener('dragstart', () => {
        userInitiatedMoveRef.current = true;
      });
      
      map.addListener('dragend', () => {
        if (userInitiatedMoveRef.current) {
          handleMapChange(map);
          userInitiatedMoveRef.current = false;
        }
      });

      mapInstance.current = map;
      setIsLoaded(true);
    };

    // Add listing markers
    const addListingMarkers = (map, listings) => {
      // Clear existing markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    
      // If no listings or invalid data, return early
      if (!listings || !Array.isArray(listings) || listings.length === 0) {
        console.warn('No valid listings to add markers for');
        return;
      }
    
      // Add new markers
      listings.forEach(listing => {
        if (!listing.location || !listing.location.coordinates) {
          return;
        }
    
        const position = {
          lat: listing.location.coordinates[1],
          lng: listing.location.coordinates[0]
        };
    
        // Verify position is valid
        if (isNaN(position.lat) || isNaN(position.lng)) {
          return;
        }
        
        // Ensure we have a valid ID for navigation
        const listingId = listing._id || listing.id;
    
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: listing.title || 'Accommodation',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#B4A481',
            fillOpacity: 0.7,
            strokeWeight: 1,
            strokeColor: '#ffffff'
          },
          listingId: listingId // Store the ID directly for easier access
        });
    
        // Add click event
        marker.addListener('click', () => {
          // Close any existing info window
          if (activeInfoWindowRef.current) {
            activeInfoWindowRef.current.close();
          }
          
          // Create enhanced info window with more details and styling
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; font-family: Arial, sans-serif; padding: 5px;">
                <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #333;">${listing.title || 'Accommodation'}</h3>
                ${listing.images && listing.images.length > 0 ? 
                  `<div style="width: 100%; height: 120px; background-image: url('${listing.images[0]}'); background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 8px;"></div>` : 
                  ''}
                <p style="margin: 0 0 5px; font-size: 16px; font-weight: 500; color: #B4A481;">
                  ${listing.pricePerNight ? `${listing.pricePerNight.price} ${listing.pricePerNight.currency}/night` : ''}
                </p>
                <div style="margin: 0; font-size: 12px; color: #666; display: flex; align-items: center;">
                  <span>${listing.capacity ? `${listing.capacity.people} ${listing.capacity.people === 1 ? 'guest' : 'guests'}, ${listing.capacity.dogs} ${listing.capacity.dogs === 1 ? 'dog' : 'dogs'}` : ''}</span>
                </div>
                <div style="margin-top: 10px; display: flex; justify-content: center;">
                  <button id="view-details-${listingId}" 
                    style="background-color: #B4A481; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
                    View Details
                  </button>
                </div>
              </div>
            `
          });
          
          // Store the active info window for later reference
          activeInfoWindowRef.current = infoWindow;
          
          // Open the info window
          infoWindow.open(map, marker);
          
          // Add event listener for the "View Details" button after the info window is opened
          window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            const viewDetailsButton = document.getElementById(`view-details-${listingId}`);
            if (viewDetailsButton) {
              viewDetailsButton.addEventListener('click', () => {
                // Navigate to the accommodation details page with price info
                navigate(`/accommodation/${listingId}`, {
                  state: {
                    pricePerNight: listing.pricePerNight || { price: 0, currency: "CHF" },
                    checkInDate: formattedStartDate
                  }
                });
              });
            }
          });
        });
    
        markersRef.current.push(marker);
      });
    };

    // Handle map change - only triggered on manual user interaction
    const handleMapChange = (map) => {
      if (!map || !onMapChange) return;
  
      // Clear existing timeout
      if (mapChangeTimeoutRef.current) {
        clearTimeout(mapChangeTimeoutRef.current);
      }
  
      // Set new timeout with moderate debounce time
      mapChangeTimeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const zoom = map.getZoom();
  
        if (center && bounds) {
          // Update the radius circle on the map without changing its size
          if (circleRef.current) {
            circleRef.current.setCenter({
              lat: center.lat(),
              lng: center.lng()
            });
            // Keep the radius fixed at the specified value
            circleRef.current.setRadius(radius * 1000); // Convert km to meters
          }
          
          // Always trigger the callback when map movement ends with manual user interaction
          onMapChange({
            center: { lat: center.lat(), lng: center.lng() },
            bounds: {
              ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
              sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
            },
            zoom
          });
        }
      }, 600); // Moderate debounce time
    };

    loadGoogleMapsScript();

    // Cleanup
    return () => {
      if (mapChangeTimeoutRef.current) {
        clearTimeout(mapChangeTimeoutRef.current);
      }
      
      // Close any open info windows
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
      }
      
      // Clear markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
    };
  }, [center, listings, locationName, onMapChange, navigate, radius, formattedStartDate]);

  // Update markers when listings change
  useEffect(() => {
    if (mapInstance.current && listings && listings.length > 0) {
      // Close any open info windows
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
        activeInfoWindowRef.current = null;
      }
      
      // Clear existing markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }

      // Add new markers
      listings.forEach(listing => {
        if (!listing.location || !listing.location.coordinates) return;

        const position = {
          lat: listing.location.coordinates[1],
          lng: listing.location.coordinates[0]
        };
        
        // Ensure we have a valid ID for navigation
        const listingId = listing._id || listing.id;

        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance.current,
          title: listing.title || 'Accommodation',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#B4A481',
            fillOpacity: 0.7,
            strokeWeight: 1,
            strokeColor: '#ffffff'
          },
          listingId: listingId // Store the ID directly for easier access
        });

        // Add click event
        marker.addListener('click', () => {
          // Close any existing info window
          if (activeInfoWindowRef.current) {
            activeInfoWindowRef.current.close();
          }
          
          // Create enhanced info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; font-family: Arial, sans-serif; padding: 5px;">
                <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #333;">${listing.title || 'Accommodation'}</h3>
                ${listing.images && listing.images.length > 0 ? 
                  `<div style="width: 100%; height: 120px; background-image: url('${listing.images[0]}'); background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 8px;"></div>` : 
                  ''}
                <p style="margin: 0 0 5px; font-size: 16px; font-weight: 500; color: #B4A481;">
                  ${listing.pricePerNight ? `${listing.pricePerNight.price} ${listing.pricePerNight.currency}/night` : ''}
                </p>
                <div style="margin: 0; font-size: 12px; color: #666; display: flex; align-items: center;">
                  <span>${listing.capacity ? `${listing.capacity.people} ${listing.capacity.people === 1 ? 'guest' : 'guests'}, ${listing.capacity.dogs} ${listing.capacity.dogs === 1 ? 'dog' : 'dogs'}` : ''}</span>
                </div>
                <div style="margin-top: 10px; display: flex; justify-content: center;">
                  <button id="view-details-${listingId}" 
                    style="background-color: #B4A481; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
                    View Details
                  </button>
                </div>
              </div>
            `
          });
          
          // Store the active info window
          activeInfoWindowRef.current = infoWindow;
          
          // Open the info window
          infoWindow.open(mapInstance.current, marker);
          
          // Add event listener for the view details button
          window.google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            const viewDetailsButton = document.getElementById(`view-details-${listingId}`);
            if (viewDetailsButton) {
              viewDetailsButton.addEventListener('click', () => {
                // Navigate to the accommodation details page with price info
                navigate(`/accommodation/${listingId}`, {
                  state: {
                    pricePerNight: listing.pricePerNight || { price: 0, currency: "CHF" },
                    checkInDate: formattedStartDate
                  }
                });
              });
            }
          });
        });

        markersRef.current.push(marker);
      });
    }
  }, [listings, navigate, formattedStartDate]);

  // Update the circle radius when radius prop changes
  useEffect(() => {
    if (circleRef.current && radius) {
      circleRef.current.setRadius(radius * 1000); // Convert km to meters
    }
  }, [radius]);

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-600">{t('Loading map...')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockMap;