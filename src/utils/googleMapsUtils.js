// src/utils/googleMapsUtils.js

// Track if we've already started loading the script
let isLoadingScript = false;
let scriptLoadPromise = null;
let scriptLoadError = null;

// Load Google Maps API script
export const loadGoogleMapsScript = (callback) => {
  // Check if script is already loaded
  if (window.google && window.google.maps) {
    callback(true);
    return;
  }
  
  // If there was a previous error loading the script
  if (scriptLoadError) {
    callback(false);
    return;
  }
  
  // Check if we're already loading the script
  if (isLoadingScript) {
    // If we are, wait for the existing promise to resolve
    if (scriptLoadPromise) {
      scriptLoadPromise
        .then(() => callback(true))
        .catch((error) => {
          // console.error('Error waiting for Google Maps script:', error);
          callback(false);
        });
    }
    return;
  }
  
  // Check if the script tag already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
  if (existingScript) {
    // If it exists but Google isn't defined yet, wait for it to load
    const handleExistingScriptLoad = () => {
      if (window.google && window.google.maps) {
        callback(true);
      } else {
        // If Google still isn't defined, try again in a short while
        setTimeout(handleExistingScriptLoad, 100);
      }
    };
    
    handleExistingScriptLoad();
    return;
  }

  // Set flag to prevent duplicate loads
  isLoadingScript = true;
  
  try {
    // Create script element
    const googleMapScript = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    // Create a promise to track the loading
    scriptLoadPromise = new Promise((resolve, reject) => {
      googleMapScript.addEventListener('load', () => {
        isLoadingScript = false;
        
        // Check if Google Maps is actually available
        if (window.google && window.google.maps) {
          resolve();
          callback(true);
        } else {
          // Google object is not available despite script load
          const error = new Error('Google Maps not available after script load');
          scriptLoadError = error;
          reject(error);
          callback(false);
        }
      });
      
      // Also handle the error case
      googleMapScript.addEventListener('error', (error) => {
        isLoadingScript = false;
        scriptLoadError = error;
        console.error('Error loading Google Maps script:', error);
        reject(error);
        callback(false);
      });
    });
    
    // Add script to document
    document.body.appendChild(googleMapScript);
  } catch (error) {
    isLoadingScript = false;
    scriptLoadError = error;
    console.error('Error setting up Google Maps script:', error);
    callback(false);
  }
};

// Initialize Google Places Autocomplete
export const initAutocomplete = (inputRef, callback) => {
  // Check if the input ref exists and is initialized
  if (!inputRef || !inputRef.current) {
    console.warn('Input reference not available for autocomplete');
    return null;
  }
  
  // Check if Google Maps Places API is available
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.warn('Google Maps Places API not available for autocomplete');
    return null;
  }

  try {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      try {
        const place = autocomplete.getPlace();
        if (place && callback) {
          callback(place);
        }
      } catch (error) {
        console.error('Error handling place selection:', error);
      }
    });

    return autocomplete;
  } catch (error) {
    console.error('Error initializing autocomplete:', error);
    return null;
  }
};

// Create a Google Map instance
export const createMap = (mapRef, center = { lat: 46.818188, lng: 8.227512 }) => {
  // Safety checks for mapRef
  if (!mapRef || !mapRef.current) {
    console.warn('Map container reference not available');
    return null;
  }
  
  // Safety checks for Google Maps API
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not available');
    return null;
  }

  try {
    // Ensure the map element has size
    if (mapRef.current.clientWidth === 0 || mapRef.current.clientHeight === 0) {
      console.warn('Map container has zero size');
      // Don't return yet, still try to create the map
    }
    
    // Validate center coordinates
    const validCenter = {
      lat: center && !isNaN(center.lat) ? center.lat : 46.818188,
      lng: center && !isNaN(center.lng) ? center.lng : 8.227512
    };
    
    // Create map with centered location
    const map = new window.google.maps.Map(mapRef.current, {
      center: validCenter,
      zoom: 8, // Better zoom level for showing more accommodations
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'greedy', // Makes the map fully draggable on mobile without needing two fingers
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

    // Only add a marker if the center is not the default location
    if (validCenter.lat !== 46.818188 || validCenter.lng !== 8.227512) {
      try {
        new window.google.maps.Marker({
          position: validCenter,
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#B4A481',
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          },
          title: 'Searched Location'
        });
      } catch (error) {
        console.error('Error adding center marker:', error);
        // Continue without the marker
      }
    }

    // Add a fixed radius circle (500km by default)
    try {
      const circle = new window.google.maps.Circle({
        map: map,
        center: validCenter,
        radius: 500 * 1000, // 500km in meters
        fillColor: '#B4A481',
        fillOpacity: 0.1,
        strokeColor: '#B4A481',
        strokeWeight: 1,
        strokeOpacity: 0.5
      });
      
      // Fit map to circle bounds
      const bounds = circle.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error adding radius circle:', error);
    }

    return map;
  } catch (error) {
    console.error('Error creating map:', error);
    return null;
  }
};

