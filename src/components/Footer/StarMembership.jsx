import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import heroImage from '../../assets/starmembership.png'; // Make sure you have this image in your assets folder
import { useLanguage } from '../../utils/LanguageContext';

const StarMembership = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[40vh] md:h-[80vh] w-full mt-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* No overlay or text on this hero image */}
      </div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
        {t('star_association')}
      </h1>
        
        <h2 className="text-xl font-medium text-gray-700 text-center mb-8">
        {t('our_membership')}
        </h2>
        
        <p className="text-gray-700 mb-10 text-center">
        {t('star_description')}
        </p>
        
        <div className="flex justify-center">
          <a 
            href="https://www.star.ch/agency-details_838"
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            {t('view_more')}
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StarMembership;