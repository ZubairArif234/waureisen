// src/components/Footer/TravelMagazine.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import heroImage from '../../assets/tm1.png';
import { getPublishedBlogs } from '../../api/travelMagazineAPI';
import { useLanguage } from '../../utils/LanguageContext';

const TravelMagazine = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const data = await getPublishedBlogs();
        setMagazines(data);
      } catch (error) {
        console.error('Error fetching travel magazines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  const handleOpenMagazine = (id) => {
    navigate(`/magazine/${id}`);
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
          <h1 className="text-4xl md:text-6xl font-bold text-white">{t('our_travel_magazine')}</h1>
        </div>
      </div>
      
      {/* Welcome Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('welcome_magazine')}</h2>
        <p className="text-gray-700 mb-4">
          {t('magazine_intro')}
        </p>
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
              <div key={magazine._id} className="flex flex-col h-full">
                <div className="overflow-hidden rounded-lg mb-4">
                  <img 
                    src={magazine.featuredImage} 
                    alt={magazine.title} 
                    className="w-full h-[250px] object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{magazine.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{magazine.description}</p>
                <div className="flex justify-center mt-auto">
                  <button 
                    onClick={() => handleOpenMagazine(magazine._id)}
                    className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
                  >
                    {t('read_more')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('no_magazines_available')}</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TravelMagazine;