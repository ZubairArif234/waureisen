import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import SearchFilters from '../../components/SearchComponents/SearchFilters';
import AccommodationCard from '../../components/HomeComponents/AccommodationCard';
import MockMap from '../../components/SearchComponents/MockMap';
import MapToggle from '../../components/SearchComponents/MapToggle';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';

// Import dummy images for now
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const SearchResults = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  
  // Extract search parameters
  const locationParam = searchParams.get('location') || '';
  const dateRange = searchParams.get('dates') || '12Mar - 16Mar';
  const people = searchParams.get('people') || 1;
  const dogs = searchParams.get('dogs') || 1;
  
  // Get latitude and longitude from URL if available
  const initialLat = parseFloat(searchParams.get('lat')) || null;
  const initialLng = parseFloat(searchParams.get('lng')) || null;
  
  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const hasSearchParams = locationParam || searchParams.get('dates');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [areaName, setAreaName] = useState(locationParam || 'this area');
  
  // State for tracking map viewport
  const [mapViewport, setMapViewport] = useState({
    center: initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
    bounds: null,
    zoom: 12
  });
  
  // Refs for state preservation between renders
  const listingsRef = useRef(listings);
  const areaNameRef = useRef(areaName);
  const initialLoadRef = useRef(true);
  const mapDidMoveRef = useRef(false);
  const lastViewportRef = useRef(null);
  const listingIdCacheRef = useRef(new Map());
  
  // Create styles for proper layout and spacing
  const pageContentStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '0'
  };
  
  // Keep refs in sync with state
  useEffect(() => {
    listingsRef.current = listings;
    areaNameRef.current = areaName;
  }, [listings, areaName]);

  // Function to get location name from coordinates using reverse geocoding
  const getLocationName = useCallback(async (lat, lng) => {
    try {
      // Skip geocoding if Google Maps isn't available yet
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        return locationParam || 'this area';
      }
      
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results.length > 0) {
            resolve(results);
          } else {
            reject(new Error(`Geocoder failed: ${status}`));
          }
        });
      });
      
      // Try to find locality first
      const locality = result.find(res => 
        res.types.includes('locality')
      );
      
      if (locality) {
        return locality.formatted_address;
      }
      
      // Try to find neighborhood
      const neighborhood = result.find(res => 
        res.types.includes('neighborhood')
      );
      
      if (neighborhood) {
        return neighborhood.formatted_address;
      }
      
      // Try to find administrative area
      const adminArea = result.find(res => 
        res.types.includes('administrative_area_level_2') || 
        res.types.includes('administrative_area_level_1')
      );
      
      if (adminArea) {
        return adminArea.formatted_address;
      }
      
      // Fall back to the most specific result
      return result[0].formatted_address;
    } catch (error) {
      console.warn('Error reverse geocoding:', error);
      return locationParam || 'this area';
    }
  }, [locationParam]);

  // Generate mock listings based on map viewport
  const generateMockListingsForViewport = useCallback(async (viewport) => {
    if (!viewport || !viewport.center) return [];
    
    const center = viewport.center;
    let spread = 0.03; // Default spread for listings
    
    // Adjust spread based on zoom level
    if (viewport.zoom) {
      // The higher the zoom, the smaller the spread
      spread = 0.1 / (viewport.zoom / 10);
    }
    
    try {
      // Get the current state values from refs to avoid dependency issues
      const currentListings = listingsRef.current;
      
      // Try to get a location name for the center
      let areaDisplayName = await getLocationName(center.lat, center.lng);
      
      // Update the area name state - but only if it actually changed
      if (areaDisplayName !== areaNameRef.current) {
        setAreaName(areaDisplayName);
      }
      
      // Get a set of existing IDs to maintain some consistency
      const existingIds = new Set(currentListings.map(listing => listing.id));
      
      // Generate random listings around the center
      return Array(10).fill().map((_, index) => {
        // Generate random coordinates
        const lng = center.lng + (Math.random() * spread - spread/2);
        const lat = center.lat + (Math.random() * spread - spread/2);
        
        // Try to reuse an existing ID for stability
        let id;
        if (existingIds.size > index && Math.random() > 0.3) {
          // Reuse an existing ID 70% of the time when available
          id = Array.from(existingIds)[index];
        } else {
          // Generate a stable ID based on coordinates
          const coordKey = `${lat.toFixed(4)}-${lng.toFixed(4)}`;
          if (listingIdCacheRef.current.has(coordKey)) {
            id = listingIdCacheRef.current.get(coordKey);
          } else {
            id = `acc-${index}-${Math.random().toString(36).substring(2, 9)}`;
            listingIdCacheRef.current.set(coordKey, id);
          }
        }
        
        // Create a formatted location string with the area name
        const displayLocation = `Accommodation in ${areaDisplayName}`;
        
        // Determine if this is a reused listing or new one
        const existingListing = currentListings.find(l => l.id === id);
        
        // If it's an existing listing, keep some properties the same
        const image = existingListing ? existingListing.image : [i1, i2, i3][index % 3];
        const provider = existingListing ? existingListing.provider : (index % 3 === 2 ? "Interhome" : "Waureisen");
        
        // Generate a somewhat stable price (changes less frequently)
        const basePrice = (lat * 100 + lng * 100) % 100; // Deterministic base on coordinates
        const price = 180 + Math.round(basePrice); // Range from 180-280
        
        return {
          id,
          image,
          price,
          location: displayLocation,
          provider,
          // The coordinates for mapping
          coordinates: {
            lat,
            lng
          }
        };
      });
    } catch (error) {
      console.error('Error generating listings:', error);
      
      // Fallback - generate simple listings without geocoding
      return Array(10).fill().map((_, index) => {
        const lng = center.lng + (Math.random() * spread - spread/2);
        const lat = center.lat + (Math.random() * spread - spread/2);
        
        return {
          id: `acc-fallback-${index}`,
          image: [i1, i2, i3][index % 3],
          price: 180 + Math.floor(Math.random() * 100),
          location: `Accommodation in ${locationParam || 'this area'}`,
          provider: index % 3 === 2 ? "Interhome" : "Waureisen",
          coordinates: { lat, lng }
        };
      });
    }
  }, [getLocationName, locationParam]);

  // Transform listings for map display
  const getMapReadyListings = useCallback((listingsData) => {
    if (!listingsData || !Array.isArray(listingsData)) return [];
    
    return listingsData.map(listing => {
      if (!listing) return null;
      
      return {
        ...listing,
        location: {
          // Ensure coordinates are in the format expected by the map
          coordinates: listing.coordinates ? 
            [listing.coordinates.lng, listing.coordinates.lat] : 
            [0, 0]
        }
      };
    }).filter(Boolean); // Remove any null items
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      // Reset map view when switching to desktop
      if (newIsDesktop && showMap) {
        setShowMap(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMap]);

  // Fetch listings on initial load
  useEffect(() => {
    const fetchInitialListings = async () => {
      setLoading(true);
      try {
        const mockListings = await generateMockListingsForViewport({
          center: initialLat && initialLng 
            ? { lat: initialLat, lng: initialLng }
            : { lat: 46.818188, lng: 8.227512 },
          zoom: 12
        });
        
        setListings(mockListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
        initialLoadRef.current = false;
      }
    };

    fetchInitialListings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array so this runs once

  // Handle map viewport changes
  const handleMapChange = useCallback((newViewport) => {
    // Skip if we're still in initial loading
    if (initialLoadRef.current) return;
    
    // Update viewport state
    setMapViewport(prev => ({
      ...prev,
      ...newViewport
    }));
    
    // Mark that the map has moved (enables the "Update listings" button)
    mapDidMoveRef.current = true;
    
    // Automatically update listings after map movement
    // This removes the need for the "Update listings" button
    const updateListingsForNewViewport = async () => {
      // Skip if still initializing
      if (initialLoadRef.current) return;
      
      // Calculate distance between centers to avoid unnecessary updates
      if (lastViewportRef.current && lastViewportRef.current.center) {
        const oldCenter = lastViewportRef.current.center;
        const newCenter = newViewport.center;
        
        const distance = Math.sqrt(
          Math.pow(newCenter.lat - oldCenter.lat, 2) +
          Math.pow(newCenter.lng - oldCenter.lng, 2)
        );
        
        // Only update if we've moved significantly (more than ~1km)
        if (distance < 0.01) return;
      }
      
      setIsUpdating(true);
      
      try {
        const newListings = await generateMockListingsForViewport(newViewport);
        setListings(newListings);
        mapDidMoveRef.current = false;
        lastViewportRef.current = { ...newViewport };
      } catch (error) {
        console.error('Error updating listings for new viewport:', error);
      } finally {
        setIsUpdating(false);
      }
    };
    
    // Use a small timeout to avoid excessive updates during continuous map movement
    setTimeout(updateListingsForNewViewport, 500);
  }, [generateMockListingsForViewport]);

  // Button handler to manually update listings
  const updateListings = async () => {
    if (!mapDidMoveRef.current) return;
    
    setIsUpdating(true);
    
    try {
      const newListings = await generateMockListingsForViewport(mapViewport);
      setListings(newListings);
      mapDidMoveRef.current = false;
      lastViewportRef.current = { ...mapViewport };
    } catch (error) {
      console.error('Error updating listings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get the listings ready for the map component
  const mapReadyListings = getMapReadyListings(listings);

  return (
    <div className="min-h-screen" style={pageContentStyle}>
      <Navbar />
      <SearchFilters dateRange={dateRange} />
      
      <div className="relative flex-grow">
        {/* Mobile Map Toggle */}
        <MapToggle 
          showMap={showMap} 
          onToggle={(show) => setShowMap(show)} 
        />

        {/* Main Content */}
        <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-170px)]">
          {/* List View */}
          <main 
            className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:w-2/3 ${
              showMap && !isDesktop ? 'hidden' : ''
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {listings.length} accommodations found
                    {areaName && (
                      <span className="font-normal text-gray-600 text-base ml-2">
                        in {areaName}
                      </span>
                    )}
                  </h2>
                  
                  {/* Show update button when map has moved */}
                  {mapDidMoveRef.current && (
                    <button
                      onClick={updateListings}
                      className="px-4 py-2 bg-brand text-white rounded-lg text-sm"
                    >
                      Update listings for this map area
                    </button>
                  )}
                </div>
                
                {/* Loading indicator when updating */}
                {isUpdating && (
                  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-brand text-white px-3 py-1 rounded-full text-sm z-50 opacity-80">
                    Updating listings...
                  </div>
                )}
                
                <div 
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-opacity duration-300 ${
                    isUpdating ? 'opacity-70' : 'opacity-100'
                  }`}
                >
                  {listings.map((accommodation) => (
                    <AccommodationCard
                      key={accommodation.id}
                      id={accommodation.id}
                      image={accommodation.image}
                      price={accommodation.price}
                      location={accommodation.location}
                      provider={accommodation.provider}
                    />
                  ))}
                </div>
                
                {listings.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">{t('no_accommodations_found')}</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
                    >
                      {t('modify_search')}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Map View */}
          <aside 
            className={`${
              showMap && !isDesktop 
                ? 'fixed inset-0 z-40' 
                : isDesktop 
                  ? 'lg:block lg:w-1/3 sticky top-0 right-0 h-screen' 
                  : 'hidden'
            }`}
          >
            <div className="h-full pt-0">
              <MockMap 
                center={mapViewport.center}
                listings={mapReadyListings}
                locationName={areaName}
                onMapChange={handleMapChange}
              />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;