// src/pages/Main/CamperRental.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import camperBg from '../../assets/camper.png';
import Footer from '../../components/Shared/Footer';
import { getAvailableCampers } from '../../api/camperAPI';
import { useLanguage } from '../../utils/LanguageContext';

const CamperRental = () => {
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        setLoading(true);
        const data = await getAvailableCampers();
        setCampers(data);
      } catch (error) {
        console.error('Error fetching campers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampers();
  }, []);

  const handleOpenCamper = (id) => {
    navigate(`/camper/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] md:h-[85vh] w-full mt-20"
        style={{
          backgroundImage: `url(${camperBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t('dogfriendly_camper_rental')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            {t('welcome_camper_rental')}
          </p>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center max-w-4xl mx-auto px-4 leading-tight">
          {t('traveling_van_quote')}
        </h2>
      </div>

      {/* Camper Vans Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        ) : campers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {campers.map((camper) => (
              <div key={camper._id} className="flex flex-col">
                <div className="mb-4">
                  <img 
                    src={camper.featuredImage} 
                    alt={camper.title} 
                    className="w-full rounded-lg h-[400px] object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{camper.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{camper.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brand font-semibold">{camper.price} {camper.currency}</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{camper.location}</span>
                </div>
                {camper.status === 'Available' ? (
                  <button 
                    onClick={() => handleOpenCamper(camper._id)}
                    className="bg-[#B4A481] text-white px-4 py-2 rounded-md text-sm self-start hover:bg-[#a3927b] transition-colors"
                  >
                    {t('view_details')}
                  </button>
                ) : (
                  <div className="text-black text-sm font-bold">
                    {t('coming_soon')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('no_campers_available')}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CamperRental;