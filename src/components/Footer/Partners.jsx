import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import partnersBackground from '../../assets/ourpartners.png';
import { PawPrint, Globe } from 'lucide-react';

const PartnerSection = ({ title, description, url }) => {
  return (
    <div className="py-12 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
        <p className="text-gray-700 text-center mb-8">
          {description}
        </p>
        <div className="flex justify-center">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  );
};

const Partners = () => {
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
              Learn more about our partners! <span role="img" aria-label="handshake">🤝</span> <span role="img" aria-label="bark">🐕</span> <span role="img" aria-label="world">🌍</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Partners Sections */}
      <div className="py-8">
        {/* Interhome */}
        <PartnerSection 
          title="Interhome"
          description="Interhome wurde 1965 in London von Bruno Franzen und Werner Frey unter dem Namen Swiss Chalets gegründet und 1977 nach einer Fusion in Interhome umbenannt. Bekannt wurde das Unternehmen durch innovative Ansätze wie den Versuch, ein papierloses Büro zu etablieren. 1984 wurde das markante 'Zugvogel'-Logo eingeführt, das seit 2008 als Erkennungszeichen dient. 1999 folgten die ersten Onlinebuchungen, die 2009 bereits rund 60% der Gesamtbuchungen ausmachten. 2015 feierte Interhome sein 50-jähriges Jubiläum und belegte den 6. Platz bei den 'Swiss Arbeitgeber Awards' in der Kategorie 50–99 Mitarbeiter."
          url="https://www.interhome.ch/?color-cta-contrast=FFFFFF&partnerid=CH1002557&iframe=true&color-thm=0096DB&color-cta=E63957"
        />
        
        {/* EuroParcs */}
        <PartnerSection 
          title="EuroParcs"
          description="EuroParcs was founded in the 1980s by Wim Vos and specializes in managing holiday parks. The company grew rapidly and acquired the competitor Droomparken in 2019. In 2021, EuroParcs opened an office in Cologne. In November 2024, EuroParcs was acquired by Waterland Private Equity. The EuroParcs Charity Foundation offers free stays for families with seriously ill children and people with disabilities."
          url="https://www.europarcs.de/"
        />
        
        {/* Pet & Co */}
        <PartnerSection 
          title="Pet & co."
          description="PET & Co. was founded in 2021 by siblings Kerstin and Sarah. With a great passion and attention to detail, the team designs comfortable, easy-care, and aesthetically pleasing products, tailored to the needs of dogs, cats, and their owners. True to the motto: 'Create good vibes in your home and live in a happy place.'"
          url="https://petandco.ch/?ref=waureisen"
        />
        
        {/* Kitsune & Jo */}
        <PartnerSection 
          title="Kitsune & Jo"
          description="Kitsune & Jo (and Alex) At Kitsune & Jo, we aim to improve the lifestyle of dogs. Alex and I share a deep passion for design, and we firmly believe that our dogs deserve only the best. After spending some time abroad and frequently traveling with Kitsune, we were inspired to enhance the dog lifestyle here in Switzerland by curating a selection of products we are proud of. Products that you don't hide, but proudly showcase in your home, and integrate into your lifestyle. This project was born from a genuine desire to provide dogs and their parents with healthy food, because yes, we consider ourselves parents too."
          url="https://kitsuneandjo.ch/?ref=waureisen"
        />
        
        {/* Hundelicious */}
        <PartnerSection 
          title="Hundelicious"
          description="In 2019 HUNDELICIOUS was founded by Julia and Sérgio with one simple idea: all living creatures are unique and deserve the best. With several decades of experience in gastronomy and animal nutrition, they have dedicated their life's work to understanding the way food can bring comfort, health, and joy. «We are striving for sharing our knowledge and experience with others so their relationship to real food and healthy holistic pet nutrition can evolve.» (Julia, 2021) In 2022 Anne-Catherine with Emma and Bettina with Gia joined the Team."
          url="https://hundelicious.ch/?ref=waureisen"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Partners;