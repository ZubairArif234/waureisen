import React, { useState, useEffect } from 'react';
import AccommodationCard from './AccommodationCard';
import { useLanguage } from '../../utils/LanguageContext';
import API from '../../api/config';
import { getAllListings } from '../../api/listingAPI';

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
              price={listing.pricePerNight?.price || 0}
              location={`${listing.listingType} in ${listing.location?.address || 'Unknown Location'}`}
              provider={listing.provider || 'Waureisen'}
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
        setAllListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Create different sections with filtered listings
  const getTopRecommendations = () => {
    // You could implement logic to filter top recommendations
    // For now, just return the first 3 listings
    return allListings.slice(0, 3);
  };

  const getPopularAccommodations = () => {
    // You could implement logic to filter popular accommodations
    // For now, just return listings 3-6
    return allListings.slice(3, 6);
  };

  const getExclusiveFinds = () => {
    // You could implement logic to filter exclusive finds
    // For now, just return listings 6-9
    return allListings.slice(6, 9);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  const sections = [
    { title: t('our_top_recommendations'), listings: getTopRecommendations() },
    { title: t('popular_accommodations'), listings: getPopularAccommodations() },
    { title: t('exclusive_finds'), listings: getExclusiveFinds() }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {sections.map((section, index) => (
        section.listings && section.listings.length > 0 ? (
          <RecommendationsSection key={index} title={section.title} listings={section.listings} />
        ) : null
      ))}
      
      {allListings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">{t('no_accommodations_available')}</p>
        </div>
      )}
    </section>
  );
};

export default Recommendations;