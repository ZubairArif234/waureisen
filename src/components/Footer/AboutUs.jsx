import React, { useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import together from '../../assets/together.png';
import ceo from '../../assets/ceo.png';
import founder from '../../assets/partner.png';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import { changeMetaData } from '../../utils/extra';
import { useLocation, useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage();
    useEffect(() => {
    if (location?.pathname != "/about-us") navigate("/about-us");
  }, [location.pathname]);
  useEffect(() => {
          changeMetaData("About Us - Waureisen");
        }, []);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* About Us Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">{t('about_us')}</h1>

<div className='grid grid-cols-2 items-start '>

        {/* About Text */}
        <div className=" mx-auto mb-12 text-gray-700">
          <p className="text-justify mb-6 text-sm">
            {t('about_text')}
          </p>
        </div>
          
          {/* Together Image */}
          <div className="flex justify-center items-center ">
            <img 
              src={together} 
              alt="Simone and Charlie together" 
              className="rounded-lg  max-w-full md:max-w-sm"
            />
          </div>
</div>
          
          {/* Team Section */}
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">{t('the_team')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Simone Card */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={ceo} 
                alt="Simone" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-left">{t('simone_title')}</h3>
                </div>
                <p className="text-gray-700 text-left">
                {t('simone_bio')}
                </p>
              </div>
            </div>
            
            {/* Charlie Card */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={founder} 
                alt="Charlie" 
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl text-left font-bold ">{t('charlie_title')}</h3>
                </div>
                <p className="text-gray-700 text-left">
                {t('charlie_bio')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;