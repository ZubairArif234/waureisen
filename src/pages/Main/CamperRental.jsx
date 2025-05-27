// src/pages/Main/CamperRental.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import camperBg from '../../assets/camper.png';
import Footer from '../../components/Shared/Footer';
import { getAvailableCampers } from '../../api/camperAPI';
import { useLanguage } from '../../utils/LanguageContext';
import { Eye, MapPin, DollarSign } from 'lucide-react';
import { changeMetaData } from '../../utils/extra';

const CamperRental = () => {
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

   useEffect(() => {
    changeMetaData("Camper Rental - Waureisen");
  }, []);

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

  const handleOpenCamper = (title) => {
    const formattedTitle = title?.split(" ").join("-")
    navigate(`/camper/${formattedTitle}`);
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
      <div className="py-16 md:py-20 bg-gray-50">
        <h2 className="text-2xl md:text-4xl font-bold text-center max-w-4xl mx-auto px-4 leading-tight">
          {t('traveling_van_quote')}
        </h2>
      </div>

      {/* Camper Vans Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('our_camper')}</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        ) : campers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-10">
            {campers.map((camper) => (
              <div 
                key={camper._id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={camper.featuredImage} 
                    alt={camper.title} 
                    className="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {camper.status !== 'Available' && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 bg-amber-400 text-amber-900 font-medium rounded-full text-sm">
                        {camper.status}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">{camper.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-brand" />
                      <span>{camper.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-brand" />
                      <span className="font-medium text-gray-900">{camper.price} {camper.currency}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{camper.description}</p>
                  
                  {camper.status === 'Available' ? (
                    <button 
                      onClick={() => handleOpenCamper(camper.title)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#B4A481] text-white rounded-lg hover:bg-[#a3927b] transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                      {t('view_details')}
                    </button>
                  ) : (
                    <div className="w-full text-center py-3 bg-gray-100 rounded-lg text-gray-500 font-medium">
                      {t('coming_soon')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">{t('no_campers_available')}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CamperRental;