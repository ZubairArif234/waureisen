// src/components/Footer/TravelMagazineDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { getBlogById } from '../../api/travelMagazineAPI';
import { useLanguage } from '../../utils/LanguageContext';
import { changeMetaData } from '../../utils/extra';

const TravelMagazineDetail = () => {
  const { title } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();
useEffect(() => {
    const formattedTitle = title?.replace(/-/g, " ");
          changeMetaData(`${formattedTitle} - Waureisen`);
        }, []);
  useEffect(() => {
    const fetchMagazine = async () => {
      const formattedTitle = title?.replace(/-/g, " ");
      try {
        setLoading(true);
        const data = await getBlogById(formattedTitle);
        setMagazine(data);
      } catch (error) {
        console.error('Error fetching magazine details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchMagazine();
    }
  }, [title]);

  // Render content based on type
  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((item, index) => {
      switch (item.type) {
        case 'h1':
          return <h1 key={index} className="text-3xl font-bold my-4 text-gray-900">{item.text}</h1>;
        case 'h2':
          return <h2 key={index} className="text-2xl font-semibold my-3 text-gray-800">{item.text}</h2>;
        case 'p':
          return <p key={index} className="my-3 text-gray-600">{item.text}</p>;
        case 'link':
          return (
            <p key={index} className="my-2">
              <a href={item.url} className="text-[#B4A481] hover:underline" target="_blank" rel="noopener noreferrer">{item.text}</a>
            </p>
          );
        case 'cta':
          return (
            <p key={index} className="my-4">
              <a 
                href={item.url} 
                className="inline-block bg-[#B4A481] text-white px-6 py-2 rounded-lg hover:bg-[#a3927b] transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {item.text}
              </a>
            </p>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      ) : magazine ? (
        <>
          {/* Hero Section with Image */}
          <div className="relative w-full h-[60vh] mt-20">
            <img 
              src={magazine.featuredImage} 
              alt={magazine.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
              <button 
                onClick={() => navigate('/travel-magazine')}
                className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {magazine.title}
              </h1>
              <p className="text-lg md:text-xl text-white max-w-2xl">
                {magazine.description}
              </p>
            </div>
          </div>
          
          {/* Content Section - Centered */}
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="prose max-w-none mx-auto">
              {renderContent(magazine.content)}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl text-gray-600 mb-4">{t('magazine_not_found')}</p>
          <button 
            onClick={() => navigate('/travel-magazine')}
            className="px-4 py-2 bg-brand text-white rounded-lg"
          >
            {t('back_to_magazines')}
          </button>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default TravelMagazineDetail;