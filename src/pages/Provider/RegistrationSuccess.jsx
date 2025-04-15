import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';


const RegistrationSuccess = () => {
  const {t} = useLanguage();
  const navigate = useNavigate();
  
  const nextSteps = [
    {
      step: 1,
      titleKey: 'complete_profile',
      descriptionKey: 'complete_profile_desc',
      actionKey: 'complete_profile_action',
      link: '/provider/profile'
    },
    {
      step: 2,
      titleKey: 'create_first_listing',
      descriptionKey: 'create_listing_desc',
      actionKey: 'create_listing_action',
      link: '/provider/create-listing'
    },
    {
      step: 3,
      titleKey: 'set_up_calendar',
      descriptionKey: 'calendar_desc',
      actionKey: 'set_calendar_action',
      link: '/provider/calendar'
    },
    {
      step: 4,
      titleKey: 'connect_payment',
      descriptionKey: 'payment_desc',
      actionKey: 'payment_setup_action',
      link: '/provider/earnings'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        {/* Success message */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('registration_successful')}</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
          {t('account_created_confirmation')}
          </p>
        </div>
        
        {/* Welcome card */}
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('welcome_to_waureisen')}</h2>
          <p className="text-gray-600 mb-4">
          {t('thank_you_joining')}
          </p>
          <p className="text-gray-600">
          {t('dashboard_available')}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="px-5 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors flex items-center justify-center gap-2"
            >
              {t('go_to_dashboard')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Next steps */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('next_steps')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {nextSteps.map((item) => (
            <div key={item.step} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">
                  {item.step}
                </div>
                <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-600 mb-4">{t(item.descriptionKey)}</p>
                  <button
                    onClick={() => navigate(item.link)}
                    className="text-brand hover:underline flex items-center gap-1"
                  >
                    {t(item.actionKey)}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Support section */}
        <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('need_help')}</h2>
          <p className="text-gray-600 mb-4">
          {t('support_available')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/support')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('help_center')}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('contact_support')}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationSuccess;