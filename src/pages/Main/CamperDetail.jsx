// src/pages/Main/CamperDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { getCamperById } from '../../api/camperAPI';
import { useLanguage } from '../../utils/LanguageContext';
import { changeMetaData } from '../../utils/extra';

const CamperDetail = () => {
  const { title } = useParams();
  const [camper, setCamper] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();
 useEffect(() => {
   const formattedTitle = title?.replace(/-/g, " ");
    changeMetaData(`${formattedTitle} - Camper Rental`);
  }, []);
  useEffect(() => {
    const fetchCamper = async () => {
      try {
        setLoading(true);
      const formattedTitle = title?.replace(/-/g, " ");
        const data = await getCamperById(formattedTitle);
        setCamper(data);
      } catch (error) {
        console.error('Error fetching camper details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchCamper();
    }
  }, [title]);

const renderContent = (content) => {
  if (!content || !Array.isArray(content)) return null;

  const elements = [];
  let imageGroup = [];

  content.forEach((item, index) => {
    const isLastItem = index === content.length - 1;

    if (item.type === 'img') {
      imageGroup.push(item);

      if (!isLastItem) return; // wait for next item to decide

    }

    // Render accumulated images if next item is not image or it's the last one
    if (imageGroup.length) {
      if (imageGroup.length === 1) {
        elements.push(
          <div key={`img-${index}`} className="my-4 mx-[8rem]">
            <img src={imageGroup[0].url} className="w-full h-[40vh]" alt="" />
          </div>
        );
      } else {
        elements.push(
          <div key={`img-group-${index}`} className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 ">
            {imageGroup.map((imgItem, imgIndex) => (
              <img
                key={`img-${index}-${imgIndex}`}
                src={imgItem.url}
                className="w-full h-[40vh] object-cover"
                alt=""
              />
            ))}
          </div>
        );
      }
      imageGroup = []; // reset
    }

    // Render non-image item
    if (item.type !== 'img') {
      switch (item.type) {
        case 'h1':
          elements.push(<h1 key={index} className="text-3xl font-bold my-4 text-gray-900">{item.text}</h1>);
          break;
        case 'h2':
          elements.push(<h2 key={index} className="text-2xl font-semibold my-3 text-gray-800">{item.text}</h2>);
          break;
        case 'p':
          elements.push(<p key={index} className="my-3 text-gray-600">{item.text}</p>);
          break;
        case 'link':
          elements.push(
            <p key={index} className="my-2">
              <a href={item.url} className="text-[#B4A481] hover:underline" target="_blank" rel="noopener noreferrer">
                {item.text}
              </a>
            </p>
          );
          break;
        case 'cta':
          elements.push(
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
          break;
        default:
          break;
      }
    }
  });

  return elements;
};


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      ) : camper ? (
        <>
          {/* Hero Section with Image */}
          <div className="relative w-full h-[60vh] mt-20">
            <img 
              src={camper.featuredImage} 
              alt={camper.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
              <button 
                onClick={() => navigate('/camper-rental')}
                className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {camper.title}
              </h1>
              <p className="text-lg md:text-xl text-white max-w-2xl">
                {camper.description}
              </p>
            </div>
          </div>
          
          {/* Content Section - Centered */}
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <div className="prose max-w-none mx-auto">
              {renderContent(camper.content)}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl text-gray-600 mb-4">{t('camper_not_found')}</p>
          <button 
            onClick={() => navigate('/camper-rental')}
            className="px-4 py-2 bg-brand text-white rounded-lg"
          >
            {t('back_to_campers')}
          </button>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default CamperDetail;