import React, { useState, useEffect } from 'react';
import AccommodationCard from './AccommodationCard';
import { useLanguage } from '../../utils/LanguageContext';
import API from '../../api/config';
import { getAllListings } from '../../api/listingAPI';
import { fetchInterhomePrices } from '../../api/interhomeAPI'; // Import the price fetching function

const RecommendationsSection = ({ title, listings }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings && listings.length > 0 ? (
          listings.map((listing) => (
            <AccommodationCard
              key={listing._id}
              id={listing._id}
              image={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
              price={listing.dynamicPrice || listing.pricePerNight?.price || 0}
              location={`${listing.listingType} in ${listing.location?.address || 'Unknown Location'}`}
              provider={listing.provider || 'Waureisen'}
              pricePerNight={listing.dynamicPrice ? { price: listing.dynamicPrice, currency: 'CHF' } : listing.pricePerNight}
            />
          ))
        ) : (
          <p>No listings available</p>
        )}
      </div>
    </div>
  );
};

const Recommendations = () => {
  const { t } = useLanguage();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await getAllListings();
        
        // Fetch prices for Interhome listings
        const listingsWithPrices = await Promise.all(
          data.map(async (listing) => {
            // Only fetch prices for Interhome listings
            if (listing.source?.name === 'interhome' && listing.Code) {
              try {
                // Get today's date in YYYY-MM-DD format
                const today = new Date();
                const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                
                // Fetch price for a 7-day stay starting today with 2 guests
                const priceData = await fetchInterhomePrices({
                  accommodationCode: listing.Code,
                  checkInDate: formattedDate,
                  pax: 2,
                  duration: 7,
                  los: true
                });
                
                // Add dynamic price to the listing if available
                if (priceData && priceData.price) {
                  return {
                    ...listing,
                    dynamicPrice: priceData.price
                  };
                }
              } catch (priceError) {
                console.warn(`Could not fetch price for ${listing.Code}: ${priceError.message}`);
              }
            }
            return listing;
          })
        );
        
        setAllListings(listingsWithPrices);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings for different sections
  const featuredListings = allListings.slice(0, 6);
  const newListings = allListings.slice(6, 12);
  const popularListings = allListings.slice(12, 18);

  if (loading) return <div className="text-center py-10">Loading recommendations...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <RecommendationsSection title={t('featured_accommodations')} listings={featuredListings} />
      <RecommendationsSection title={t('new_accommodations')} listings={newListings} />
      <RecommendationsSection title={t('popular_accommodations')} listings={popularListings} />
    </div>
  );
};

export default Recommendations;