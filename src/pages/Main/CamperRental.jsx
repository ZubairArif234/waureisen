import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import camperBg from '../../assets/camper.png';
import willyVan from '../../assets/cr1.png';  
import walterVan from '../../assets/cr2.png'; 
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';

const CamperRental = () => {

  const { t } = useLanguage();

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Willy Van */}
            <div className="flex flex-col">
            <div className="mb-4">
                <img 
                src={willyVan} 
                alt="Willy Van" 
                className="w-full rounded-lg h-[400px] md:h-[400px] object-cover"
                />
            </div>
            <button 
    className="bg-[#B4A481] text-white px-4 py-2 rounded-md text-sm w-fit"
>
    {t('willy')}
</button>
            </div>

            {/* Walter Van */}
            <div className="flex flex-col">
            <div className="mb-4">
                <img 
                src={walterVan} 
                alt="Walter Van" 
                className="w-full rounded-lg h-[400px]  object-cover"
                />
            </div>
            <div 
    className="text-black text-sm font-bold"
>
    {t('coming_soon')}
</div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
    
  );
};

export default CamperRental;