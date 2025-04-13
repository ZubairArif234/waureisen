import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import heroImage from '../../assets/tm1.png';
import travelImage1 from '../../assets/tm2.png';
import travelImage2 from '../../assets/tm3.png';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const TravelMagazine = () => {
  const { t } = useLanguage();
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
      
      {/* Article Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Article 1 */}
          <div className="flex flex-col h-full">
            <div className="overflow-hidden rounded-lg mb-4">
              <img 
                src={travelImage1} 
                alt="Flying with dog" 
                className="w-full h-[300px] object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="flex justify-center mt-auto">
              <a 
                href="https://www.waureisen.com/p/artikel-fliegen-mit-hund" 
                className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
              >
                {t('flying_with_dog')}
              </a>
            </div>
          </div>
          
          {/* Article 2 */}
          <div className="flex flex-col h-full">
            <div className="overflow-hidden rounded-lg mb-4">
              <img 
                src={travelImage2} 
                alt="Road trip through Spain, Portugal and France" 
                className="w-full h-[300px] object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="flex justify-center mt-auto">
              <a 
                href="https://www.waureisen.com/p/reisemagazin-roadtrip" 
                className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
              >
                {t('roadtrip')}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TravelMagazine;