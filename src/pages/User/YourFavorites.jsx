import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import MockMap from '../../components/SearchComponents/MockMap';
import MapToggle from '../../components/SearchComponents/MapToggle';
import AccommodationCard from '../../components/HomeComponents/AccommodationCard';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';

const YourFavorites = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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

  // Mock favorited listings data
  const favoritedListings = [
    {
      id: '1',
      image: i1,
      price: 230.00,
      location: "Room in Rio de Janeiro, Brazil",
      provider: "Waureisen",
      isFavorited: true
    },
    {
      id: '2',
      image: i2,
      price: 180.00,
      location: "Villa in Bali, Indonesia",
      provider: "Waureisen",
      isFavorited: true
    },
    {
      id: '3',
      image: s1,
      price: 150.00,
      location: "Apartment in Paris, France",
      provider: "Interhome",
      isFavorited: true
    },
    {
      id: '4',
      image: s2,
      price: 320.00,
      location: "Chalet in Swiss Alps",
      provider: "Waureisen",
      isFavorited: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="relative">
        {/* Mobile Map Toggle */}
        <MapToggle 
          showMap={showMap} 
          onToggle={(show) => setShowMap(show)} 
        />

        <div className="flex">
          {/* Main Content */}
          <main 
            className={`w-full px-4 sm:px-6 lg:px-8 py-12 mt-20 ${
              isDesktop ? 'lg:w-2/3' : 'w-full'
            } ${showMap && !isDesktop ? 'hidden' : ''}`}
          >
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate('/wishlist')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">Your Favorites</h1>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {favoritedListings.map((listing) => (
                <AccommodationCard
                  key={listing.id}
                  id={listing.id}
                  image={listing.image}
                  price={listing.price}
                  location={listing.location}
                  provider={listing.provider}
                  isFavorited={listing.isFavorited}
                />
              ))}
            </div>
          </main>

          {/* Map View */}
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default YourFavorites;