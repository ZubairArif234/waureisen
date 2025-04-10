import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import SearchFilters from '../../components/SearchComponents/SearchFilters';
import AccommodationCard from '../../components/HomeComponents/AccommodationCard';
import MockMap from '../../components/SearchComponents/MockMap'; // Import our new component
import MapToggle from '../../components/SearchComponents/MapToggle';
import Footer from '../../components/Shared/Footer';
import { searchListings } from '../../api/listingAPI'; // Import API function

// Import dummy images for now
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Extract search parameters
  const locationParam = searchParams.get('location') || '';
  const dateRange = searchParams.get('dates') || '12Mar - 16Mar';
  const people = searchParams.get('people') || 1;
  const dogs = searchParams.get('dogs') || 1;
  
  // Get latitude and longitude from URL if available
  const lat = parseFloat(searchParams.get('lat')) || null;
  const lng = parseFloat(searchParams.get('lng')) || null;
  
  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const hasSearchParams = locationParam || searchParams.get('dates');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch listings from API when search parameters change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // In a real scenario, we'd call the API with search parameters
        // For now, we'll skip actual API call since we don't have data
        // const data = await searchListings({
        //   location: locationParam,
        //   startDate: dateRange.split(' - ')[0],
        //   endDate: dateRange.split(' - ')[1],
        //   people,
        //   dogs
        // });
        // setListings(data);
        
        // Using dummy data for now
        setListings([]);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [locationParam, dateRange, people, dogs]);

  // Mock data for demonstration
  const dummyAccommodations = Array(15).fill().map((_, index) => ({
    id: `acc-${index}`,
    image: [i1, i2, i3][index % 3],
    price: 230.00 + (Math.floor(Math.random() * 5) * 10), // Add some price variation
    location: locationParam || "Accommodation in Switzerland",
    provider: index % 3 === 2 ? "Interhome" : "Waureisen"
  }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <SearchFilters dateRange={dateRange} />
      
      <div className="relative">
        {/* Mobile Map Toggle - Always show this on mobile */}
        <MapToggle 
          showMap={showMap} 
          onToggle={(show) => setShowMap(show)} 
        />

        {/* Main Content */}
        <div className="flex lg:max-w-none">
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
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                !hasSearchParams ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
              } gap-6`}>
                {dummyAccommodations.map((accommodation, index) => (
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
            )}
          </main>

          {/* Map View - Always show on desktop, conditionally on mobile */}
          <aside 
            className={`${
              showMap && !isDesktop 
                ? 'fixed inset-0 z-40' 
                : isDesktop 
                  ? 'hidden lg:block lg:w-1/3' 
                  : 'hidden'
            }`}
          >
            {/* Use our GoogleMap component */}
            <MockMap 
              center={lat && lng ? { lat, lng } : null}
              listings={[]} // We'll use dummy listings generated within the component
              locationName={locationParam} // Pass the location name for better display
            />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;