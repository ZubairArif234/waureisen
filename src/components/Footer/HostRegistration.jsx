import React, { useEffect } from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../utils/LanguageContext';
import { changeMetaData } from '../../utils/extra';
import { PawPrint } from 'lucide-react';

const HostRegistration = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useEffect(() => {
          changeMetaData("Become a host - Waureisen");
        }, []);
  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>{t('back_to_home')}</span>
        </button>
        
        <h1 className="text-4xl font-bold mb-8 text-center">{t('become_a_host')}</h1>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg mb-6">
            {t('host_intro')}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">{t('benefits_hosting')}</h2>
          <ul className="list-none ml-6 mb-6 space-y-2">
            <li className='flex items-center gap-3'><PawPrint size={20} /> {t('benefit_1')}</li>
            <li className='flex items-center gap-3'><PawPrint size={20} />{t('benefit_2')}</li>
            <li className='flex items-center gap-3'><PawPrint size={20} />{t('benefit_3')}</li>
            <li className='flex items-center gap-3'><PawPrint size={20} />{t('benefit_4')}</li>
            <li className='flex items-center gap-3'><PawPrint size={20} />{t('benefit_5')}</li>
            <li className='flex items-center gap-3'><PawPrint size={20}/>{t('benefit_6')}</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">{t('how_it_works')}</h2>
          <ol className="list-decimal ml-6 mb-8 space-y-3">
            <li>
              <strong>{t('how_it_works_1')}</strong>
            </li>
            <li>
              <strong>{t('how_it_works_2')}</strong>
            </li>
            <li>
              <strong>{t('how_it_works_3')}</strong>
            </li>
          </ol>
          
          <h2 className="text-2xl font-semibold mb-4">{t('ready_to_start')}</h2>
          <p className="mb-8">
            {t('start_hosting_text')}
          </p>
          
          <div className="flex justify-center">
          <button 
            onClick={() => {
              // Check if user is logged in (would typically check auth state or token)
              const isUserLoggedIn = localStorage.getItem('user') || false;
              
              if (isUserLoggedIn) {
                navigate('/signup?userType=provider');
              } else {
                // Redirect to signup with a redirect parameter
                navigate('/signup?redirect=provider-registration');
              }
            }}
            className="bg-brand hover:bg-brand/90 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300"
          >
            {t('register_as_host')}
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostRegistration;