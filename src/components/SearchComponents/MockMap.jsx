import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript, createMap, addListingMarkers } from '../../utils/googleMapsUtils';

const MockMap = ({ center, listings = [], locationName = '' }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Default center is Switzerland if not provided
  const mapCenter = center || { lat: 46.818188, lng: 8.227512 };

  // Initialize Google Maps
  useEffect(() => {
    try {
      loadGoogleMapsScript(() => {
        setIsLoaded(true);
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      // Provide fallback UI if Maps doesn't load
    }
  }, []);

  // Create map when script is loaded or center changes
  useEffect(() => {
    if (!isLoaded) return;

    // Create the map
    googleMapRef.current = createMap(mapRef, mapCenter);

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

    // If we have real listings, use those, otherwise use dummy listings
    const displayListings = listings.length > 0 ? listings : dummyListings;

    // Add markers for all listings
    markersRef.current = addListingMarkers(googleMapRef.current, displayListings);

    return () => {
      // Clean up markers when component unmounts or dependencies change
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
      }
    };
  }, [isLoaded, mapCenter, listings]);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    // Fallback when no API key is provided
    return (
      <div className="relative h-[300px] mt-[305px] lg:mt-0 lg:h-[calc(100vh-120px)] w-full lg:sticky lg:top-24 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Map view is currently unavailable</p>
          <p className="text-sm text-gray-500">Please add your Google Maps API key to enable maps</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="relative h-[300px] mt-[305px] lg:mt-0 lg:h-[calc(100vh-120px)] w-full lg:sticky lg:top-24 rounded-lg"
    />
  );
};

export default MockMap;