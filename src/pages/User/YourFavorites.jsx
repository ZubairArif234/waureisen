import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import AccommodationCard from "../../components/HomeComponents/AccommodationCard";
import { useLanguage } from "../../utils/LanguageContext";
import API from "../../api/config";

const YourFavorites = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite listings from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await API.get("/users/favorites");
        setFavoriteListings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "Failed to load favorites");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Handle removing from favorites
  const handleRemoveFromFavorites = async (listingId) => {
    try {
      await API.delete(`/users/favorites/${listingId}`);
      // Update local state to remove the item
      setFavoriteListings(
        favoriteListings.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="relative">
        <div className="flex">
          {/* Main Content */}
          <main className="w-full px-4 sm:px-6 lg:px-8 py-12 mt-20">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/wishlist")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">
                {t("your_favorites")}
              </h1>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && favoriteListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">{t("no_favorites_yet")}</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  {t("explore_accommodations")}
                </button>
              </div>
            )}

            {/* Listings Grid */}
            {!loading && !error && favoriteListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteListings.map((listing) => (
                  <AccommodationCard
                    key={listing._id}
                    id={listing._id}
                    image={
                      listing.images && listing.images.length > 0
                        ? listing.images[0]
                        : null
                    }
                    price={listing.pricePerNight?.price || 150}
                    location={listing.title || listing.location}
                    provider={listing.source?.name || "Waureisen"}
                    isFavorited={true}
                    onToggleFavorite={() =>
                      handleRemoveFromFavorites(listing._id)
                    }
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default YourFavorites;
