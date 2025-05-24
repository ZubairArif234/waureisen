import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, HelpCircle } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getProviderProfile, updateProviderProfile } from '../../api/providerAPI';
import { getCurrentProvider } from '../../utils/authService';
import toast from 'react-hot-toast';
import { changeMetaData } from '../../utils/extra';

const ProviderBankingPage = () => {
    useEffect(() => {
        
          changeMetaData(`Bank Details - Provider`);
        }, []);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolder: '',
    iban: '',
    swift: '',
  });

  // Fetch provider profile data
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const data = await getProviderProfile();
        
        // Set form data from API response
        setFormData({
          bankName: data.bankName || '',
          accountHolder: data.accountHolder || '',
          iban: data.iban || '',
          swift: data.swift || '',
        });
      } catch (err) {
        console.error('Error fetching provider profile:', err);
        setError('Failed to load banking data. Please try again.');
        
        // Fallback to cached data
        const cachedProvider = getCurrentProvider();
        if (cachedProvider) {
          setFormData({
            bankName: cachedProvider.bankName || '',
            accountHolder: cachedProvider.accountHolder || '',
            iban: cachedProvider.iban || '',
            swift: cachedProvider.swift || '',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Validate IBAN format (simple validation)
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{12,30}$/;
      const cleanedIban = formData.iban.replace(/\s/g, '');
      
      if (!ibanRegex.test(cleanedIban)) {
        setError('Please enter a valid IBAN number.');
        return;
      }
      
      // Prepare data for API
      const updateData = {
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        iban: formData.iban,
        swift: formData.swift,
      };
      
      // Update banking details
      const updatedProfile = await updateProviderProfile(updateData);
      
      // Success notification
      toast.success(t('banking_details_updated'));
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating banking details:', err);
      setError('Failed to update banking details. Please try again.');
      toast.error(t('update_failed'));
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/provider/account')}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {t('banking_details')}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('banking_details_management')}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t('cancel_editing') : t('edit_banking_details')}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 m-6 p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('payment_information')}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {t('banking_details_required')}
              </p>
              
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('bank_name')} *
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('account_holder_name')} *
                </label>
                <input
                  type="text"
                  id="accountHolder"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('match_bank_account_name')}
                </p>
              </div>
              
              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('iban')} *
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="eg. CH93 0076 2011 6238 5295 7"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="swift" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('swift_code')} ({t('optional')})
                </label>
                <input
                  type="text"
                  id="swift"
                  name="swift"
                  value={formData.swift}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">{t('payment_information')}</h3>
                    <p className="mt-1 text-sm text-blue-600">
                      {t('payment_explanation')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('saving')}</span>
                    </div>
                  ) : (
                    t('save_changes')
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default ProviderBankingPage;