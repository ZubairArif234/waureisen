import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import SearchFilters from "../../components/SearchComponents/SearchFilters";
import AccommodationCard from "../../components/HomeComponents/AccommodationCard";
import MockMap from "../../components/SearchComponents/MockMap";
import MapToggle from "../../components/SearchComponents/MapToggle";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { searchListings, fetchListingsByMapBounds } from "../../api/listingAPI";
import axios from "axios";
import { fetchInterhomePrices } from "../../api/interhomeAPI";
import {
  loadGoogleMapsScript,
  createMap,
  addListingMarkers,
  clearMarkers,
  addMapMoveListener,
} from "../../utils/googleMapsUtils";
import { usePriceFilter } from "../../context/PriceFilterContext";

// Import dummy images for now
import i1 from "../../assets/i1.png";
import i2 from "../../assets/i2.png";
import i3 from "../../assets/i3.png";

const SearchResults = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const { applyPriceFilter } = usePriceFilter();

  // Extract search parameters
  const locationParam = searchParams.get("location") || "";
  const dateRange = searchParams.get("dates") || "";
  
  // Fix the date formatting
  const [startDate] = dateRange.split(" - ");
  console.log(dateRange , startDate , "dates");

  const formatDate = (dateStr) => {
    if (!dateStr) return null;

    // Handle date format "May 03 2025"
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.log("Invalid date format");
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);

  console.log("Formatted date:", formattedStartDate);
  const people = searchParams.get("people") || 1;
  const dogs = searchParams.get("dogs") || 1;

  // Get latitude and longitude from URL if available
  const initialLat = parseFloat(searchParams.get("lat")) || 46.818188;
  const initialLng = parseFloat(searchParams.get("lng")) || 8.227512;
  
  // Fixed search radius of 500km
  const SEARCH_RADIUS = 500;

  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [areaName, setAreaName] = useState(locationParam || "this area");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Add new state for map-related data
  const [mapInstance, setMapInstance] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [mapMoveListener, setMapMoveListener] = useState(null);
  const mapRef = useRef(null);

  // State for tracking map viewport
  const [mapViewport, setMapViewport] = useState({
    center: { lat: initialLat, lng: initialLng },
    bounds: null,
    zoom: 12,
  });

  // Refs for state preservation between renders
  const listingsRef = useRef(listings);
  const areaNameRef = useRef(areaName);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Create styles for proper layout and spacing
  const pageContentStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingTop: "0",
  };

  // Keep refs in sync with state
  useEffect(() => {
    listingsRef.current = listings;
    areaNameRef.current = areaName;
  }, [listings, areaName]);

  // Function to get location name from coordinates using reverse geocoding
  const getLocationName = useCallback(
    async (lat, lng) => {
      try {
        // Skip geocoding if Google Maps isn't available yet
        if (
          !window.google ||
          !window.google.maps ||
          !window.google.maps.Geocoder
        ) {
          return locationParam || "this area";
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
        const locality = result.find((res) => res.types.includes("locality"));

        if (locality) {
          return locality.formatted_address;
        }

        // Try to find neighborhood
        const neighborhood = result.find((res) =>
          res.types.includes("neighborhood")
        );

        if (neighborhood) {
          return neighborhood.formatted_address;
        }

        // Try to find administrative area
        const adminArea = result.find(
          (res) =>
            res.types.includes("administrative_area_level_2") ||
            res.types.includes("administrative_area_level_1")
        );

        if (adminArea) {
          return adminArea.formatted_address;
        }

        // Fall back to the most specific result
        return result[0].formatted_address;
      } catch (error) {
        console.warn("Error reverse geocoding:", error);
        return locationParam || "this area";
      }
    },
    [locationParam]
  );

  // Initialize map
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstance) {
      loadGoogleMapsScript((success) => {
        if (success && window.google && window.google.maps) {
          // Create map centered on search location
          const map = createMap(mapRef, {
            lat: initialLat,
            lng: initialLng,
          });

          if (map) {
            setMapInstance(map);

            // Set a more appropriate zoom level
            map.setZoom(8);

            // Add markers for current listings
            if (listings.length > 0) {
              const markers = addListingMarkers(map, listings);
              setMapMarkers(markers);
            }
          }
        }
      });
    }
  }, [showMap, mapRef, listings, initialLat, initialLng, mapInstance]);

  // Create a function to fetch listings by map bounds
  const fetchListingsByMapBounds = async (params) => {
    try {
      const { lat, lng, radius, bounds, filters = {} } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        lat,
        lng,
        radius: radius || SEARCH_RADIUS, // Use fixed radius
        ...filters,
      });

      // Add bounds if available
      if (bounds) {
        queryParams.append("neLat", bounds.ne.lat);
        queryParams.append("neLng", bounds.ne.lng);
        queryParams.append("swLat", bounds.sw.lat);
        queryParams.append("swLng", bounds.sw.lng);
      }

      const response = await axios.get(
        `/api/listings/map?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching listings by map bounds:", error);
      throw error;
    }
  };

  // Fetch listings from API
  const fetchListings = useCallback(
    async (lat, lng, pageNum, append = false) => {
      setIsUpdating(true);
      try {
        // Get filters from URL
        const searchParams = new URLSearchParams(location.search);
        const filtersParam = searchParams.get('filters');
        const moreFiltersParam = searchParams.get('moreFilters');
        const selectedFilters = filtersParam ? JSON.parse(filtersParam) : null;
        const moreFilters = moreFiltersParam ? JSON.parse(moreFiltersParam) : null;

        const response = await searchListings({
          lat,
          lng,
          page: pageNum,
          pageSize: 10,
          filters: selectedFilters,
          moreFilters: moreFilters,
          radius: SEARCH_RADIUS // Always use fixed radius
        });

        // Process listings and fetch Interhome prices
        let processedListings = await Promise.all(
          (response?.listings || []).map(async (listing) => {
            if (listing.provider === "Interhome" && listing.Code) {
              try {
                const priceData = await fetchInterhomePrices({
                  accommodationCode: listing.Code,
                  checkInDate: formattedStartDate,
                  los: true,
                });

                // Calculate price per night from Interhome data
                let pricePerNight = listing.pricePerNight?.price || 0;
                if (
                  priceData &&
                  priceData.priceList &&
                  priceData.priceList.prices &&
                  priceData.priceList.prices.price &&
                  priceData.priceList.prices.price.length > 0
                ) {
                  // Filter for duration 7 options
                  const duration7Options = priceData.priceList.prices.price.filter(
                    (option) => option.duration === 7
                  );
                  if (duration7Options.length > 0) {
                    // Sort by paxUpTo (ascending)
                    duration7Options.sort((a, b) => a.paxUpTo - b.paxUpTo);
                    // Use the option with lowest paxUpTo
                    const selectedOption = duration7Options[0];
                    // Calculate price per night
                    const calculatedPricePerNight = Math.round(
                      selectedOption.price / 7
                    );
                    // Update the listing with calculated price per night
                    return {
                      ...listing,
                      interhomePriceData: priceData,
                      pricePerNight: {
                        price: calculatedPricePerNight,
                        currency: priceData.priceList.currency || "CHF",
                        totalPrice: selectedOption.price,
                        duration: 7,
                        paxUpTo: selectedOption.paxUpTo,
                      },
                    };
                  }
                }
                return {
                  ...listing,
                  interhomePriceData: priceData,
                };
              } catch (error) {
                console.warn(
                  `Failed to fetch Interhome prices for ${listing.Code}:`,
                  error
                );
                return listing;
              }
            }
            return listing;
          })
        );

        // Apply price filter using the context
        processedListings = applyPriceFilter(processedListings);

        if (append) {
          setListings((prev) => [...prev, ...processedListings]);
        } else {
          setListings(processedListings);
        }

        setHasMore(response?.hasMore || false);

        // Update area name based on coordinates
        const areaDisplayName = await getLocationName(lat, lng);
        if (areaDisplayName !== areaNameRef.current) {
          setAreaName(areaDisplayName);
        }

        return processedListings;
      } catch (error) {
        console.error("Error fetching listings:", error);
        if (!append) {
          setListings([]);
        }
        setHasMore(false);
        return [];
      } finally {
        setIsUpdating(false);
        setLoading(false);
      }
    },
    [getLocationName, formattedStartDate, location.search, applyPriceFilter]
  );

  // Transform listings for map display - FIX THIS FUNCTION
  const getMapReadyListings = useCallback((listingsData) => {
    if (
      !listingsData ||
      !Array.isArray(listingsData) ||
      listingsData.length === 0
    ) {
      console.log("No listings data available for map");
      return [];
    }

    console.log("Preparing map data for", listingsData.length, "listings");

    return listingsData
      .map((listing) => {
        // Check for position data in different formats
        let position = null;

        // Format 1: GeoJSON format with location.coordinates [lng, lat]
        if (
          listing.location &&
          listing.location.coordinates &&
          Array.isArray(listing.location.coordinates) &&
          listing.location.coordinates.length === 2
        ) {
          position = {
            lat: listing.location.coordinates[1],
            lng: listing.location.coordinates[0],
          };
        }
        // Format 2: Direct lat/lng properties
        else if (listing.lat !== undefined && listing.lng !== undefined) {
          position = {
            lat: parseFloat(listing.lat),
            lng: parseFloat(listing.lng),
          };
        }
        // Format 3: Position object
        else if (
          listing.position &&
          listing.position.lat !== undefined &&
          listing.position.lng !== undefined
        ) {
          position = listing.position;
        }

        if (!position) {
          console.warn(
            "Invalid location data for listing:",
            listing._id || listing.id
          );
          return null;
        }

        // Ensure we have valid coordinates
        if (isNaN(position.lat) || isNaN(position.lng)) {
          console.warn(
            "Invalid coordinates for listing:",
            listing._id || listing.id
          );
          return null;
        }

        // Create a properly formatted listing object for the map
        return {
          id: listing._id || listing.id,
          title: listing.title || "Accommodation",
          location: {
            coordinates: [position.lng, position.lat], // Format expected by MockMap
          },
          pricePerNight: listing.pricePerNight || { price: 0, currency: "CHF" },
          images: listing.images || [],
          capacity: listing.capacity || { people: 2, dogs: 1 },
          url: `/accommodations/${listing._id || listing.id}`,
        };
      })
      .filter(Boolean); // Remove any null entries
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMap]);

  // Fetch listings on initial load or when coordinates change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchListings(initialLat, initialLng, 1, false);

    // Update map viewport
    setMapViewport((prev) => ({
      ...prev,
      center: { lat: initialLat, lng: initialLng },
    }));
  }, [initialLat, initialLng, fetchListings]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isUpdating && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isUpdating, loading]);

  // Fetch more listings when page changes
  useEffect(() => {
    if (page > 1) {
      fetchListings(mapViewport.center.lat, mapViewport.center.lng, page, true);
    }
  }, [page, fetchListings, mapViewport.center]);

  // Handle map viewport changes - only update when user manually changes location
  const handleMapChange = useCallback(
    (newViewport) => {
      // Update viewport state
      setMapViewport((prev) => ({
        ...prev,
        ...newViewport,
      }));

      // Only update listings if center has changed significantly AND zoom hasn't changed
      // This prevents refreshing when just zooming in/out
      if (mapViewport.center && newViewport.center) {
        const oldCenter = mapViewport.center;
        const newCenter = newViewport.center;

        // Calculate distance between old and new center
        const distance = Math.sqrt(
          Math.pow(newCenter.lat - oldCenter.lat, 2) +
            Math.pow(newCenter.lng - oldCenter.lng, 2)
        );

        // Check if this is just a zoom change or a very small movement
        const isZoomChange = newViewport.zoom !== mapViewport.zoom;
        const isSmallMovement = distance < 0.05; // Increased threshold for movement

        // Only fetch new listings if:
        // 1. The map has been dragged significantly (not just zoomed)
        // 2. It's not a small movement caused by slight map adjustments
        if (!isZoomChange && !isSmallMovement && distance > 0.05) {
          console.log("Map moved significantly, fetching new listings");
          setPage(1);
          fetchListings(newCenter.lat, newCenter.lng, 1, false);
        }
      }
    },
    [mapViewport.center, mapViewport.zoom, fetchListings]
  );

  // Get the listings ready for the map component
  const mapReadyListings = getMapReadyListings(listings);

  // Create map view with loading indicator
  const mapView = (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
      {isMapMoving && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">
              Loading accommodations...
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={pageContentStyle}>
      <Navbar />
      <SearchFilters dateRange={dateRange} />

      <div className="relative flex-grow">
        {/* Mobile Map Toggle */}
        <MapToggle showMap={showMap} onToggle={(show) => setShowMap(show)} />

        {/* Main Content */}
        <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-170px)]">
          {/* List View */}
          <main
            className={`w-full px-4 sm:px-6 lg:px-8 py-8 lg:w-2/3 ${
              showMap && !isDesktop ? "hidden" : ""
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
                    {listings && listings.length ? listings.length : 0}{" "}
                    {t("accommodations_found")}
                    {areaName && (
                      <span className="font-normal text-gray-600 text-base ml-2">
                        in {areaName}
                      </span>
                    )}
                  </h2>
                </div>

                {/* Loading indicator when updating */}
                {isUpdating && (
                  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-brand text-white px-3 py-1 rounded-full text-sm z-50 opacity-80">
                    Updating listings...
                  </div>
                )}

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-opacity duration-300 ${
                    isUpdating ? "opacity-70" : "opacity-100"
                  }`}
                >
                  {listings && listings.length > 0
                    ? listings.map((accommodation) => (
                        <AccommodationCard
                          key={accommodation._id || accommodation.id}
                          id={accommodation._id || accommodation.id}
                          image={
                            accommodation.images &&
                            accommodation.images.length > 0
                              ? accommodation.images[0]
                              : null
                          }
                          price={accommodation.pricePerNight?.price || 0}
                          currency={
                            accommodation.pricePerNight?.currency || "CHF"
                          }
                          location={
                            accommodation.location?.address ||
                            "Unknown location"
                          }
                          provider={accommodation.provider || "Unknown"}
                          listingSource={
                            accommodation.listingSource ||
                            (accommodation.source &&
                              accommodation.source.name) ||
                            "Provider"
                          }
                          pricePerNight={accommodation.pricePerNight} // Pass the full pricePerNight object
                        />
                      ))
                    : null}
                </div>

                {/* Loading indicator for infinite scroll */}
                {hasMore && (
                  <div
                    ref={loadingRef}
                    className="flex justify-center items-center py-8"
                  >
                    {isUpdating && (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
                    )}
                  </div>
                )}

                {(!listings || listings.length === 0) && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      {t("no_accommodations_found")}
                    </p>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
                    >
                      {t("modify_search")}
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
                ? "fixed inset-0 z-40"
                : isDesktop
                ? "lg:block lg:w-1/3 sticky top-0 right-0 h-screen"
                : "hidden"
            }`}
          >
            <div className="h-full pt-0">
              {showMap ? (
                mapView
              ) : (
                <MockMap
                  center={mapViewport.center}
                  listings={mapReadyListings}
                  locationName={areaName}
                  onMapChange={handleMapChange}
                  radius={SEARCH_RADIUS}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;