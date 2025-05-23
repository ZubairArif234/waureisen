import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Shared/Navbar';
import SearchBar from '../SearchComponents/SearchBar';
import bgImage from '../../assets/bg.png';
import { useLanguage } from '../../utils/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Add this handler to properly process the search URL
  const handleSearch = (searchUrl) => {
    console.log("Search URL from Hero:", searchUrl);
    navigate(searchUrl);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden z-10">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <Navbar />

      <div className="relative z-20 pt-40 md:pt-56 min-h-screen flex items-center">
        <div className="w-full px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="md:max-w-2xl pl-4 md:pl-0">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 font-poppins">
                {t('holiday_with_dog')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white mb-8 font-bold font-poppins">
                {t('find_suitable_accommodation')}
              </p>
            </div>

            {/* Search Bar - Now with onSearch prop */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;