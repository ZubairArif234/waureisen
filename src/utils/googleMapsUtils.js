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
      // Skip listings without valid coordinates
      if (!listing || !listing.location || !listing.location.coordinates || 
          !Array.isArray(listing.location.coordinates) || 
          listing.location.coordinates.length < 2 ||
          isNaN(listing.location.coordinates[0]) || 
          isNaN(listing.location.coordinates[1])) {
        return;
      }
      
      try {
        // Create marker
        const position = {
          lat: parseFloat(listing.location.coordinates[1]), // MongoDB stores as [lng, lat]
          lng: parseFloat(listing.location.coordinates[0])
        };
        
        // Skip if position is invalid
        if (isNaN(position.lat) || isNaN(position.lng)) {
          return;
        }
        
        // Get a title string
        const title = (listing.title && typeof listing.title === 'string')
          ? listing.title
          : (typeof listing.location === 'string') 
            ? listing.location 
            : 'Accommodation';
        
        // Create the marker
        const marker = new window.google.maps.Marker({
          position,
          map,
          title,
          animation: window.google.maps.Animation.DROP,
          // Custom marker for better visibility
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#B4A481',
            fillOpacity: 0.9,
            strokeWeight: 1,
            strokeColor: '#ffffff'
          }
        });
        
        // Only extend bounds with valid positions
        if (position.lat >= -90 && position.lat <= 90 && 
            position.lng >= -180 && position.lng <= 180) {
          bounds.extend(position);
        }
        
        // Get price information
        const price = (listing.pricePerNight && listing.pricePerNight.price) || listing.price || 0;
        const currency = (listing.pricePerNight && listing.pricePerNight.currency) || 'CHF';
        
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
      } catch (error) {
        console.error('Error creating marker for listing:', error);
        // Continue with other markers
      }
    });

    // Don't adjust map bounds automatically - let the search page control this
    // This prevents the map from zooming/moving unexpectedly when listings change

    return markers;
  } catch (error) {
    console.error('Error adding markers:', error);
    return [];
  }
};