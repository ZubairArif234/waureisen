import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/HomeComponents/Navbar';
import SearchFilters from '../../components/SearchComponents/SearchFilters';
import AccommodationCard from '../../components/HomeComponents/AccommodationCard';
import MockMap from '../../components/SearchComponents/MockMap';
import MapToggle from '../../components/SearchComponents/MapToggle';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dateRange = searchParams.get('dates') || '12Mar - 16Mar';
  
  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const hasSearchParams = searchParams.get('location') || searchParams.get('dates');

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

  // Mock data - replicate 15 times
  const accommodations = Array(15).fill().map((_, index) => ({
    image: [i1, i2, i3][index % 3],
    price: 230.00,
    location: "Room in Rio de Janeiro, Brazil",
    provider: index % 3 === 2 ? "Interhome" : "Waureisen"
  }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <SearchFilters dateRange={dateRange} />
      
      <div className="relative">
        {/* Mobile Map Toggle */}
        {!hasSearchParams && (
          <MapToggle 
            showMap={showMap} 
            onToggle={(show) => setShowMap(show)} 
          />
        )}

        {/* Main Content */}
        <div className={`flex ${!hasSearchParams ? 'lg:max-w-none' : 'max-w-7xl mx-auto'}`}>
          {/* List View */}
          <main 
            className={`w-full px-4 sm:px-6 lg:px-8 py-8 ${
              !hasSearchParams && isDesktop ? 'lg:w-2/3' : 'w-full'
            } ${showMap && !isDesktop ? 'hidden' : ''}`}
          >
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
              !hasSearchParams ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
            } gap-6`}>
              {accommodations.map((accommodation, index) => (
                <AccommodationCard
                  key={index}
                  image={accommodation.image}
                  price={accommodation.price}
                  location={accommodation.location}
                  provider={accommodation.provider}
                />
              ))}
            </div>
          </main>

          {/* Map View */}
          {!hasSearchParams && (
            <aside 
              className={`${
                showMap && !isDesktop 
                  ? 'fixed inset-0 z-40' 
                  : isDesktop 
                    ? 'hidden lg:block lg:w-1/3' 
                    : 'hidden'
              }`}
            >
              <MockMap />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;