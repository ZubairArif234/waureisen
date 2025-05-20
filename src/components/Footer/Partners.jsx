import React, { useEffect } from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import partnersBackground from '../../assets/ourpartners.png';
import { PawPrint, Globe } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import { changeMetaData } from '../../utils/extra';

const PartnerSection = ({ title, descriptionKey, url }) => {
  const { t } = useLanguage();
  useEffect(() => {
            changeMetaData("Partners - Waureisen");
          }, []);
  return (
    <div className="py-12 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
        <p className="text-gray-700 text-center mb-8">
          {t(descriptionKey)}
        </p>
        <div className="flex justify-center">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            {t('read_more')}
          </a>
        </div>
      </div>
    </div>
  );
};

const Partners = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-[50vh] md:h-[80vh] w-full bg-cover bg-center mt-20"
        style={{ backgroundImage: `url(${partnersBackground})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('learn_about_partners')} <span role="img" aria-label="handshake">🤝</span> <span role="img" aria-label="bark">🐕</span> <span role="img" aria-label="world">🌍</span>
            </h1>
          </div>
        </div>
      </div>
      
     {/* Partners Sections */}
<div className="py-8">
  {/* Interhome */}
  <PartnerSection 
    title="Interhome"
    descriptionKey="interhome_description"
    url="https://www.interhome.ch/?color-cta-contrast=FFFFFF&partnerid=CH1002557&iframe=true&color-thm=0096DB&color-cta=E63957"
  />
  
  {/* EuroParcs */}
  <PartnerSection 
    title="EuroParcs"
    descriptionKey="europarcs_description"
    url="https://www.europarcs.de/"
  />
  
  {/* Pet & Co */}
  <PartnerSection 
    title="Pet & co."
    descriptionKey="petco_description"
    url="https://petandco.ch/?ref=waureisen"
  />
  
  {/* Kitsune & Jo */}
  <PartnerSection 
    title="Kitsune & Jo"
    descriptionKey="kitsune_description"
    url="https://kitsuneandjo.ch/?ref=waureisen"
  />
  
  {/* Hundelicious */}
  <PartnerSection 
    title="Hundelicious"
    descriptionKey="hundelicious_description"
    url="https://hundelicious.ch/?ref=waureisen"
  />
</div>
      
      <Footer />
    </div>
  );
};

export default Partners;