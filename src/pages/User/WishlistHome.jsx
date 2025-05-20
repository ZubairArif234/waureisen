import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import API from "../../api/config";
import { changeMetaData } from "../../utils/extra";

const ImageGrid = ({ images, title, subtitle, link, isLoading }) => {
  // Determine grid layout based on number of images
  const getGridLayout = (imageCount) => {
    if (imageCount === 1) return "col-span-2 row-span-2";
    if (imageCount === 2) return "col-span-2"; // Make two images display full width
    return ""; // Default for 3+ images
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full md:w-auto">
        <div className="w-full max-w-[300px] md:w-auto">
          <div className="relative mb-4">
            <div className="grid grid-cols-2 gap-1 p-2 bg-white rounded-xl shadow-md mx-auto w-full md:w-[260px]">
              <div className="col-span-2 h-[160px] bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-[80px] bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-[80px] bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
          <div className="text-center md:text-left w-full">
            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no images and not loading, show empty state
  if (!isLoading && (!images || images.length === 0)) {
    return (
      <div className="flex flex-col items-center w-full md:w-auto">
        <Link to={link} className="w-full max-w-[300px] md:w-auto group">
          <div className="relative mb-4">
            <div className="grid grid-cols-2 gap-1 p-2 bg-white rounded-xl shadow-md mx-auto w-full md:w-[260px]">
              <div className="col-span-2 h-[240px] bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No items yet</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-left w-full">
            <h3 className="text-xl md:text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full md:w-auto">
      <Link to={link} className="w-full max-w-[300px] md:w-auto group">
        <div className="relative mb-4">
          <div
            className={`grid grid-cols-2 gap-1 p-2 bg-white rounded-xl shadow-md mx-auto w-full md:w-[260px]`}
          >
            {images.length === 1 ? (
              // Single image layout
              <div className="col-span-2">
                <img
                  src={images[0]}
                  alt={`${title} 1`}
                  className="w-full h-[240px] object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : images.length === 2 ? (
              // Two images layout - stack vertically for better appearance
              <>
                <div className="col-span-2">
                  <img
                    src={images[0]}
                    alt={`${title} 1`}
                    className="w-full h-[160px] object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="col-span-2 mt-1">
                  <img
                    src={images[1]}
                    alt={`${title} 2`}
                    className="w-full h-[80px] object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </>
            ) : (
              // 3+ images layout
              images.map((image, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden ${
                    index === 0 && images.length === 3 ? "col-span-2" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-[118px] object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))
            )}
          </div>
          <div className="absolute inset-2 bg-gradient-to-b from-transparent to-black/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="text-center md:text-left w-full">
          <h3 className="text-xl md:text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </Link>
    </div>
  );
};

const WishlistHome = () => {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
                changeMetaData("Wishlist - Waureisen");
              }, [])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [favoritesResponse, recentlyViewedResponse] = await Promise.all([
          API.get("/users/favorites"),
          API.get("/users/recently-viewed"),
        ]);

        setFavorites(favoritesResponse.data);
        setRecentlyViewed(recentlyViewedResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wishlist data:", err);
        setError(err.message || "Failed to load wishlist data");
        setLoading(false);

        // Set empty arrays on error to prevent showing stale data
        setFavorites([]);
        setRecentlyViewed([]);
      }
    };

    // Only fetch if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    } else {
      setLoading(false);
      // Set empty arrays when not logged in
      setFavorites([]);
      setRecentlyViewed([]);
    }
  }, []);

  // Prepare data for components
  const recentlyViewedData = {
    images:
      recentlyViewed.length > 0
        ? recentlyViewed
            .slice(0, 4)
            .map((item) =>
              item.images && item.images.length > 0 ? item.images[0] : null
            )
            .filter((img) => img !== null) // Filter out null images
        : [],
    title: t("recently_viewed"),
    subtitle: loading
      ? t("loading")
      : recentlyViewed.length > 0
      ? `${recentlyViewed.length} ${t("items")}`
      : `0 ${t("items")}`,
    link: "/wishlist/recently-viewed",
    isLoading: loading,
  };

  const favoritesData = {
    images:
      favorites.length > 0
        ? favorites
            .slice(0, 4)
            .map((item) =>
              item.images && item.images.length > 0 ? item.images[0] : null
            )
            .filter((img) => img !== null) // Filter out null images
        : [],
    title: t("your_favorites"),
    subtitle: loading
      ? t("loading")
      : favorites.length > 0
      ? `${favorites.length} ${t("saved")}`
      : `0 ${t("saved")}`,
    link: "/wishlist/favorites",
    isLoading: loading,
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 mt-20">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center md:text-left">
          {t("wishlists")}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          <ImageGrid {...recentlyViewedData} />
          <ImageGrid {...favoritesData} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistHome;
