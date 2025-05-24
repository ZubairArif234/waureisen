import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import AccommodationCard from "./AccommodationCard";
import { useLanguage } from "../../utils/LanguageContext";
import API from "../../api/config";
import { getListingById } from "../../api/listingAPI";
import { fetchInterhomePrices } from "../../api/interhomeAPI";

// Skeleton card for loading state
const SkeletonCard = memo(() => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="rounded-xl overflow-hidden mb-3 relative bg-gray-200 h-48 w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
});

// Memoize the RecommendationsSection component
const RecommendationsSection = memo(({ title, listings, isLoading }) => {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in and fetch favorites if they are
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const fetchFavorites = async () => {
        try {
          const response = await API.get("/users/favorites");
          // Create an array of favorite listing IDs for lookup
          const favoriteIds = response.data.map((listing) => listing._id);
          setFavorites(favoriteIds);
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      };

      fetchFavorites();
    }
  }, []);

  // Memoize the skeleton cards array to prevent recreation on each render
  const skeletonCards = useMemo(
    () =>
      Array(6)
        .fill()
        .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />),
    []
  );

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show skeleton cards when loading
          skeletonCards
        ) : listings && listings.length > 0 ? (
          listings.map((listing) => (
            <AccommodationCard
              key={listing._id}
              id={listing._id}
              code={listing.Code}
              image={null}
              images={listing.images || []}
              price={listing.dynamicPrice || listing.pricePerNight?.price || 0}
              location={listing.title || "Unnamed Accommodation"}
              provider={listing.provider || "Unknown"}
              listingSource={
                listing.listingSource ||
                (listing.source && listing.source.name) ||
                "Provider"
              }
              pricePerNight={
                listing.dynamicPrice
                  ? { price: listing.dynamicPrice, currency: "CHF" }
                  : listing.pricePerNight
              }
              isFavorited={isLoggedIn && favorites.includes(listing._id)}
            />
          ))
        ) : (
          <p>{t("no_listings_available")}</p>
        )}
      </div>
    </div>
  );
});

const Recommendations = () => {
  const { t } = useLanguage();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [newListings, setNewListings] = useState([]);
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert the fetch listing function to useCallback to prevent recreation on each render
  const fetchListingWithPrice = useCallback(async (id) => {
    try {
      const listing = await getListingById(id);

      // Check if it's an Interhome listing by checking both source.name and provider attributes
      const isInterhomeListing =
        (listing.source?.name?.toLowerCase() === "interhome" ||
          listing.provider?.toLowerCase() === "interhome" ||
          listing.listingSource?.toLowerCase() === "interhome") &&
        listing.Code;

      // If it's an Interhome listing, fetch dynamic pricing
      if (isInterhomeListing) {
        try {
          // Get today's date in YYYY-MM-DD format
          const today = new Date();
          const formattedDate = `${today.getFullYear()}-${String(
            today.getMonth() + 1
          ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

          // Fetch price for a 7-day stay starting today with 2 guests
          const priceData = await fetchInterhomePrices({
            accommodationCode: listing.Code,
            checkInDate: formattedDate,
            pax: 2,
            los: true,
          });

          // Process Interhome price data
          if (priceData?.priceList?.prices?.price?.length > 0) {
            // Filter for 7-day duration options
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

              return {
                ...listing,
                dynamicPrice: calculatedPricePerNight,
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
        } catch (priceError) {
          console.warn(
            `Could not fetch price for ${listing.Code}: ${priceError.message}`
          );
        }
      }
      return listing;
    } catch (error) {
      console.warn(`Could not fetch listing ${id}:`, error.message);
      return null;
    }
  }, []);

  // Convert the fetch and sort function to useCallback
  const fetchAndSortListings = useCallback(
    async (ids) => {
      // Fetch all listings in parallel
      const fetchedListings = await Promise.all(
        ids.map((id) => fetchListingWithPrice(id))
      );

      // Filter out null values (failed fetches) and only include active listings
      const validListings = fetchedListings.filter(
        (listing) => Boolean(listing) && listing.status === "active"
      );

      // Sort listings by price (low to high)
      return validListings.sort((a, b) => {
        // Then sort by price (use dynamicPrice if available, otherwise use pricePerNight)
        const priceA = a.dynamicPrice || a.pricePerNight?.price || 0;
        const priceB = b.dynamicPrice || b.pricePerNight?.price || 0;
        return priceA - priceB;
      });
    },
    [fetchListingWithPrice]
  );

  // Fetch recommendations and corresponding listings
  useEffect(() => {
    const fetchRecommendedListings = async () => {
      try {
        // Get recommendations from the API
        let recommendationsData = {
          topRecommendations: [],
          popularAccommodations: [],
          exclusiveFinds: [],
        };

        try {
          const response = await API.get("/admins/recommendations");
          recommendationsData = response.data;
        } catch (recError) {
          console.warn("Could not fetch recommendations:", recError.message);
        }

        // Extract listing IDs from each section
        const getIds = (items) => {
          return items.map((item) =>
            typeof item === "string" ? item : item._id
          );
        };

        const featuredIds = getIds(
          recommendationsData.topRecommendations || []
        );
        const newIds = getIds(recommendationsData.exclusiveFinds || []);
        const popularIds = getIds(
          recommendationsData.popularAccommodations || []
        );

        // Fetch and process all three recommendation sections in parallel
        const [featured, newItems, popular] = await Promise.all([
          fetchAndSortListings(featuredIds),
          fetchAndSortListings(newIds),
          fetchAndSortListings(popularIds),
        ]);

        // Limit to 6 items per section
        setFeaturedListings(featured.slice(0, 6));
        setNewListings(newItems.slice(0, 6));
        setPopularListings(popular.slice(0, 6));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecommendedListings();
  }, [fetchAndSortListings]);

  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <RecommendationsSection
        title={t("featured_accommodations")}
        listings={featuredListings}
        isLoading={loading}
      />
      <RecommendationsSection
        title={t("new_accommodations")}
        listings={newListings}
        isLoading={loading}
      />
      <RecommendationsSection
        title={t("popular_accommodations")}
        listings={popularListings}
        isLoading={loading}
      />
    </div>
  );
};

export default Recommendations;
