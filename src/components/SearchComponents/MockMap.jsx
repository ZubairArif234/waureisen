import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const MockMap = ({ center, listings, locationName, onMapChange }) => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  // Add this ref to fix the error
  const mapChangeTimeoutRef = useRef(null);

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
        zoom: 12,
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
      new window.google.maps.Marker({
        position: center,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#B4A481',
          fillOpacity: 0.7,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        },
        title: locationName || 'Selected Location'
      });

      // Add listing markers
      if (listings && listings.length > 0) {
        addListingMarkers(map, listings);
      }

      // Add map move listener with better control
      // Only trigger when the map is done being dragged or zoomed
      map.addListener('dragend', () => {
        handleMapChange(map);
      });
      
      map.addListener('zoom_changed', () => {
        // Clear existing timeout
        if (mapChangeTimeoutRef.current) {
          clearTimeout(mapChangeTimeoutRef.current);
        }
        
        // Set a longer timeout for zoom to finish
        mapChangeTimeoutRef.current = setTimeout(() => {
          handleMapChange(map);
        }, 1000);
      });

      mapInstance.current = map;
      setIsLoaded(true);
    };

    // Add listing markers - FIX THIS FUNCTION
    const addListingMarkers = (map, listings) => {
      console.log('Adding markers for', listings?.length || 0, 'listings');
      
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
        // Debug the listing data
        console.log('Processing listing for marker:', listing);
        
        if (!listing.location || !listing.location.coordinates) {
          console.warn('Listing missing coordinates:', listing.id || 'unknown');
          return;
        }
    
        const position = {
          lat: listing.location.coordinates[1],
          lng: listing.location.coordinates[0]
        };
    
        // Verify position is valid
        if (isNaN(position.lat) || isNaN(position.lng)) {
          console.warn('Invalid coordinates:', position);
          return;
        }
    
        console.log('Creating marker at position:', position);
    
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
          }
        });
    
        // Add click event
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 5px; font-size: 16px;">${listing.title || 'Accommodation'}</h3>
                <p style="margin: 0 0 5px; font-size: 14px;">
                  ${listing.pricePerNight ? `${listing.pricePerNight.price} ${listing.pricePerNight.currency}/night` : ''}
                </p>
                <p style="margin: 0; font-size: 12px;">
                  ${listing.capacity ? `${listing.capacity.people} guests, ${listing.capacity.dogs} dogs` : ''}
                </p>
              </div>
            `
          });
          infoWindow.open(map, marker);
        });
    
        markersRef.current.push(marker);
      });
    };

    // Handle map change with improved debugging
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
          console.log('Map viewport changed:', {
            center: { lat: center.lat(), lng: center.lng() },
            zoom,
            bounds: {
              ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
              sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
            }
          });
          
          // Always trigger the callback when map movement ends
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
    };
  }, [center, listings, locationName, onMapChange]);

  // Update markers when listings change
  useEffect(() => {
    if (mapInstance.current && listings && listings.length > 0) {
      // Clear existing markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }

      // Add new markers
      listings.forEach(listing => {
        if (!listing.location || !listing.location.coordinates) return;

        const position = {
          lat: listing.location.coordinates[1],
          lng: listing.location.coordinates[0]
        };

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
          }
        });

        // Add click event
        marker.addListener('click', () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="max-width: 200px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 5px; font-size: 16px;">${listing.title || 'Accommodation'}</h3>
                <p style="margin: 0 0 5px; font-size: 14px;">
                  ${listing.pricePerNight ? `${listing.pricePerNight.price} ${listing.pricePerNight.currency}/night` : ''}
                </p>
                <p style="margin: 0; font-size: 12px;">
                  ${listing.capacity ? `${listing.capacity.people} guests, ${listing.capacity.dogs} dogs` : ''}
                </p>
              </div>
            `
          });
          infoWindow.open(mapInstance.current, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [listings]);

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