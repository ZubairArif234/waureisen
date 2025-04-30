import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Banknote, Shield, Settings, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getCurrentProvider } from '../../utils/authService';
import { getProviderProfile } from '../../api/providerAPI';

const AccountCard = ({ icon: Icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 bg-brand/10 rounded-lg">
        <Icon className="w-6 h-6 text-brand" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const ProviderAccountPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [providerData, setProviderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await getProviderProfile();
        setProviderData(data);
      } catch (err) {
        console.error('Error fetching provider profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Get cached provider data as fallback
  const cachedProviderData = getCurrentProvider();

  const accountCards = [
    {
      icon: FileText,
      title: t('personal_info'),
      description: t('personal_info_desc'),
      onClick: () => navigate('/provider/account/profile')
    },
    {
      icon: Banknote,
      title: t('banking_details'),
      description: t('banking_details_desc'),
      onClick: () => navigate('/provider/account/banking')
    },
    {
      icon: Shield,
      title: t('login_security'),
      description: t('login_security_desc'),
      onClick: () => navigate('/provider/account/security')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFCF5]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use fetched data or fallback to cached data
  const displayData = providerData || cachedProviderData || {};
  const providerName = displayData.displayName || 
                      (displayData.firstName && displayData.lastName 
                        ? `${displayData.firstName} ${displayData.lastName}`
                        : displayData.username || 'Provider');
  const providerEmail = displayData.email || '';

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/provider/dashboard')}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{t('account')}</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-gray-600">{providerName}</span>
              <span className="hidden sm:block text-gray-400">•</span>
              <span className="text-gray-600">{providerEmail}</span>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 m-6 p-4 rounded-lg">
              {error}
              <button 
                onClick={() => window.location.reload()}
                className="ml-3 underline text-red-700 hover:text-red-900"
              >
                {t('try_again')}
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountCards.map((card, index) => (
                <AccountCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default ProviderAccountPage;