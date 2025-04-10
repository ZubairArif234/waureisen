// src/utils/googleMapsUtils.js

// Load Google Maps API script
export const loadGoogleMapsScript = (callback) => {
    // Check if script is already loaded
    if (window.google && window.google.maps) {
      callback();
      return;
    }
  
    // Create script element
    const googleMapScript = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    // Execute callback when script loads
    googleMapScript.addEventListener('load', callback);
    
    // Add script to document
    document.body.appendChild(googleMapScript);
  };
  
  // Initialize Google Places Autocomplete
  export const initAutocomplete = (inputRef, callback) => {
    if (!inputRef.current || !window.google) return null;
  
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    });
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && callback) {
        callback(place);
      }
    });
  
    return autocomplete;
  };
  
  // Create a Google Map instance
  export const createMap = (mapRef, center = { lat: 46.818188, lng: 8.227512 }) => {
    if (!mapRef.current || !window.google) return null;
  
    // Create map with centered location
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12, // Better zoom level for city/location view
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
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
  
    // Add a marker at the center location to highlight the searched location
    if (center.lat !== 46.818188 || center.lng !== 8.227512) { // If not the default Switzerland center
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
        title: 'Searched Location'
      });
    }
  
    return map;
  };
  
  // Add markers to the map for listings
  export const addListingMarkers = (map, listings) => {
    if (!map || !listings || !window.google) return [];
  
    const markers = [];
    const bounds = new window.google.maps.LatLngBounds();
  
    listings.forEach((listing, index) => {
      // Handle case where listing doesn't have proper coordinates
      if (!listing.location?.coordinates || 
          !listing.location.coordinates[0] || 
          !listing.location.coordinates[1]) {
        return;
      }
      
      // Create marker
      const position = {
        lat: listing.location.coordinates[1], // MongoDB stores as [lng, lat]
        lng: listing.location.coordinates[0]
      };
      
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: listing.title,
        animation: window.google.maps.Animation.DROP,
      });
  
      // Extend bounds to include this marker
      bounds.extend(position);
      
      // Create info window for the marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="margin: 0; font-size: 16px;">${listing.title}</h3>
            <p style="margin: 5px 0;">${listing.pricePerNight?.price || 0} ${listing.pricePerNight?.currency || 'CHF'}</p>
          </div>
        `
      });
  
      // Add click listener to open info window
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
  
      markers.push(marker);
    });
  
    // Adjust map to show all markers
    if (markers.length > 0) {
      map.fitBounds(bounds);
    }
  
    return markers;
  };