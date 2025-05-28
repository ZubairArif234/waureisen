// src/components/Footer/TravelMagazine.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import heroImage from "../../assets/tm1.png";
import { getPublishedBlogs } from "../../api/travelMagazineAPI";
import { useLanguage } from "../../utils/LanguageContext";
import { BookOpen } from "lucide-react";
import { changeMetaData } from "../../utils/extra";

const TravelMagazine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  useEffect(() => {
    changeMetaData("Travel Magazine - Waureisen");
  }, []);

  useEffect(() => {
    if (location?.pathname != "/travel-magazine") navigate("/travel-magazine");
  }, [location.pathname]);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const data = await getPublishedBlogs();
        setMagazines(data);
      } catch (error) {
        console.error("Error fetching travel magazines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  const handleOpenMagazine = (country, category, title) => {
    const formattedTitle = title?.replace(/ /g, "-");
    const formattedCategory = category?.replace(/ /g, "-");
    const formattedCountry = country?.replace(/ /g, "-");
    if (country != "") {
      navigate(
        `/travel-magazine/${formattedCountry}/${formattedCategory}/${formattedTitle}`
      );
    } else {
      navigate(`/travel-magazine/${formattedCategory}/${formattedTitle}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-[50vh] md:h-[80vh] w-full bg-cover bg-center mt-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {t("our_travel_magazine")}
          </h1>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("welcome_magazine")}
        </h2>
        <p className="text-gray-700 mb-4">{t("magazine_intro")}</p>
      </div>

      {/* Magazine Articles */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        ) : magazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((magazine) => (
              <div
                key={magazine._id}
                className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform transform hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={magazine.featuredImage}
                    alt={magazine.title}
                    className="w-full h-[220px] object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="flex-grow p-6 flex flex-col">
                  <div className="mb-2 text-sm text-brand font-medium">
                    {new Date(magazine.publishDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {magazine.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {magazine.description}
                  </p>

                  <button
                    onClick={() =>
                      handleOpenMagazine(
                        magazine?.country || "",
                        magazine?.category,
                        magazine.title
                      )
                    }
                    className="mt-auto inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    {t("read_more")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">{t("no_magazines_available")}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TravelMagazine;