// Add event listener for map movement to dynamically load accommodations
export const addMapMoveListener = (map, callback, debounceTime = 500) => {
  if (!map || typeof callback !== 'function') {
    console.warn('Invalid map or callback for map move listener');
    return null;
  }

  let timeoutId = null;
  let userInitiatedMove = false;
  
  // Track when user initiates map movement
  map.addListener('dragstart', () => {
    userInitiatedMove = true;
  });
  
  // Create the event listener with debounce
  const listener = map.addListener('idle', () => {
    // Only proceed if this was a user-initiated move
    if (!userInitiatedMove) return;
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Set a new timeout to debounce the callback
    timeoutId = setTimeout(() => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      
      if (center && bounds) {
        const lat = center.lat();
        const lng = center.lng();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        // Pass the map data to the callback
        callback({
          map,
          center: { lat, lng },
          radius: 500, // Fixed 500km radius
          bounds: {
            ne: { lat: ne.lat(), lng: ne.lng() },
            sw: { lat: sw.lat(), lng: sw.lng() }
          },
          zoom: map.getZoom()
        });
      }
      
      // Reset the user initiated flag
      userInitiatedMove = false;
    }, debounceTime);
  });
  
  return listener;
};

// Helper function to calculate distance between two points using Haversine formula
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Add markers for listings to the map
export const addListingMarkers = (map, listings) => {
  if (!map || !listings || !Array.isArray(listings) || !window.google) {
    console.warn('Invalid map, listings, or Google Maps not loaded');
    return [];
  }

  const markers = [];
  
  try {
    listings.forEach(listing => {
      // Skip if no valid coordinates
      if (!listing.location || 
          !listing.location.coordinates || 
          !Array.isArray(listing.location.coordinates) || 
          listing.location.coordinates.length !== 2) {
        console.warn('Listing missing valid coordinates:', listing.title || 'Unknown');
        return;
      }
      
      // GeoJSON uses [lng, lat] order, so we need to reverse for Google Maps
      const position = {
        lat: listing.location.coordinates[1],
        lng: listing.location.coordinates[0]
      };
      
      // Create marker
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
      
      // Add click event to marker
      marker.addListener('click', () => {
        // Create info window content
        const contentString = `
          <div style="max-width: 200px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 5px; font-size: 16px;">${listing.title || 'Accommodation'}</h3>
            <p style="margin: 0 0 5px; font-size: 14px;">
              ${listing.pricePerNight ? `${listing.pricePerNight.price} ${listing.pricePerNight.currency}/night` : ''}
            </p>
            <p style="margin: 0; font-size: 12px;">
              ${listing.capacity ? `${listing.capacity.people} guests, ${listing.capacity.dogs} dogs` : ''}
            </p>
          </div>
        `;
        
        // Create and open info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: contentString
        });
        
        infoWindow.open(map, marker);
      });
      
      markers.push(marker);
    });
    
    return markers;
  } catch (error) {
    console.error('Error adding listing markers:', error);
    return [];
  }
};

// Clear all markers from the map
export const clearMarkers = (markers) => {
  if (!markers || !Array.isArray(markers)) {
    return;
  }
  
  markers.forEach(marker => {
    if (marker && typeof marker.setMap === 'function') {
      marker.setMap(null);
    }
  });
};