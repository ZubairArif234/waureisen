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
          console.error('Error waiting for Google Maps script:', error);
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
          // Google object is not available despite script loading
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
      zoom: 12, // Better zoom level for city/location view
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

    return map;
  } catch (error) {
    console.error('Error creating map:', error);
    return null;
  }
};

// Add markers to the map for listings
export const addListingMarkers = (map, listings) => {
  // Safety checks
  if (!map) {
    console.warn('Map instance not available for adding markers');
    return [];
  }
  
  if (!listings || !Array.isArray(listings) || listings.length === 0) {
    console.warn('No valid listings to add markers for');
    return [];
  }
  
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps API not available for creating markers');
    return [];
  }

  console.log('Attempting to add markers for', listings.length, 'listings');
  
  // Debug the first listing to see its structure
  if (listings.length > 0) {
    console.log('First listing structure:', JSON.stringify(listings[0], null, 2));
  }
  
  const markers = [];
  let bounds;
  
  try {
    bounds = new window.google.maps.LatLngBounds();
  } catch (error) {
    console.error('Error creating bounds:', error);
    return [];
  }
  
  // Create a single info window to reuse
  let sharedInfoWindow;
  try {
    sharedInfoWindow = new window.google.maps.InfoWindow();
  } catch (error) {
    console.error('Error creating info window:', error);
    return [];
  }

  try {
    // Process each listing
    listings.forEach((listing, index) => {
      // Check for position data in different possible formats
      let position = null;
      
      // Debug the listing structure
      console.log(`Listing ${index} structure:`, listing);
      
      // Check if the listing has a direct position property (as shown in your logs)
      if (listing.position && typeof listing.position === 'object' && 
          !isNaN(parseFloat(listing.position.lat)) && !isNaN(parseFloat(listing.position.lng))) {
        position = {
          lat: parseFloat(listing.position.lat),
          lng: parseFloat(listing.position.lng)
        };
      } 
      // Try other possible position formats
      else if (listing.location?.coordinates && Array.isArray(listing.location.coordinates)) {
        position = {
          lat: parseFloat(listing.location.coordinates[1]),
          lng: parseFloat(listing.location.coordinates[0])
        };
      } else if (listing.location?.lat !== undefined && listing.location?.lng !== undefined) {
        position = {
          lat: parseFloat(listing.location.lat),
          lng: parseFloat(listing.location.lng)
        };
      } else if (listing.latitude !== undefined && listing.longitude !== undefined) {
        position = {
          lat: parseFloat(listing.latitude),
          lng: parseFloat(listing.longitude)
        };
      } else if (listing.lat !== undefined && listing.lng !== undefined) {
        position = {
          lat: parseFloat(listing.lat),
          lng: parseFloat(listing.lng)
        };
      }
      
      // Skip if we couldn't find valid position
      if (!position) {
        console.warn('Skipping listing with missing position:', listing.id || index);
        return;
      }
      
      // Skip if position is invalid or out of bounds
      if (isNaN(position.lat) || isNaN(position.lng) ||
          position.lat < -90 || position.lat > 90 ||
          position.lng < -180 || position.lng > 180) {
        console.warn('Invalid position values for listing:', listing.id || index, position);
        return;
      }
      
      // Log successful position for debugging
      console.log('Creating marker at position:', position, 'for listing:', listing.id || index);
      
      // Get a title string
      const title = (listing.title && typeof listing.title === 'string')
        ? listing.title
        : (listing.name && typeof listing.name === 'string')
          ? listing.name
          : 'Accommodation';
      
      // Create the marker with a more visible icon
      const marker = new window.google.maps.Marker({
        position,
        map, // Make sure to pass the map instance
        title,
        // Use a more visible marker style
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12, // Increased size for better visibility
          fillColor: '#B4A481', // Brand color
          fillOpacity: 1.0,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      });
      
      // Only extend bounds with valid positions
      bounds.extend(position);
      
      // Get price information
      const price = listing.price || 
                    (listing.pricePerNight && listing.pricePerNight.price) || 
                    0;
      const currency = listing.currency || 
                       (listing.pricePerNight && listing.pricePerNight.currency) || 
                       'CHF';
      
      // Create info window content
      const content = `
        <div style="max-width: 200px; padding: 8px;">
          <h3 style="margin: 0; font-size: 16px; color: #4D484D;">${title}</h3>
          <p style="margin: 5px 0; font-size: 14px; color: #B4A481; font-weight: 500;">
            ${price} ${currency}
          </p>
        </div>
      `;

      // Add click listener to open info window
      marker.addListener('click', () => {
        try {
          // Set content and open the info window
          sharedInfoWindow.setContent(content);
          sharedInfoWindow.open({
            anchor: marker,
            map,
          });
          
          // Add bounce animation when clicked
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 750);
        } catch (error) {
          console.error('Error in marker click handler:', error);
        }
      });

      markers.push(marker);
    });

    // Fit the map to the bounds of all markers if there are any
    if (markers.length > 0 && !bounds.isEmpty()) {
      map.fitBounds(bounds);
      
      // If we only have one marker, zoom out a bit
      if (markers.length === 1) {
        const listener = window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          map.setZoom(Math.min(14, map.getZoom()));
        });
      }
    }

    console.log('Successfully added', markers.length, 'markers to the map');
    return markers;
  } catch (error) {
    console.error('Error adding markers:', error);
    return [];
  }
};