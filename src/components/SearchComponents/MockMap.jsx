import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { loadGoogleMapsScript, createMap, addListingMarkers } from '../../utils/googleMapsUtils';

const MockMap = ({ 
  center, 
  listings = [], 
  locationName = '',
  onMapChange // New prop to handle viewport changes
}) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Track if the map is currently being loaded/initialized
  const isInitializingRef = useRef(true);

  // Default center is Switzerland if not provided
  const mapCenter = center || { lat: 46.818188, lng: 8.227512 };

  // Initialize Google Maps
  useEffect(() => {
    try {
      loadGoogleMapsScript((success) => {
        if (success) {
          setIsLoaded(true);
        } else {
          setLoadError("Failed to load Google Maps.");
        }
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setLoadError(error.message || "Error loading Google Maps.");
    }
  }, []);

  // Function to handle map viewport changes
  const handleMapChange = (map) => {
    if (!map || isInitializingRef.current) return;
    
    try {
      // Get the current bounds of the map
      const bounds = map.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      
      // Get the center position
      const center = map.getCenter();
      
      // Callback with bounds and center information
      onMapChange && onMapChange({
        bounds: {
          northeast: { lat: ne.lat(), lng: ne.lng() },
          southwest: { lat: sw.lat(), lng: sw.lng() }
        },
        center: { lat: center.lat(), lng: center.lng() },
        zoom: map.getZoom()
      });
    } catch (error) {
      console.error('Error in map change handler:', error);
    }
  };

  // Create map when script is loaded or center changes
  useEffect(() => {
    if (!isLoaded || loadError) return;

    try {
      isInitializingRef.current = true;
      
      // Check if the map container is available
      if (!mapRef.current) {
        console.error('Map container not available');
        setLoadError('Map container not available');
        return;
      }
      
      // Create the map
      const mapInstance = createMap(mapRef, mapCenter);
      
      if (!mapInstance) {
        console.error('Failed to create map instance');
        setLoadError('Failed to create map. Please try again later.');
        return;
      }
      
      googleMapRef.current = mapInstance;

      // Add event listeners for map movements
      const map = googleMapRef.current;
      if (map) {
        // Add event listeners for detecting map changes
        const mapChangeEvents = ['dragend', 'zoom_changed', 'idle'];
        
        const eventListeners = mapChangeEvents.map(eventName => {
          const listener = map.addListener(eventName, () => {
            // Only send events after initial loading
            if (eventName === 'idle' && isInitializingRef.current) {
              isInitializingRef.current = false;
              return;
            }
            
            handleMapChange(map);
          });
          return listener;
        });
        
        // If we have real listings, use those, otherwise use dummy listings
        if (listings.length > 0) {
          // Add markers for all listings
          markersRef.current = addListingMarkers(googleMapRef.current, listings);
        } else {
          // Create dummy listings with coordinates near the center for demonstration
          const dummyListings = Array(8).fill().map((_, i) => ({
            id: `dummy-${i}`,
            title: locationName ? `${locationName} Accommodation ${i + 1}` : `Accommodation ${i + 1}`,
            pricePerNight: { price: 200 + (i * 20), currency: 'CHF' },
            location: {
              coordinates: [
                mapCenter.lng + (Math.random() * 0.1 - 0.05), // lng - longitude is first in GeoJSON
                mapCenter.lat + (Math.random() * 0.1 - 0.05)  // lat - latitude is second in GeoJSON
              ]
            }
          }));
          
          // Add markers for dummy listings
          markersRef.current = addListingMarkers(googleMapRef.current, dummyListings);
        }

        // Clean up function
        return () => {
          // Remove event listeners
          if (window.google && window.google.maps) {
            eventListeners.forEach(listener => {
              try {
                window.google.maps.event.removeListener(listener);
              } catch (error) {
                console.error('Error removing map listener:', error);
              }
            });
          }
          
          // Clean up markers
          if (markersRef.current) {
            markersRef.current.forEach(marker => {
              try {
                marker.setMap(null);
              } catch (error) {
                console.error('Error removing marker:', error);
              }
            });
          }
        };
      }
    } catch (error) {
      console.error('Error setting up map:', error);
      setLoadError(error.message || 'Error setting up map');
    }
  }, [isLoaded, mapCenter]);

  // Update markers when listings change
  useEffect(() => {
    if (!isLoaded || loadError || !googleMapRef.current) return;
    
    try {
      const map = googleMapRef.current;
      if (!map) return;

      // Clear existing markers
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          try {
            marker.setMap(null);
          } catch (error) {
            console.error('Error removing marker:', error);
          }
        });
      }

      // Add new markers if listings exist
      if (listings && listings.length > 0) {
        markersRef.current = addListingMarkers(map, listings);
      }
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [listings, isLoaded, loadError]);

  // If there's an error loading the map or API key issues, show fallback
  if (loadError || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-[calc(100vh-70px)] w-full rounded-lg mt-0 bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Map temporarily unavailable</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            {loadError || "The map can't be displayed right now. You can still browse accommodations on the left."}
          </p>
          
          {/* List a few sample locations */}
          <div className="mt-6 text-left max-w-xs mx-auto">
            <h4 className="font-medium text-gray-700 mb-2">Popular destinations:</h4>
            <ul className="space-y-2">
              <li>
                <a href="/search?location=Zurich" className="text-brand hover:underline">
                  Zurich, Switzerland
                </a>
              </li>
              <li>
                <a href="/search?location=Lucerne" className="text-brand hover:underline">
                  Lucerne, Switzerland
                </a>
              </li>
              <li>
                <a href="/search?location=Zermatt" className="text-brand hover:underline">
                  Zermatt, Switzerland
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="h-[calc(100vh-70px)] w-full rounded-lg mt-0"
    />
  );
};

export default MockMap;