import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Eye, EyeOff } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getProviderProfile } from '../../api/providerAPI';
import { updateProviderSecurity } from '../../api/providerAPI';
import { getCurrentProvider } from '../../utils/authService';
import toast from 'react-hot-toast';

const ProviderSecurityPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch provider profile data
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const data = await getProviderProfile();
        
        // Set email from API response
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
        }));
      } catch (err) {
        console.error('Error fetching provider profile:', err);
        setError('Failed to load profile data. Please try again.');
        
        // Fallback to cached data
        const cachedProvider = getCurrentProvider();
        if (cachedProvider) {
          setFormData(prev => ({
            ...prev,
            email: cachedProvider.email || '',
          }));
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

  const validateForm = () => {
    // Reset error
    setError(null);
    
    // Check if current password is provided
    if (!formData.currentPassword) {
      setError(t('current_password_required'));
      return false;
    }
    
    // Check if new password is provided
    if (!formData.newPassword) {
      setError(t('new_password_required'));
      return false;
    }
    
    // Check if new password meets requirements (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError(t('password_requirements_not_met'));
      return false;
    }
    
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('passwords_dont_match'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Prepare data for API
      const securityData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };
      
      // Update password
      await updateProviderSecurity(securityData);
      
      // Success notification
      toast.success(t('password_updated_successfully'));
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating password:', err);
      
      // Handle specific errors
      if (err.response && err.response.status === 401) {
        setError(t('current_password_incorrect'));
      } else {
        setError(t('password_update_failed'));
        toast.error(t('password_update_failed'));
      }
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
                {t('login_security')}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('login_security_desc')}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t('cancel_editing') : t('edit_security')}
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
            {/* Email Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('email_address')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500"
              />
              <p className="text-sm text-gray-500">
                {t('email_access_tip')}
              </p>
            </div>

            {/* Password Section */}
            {isEditing ? (
              <>
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('current_password')}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('new_password')}</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('password_requirements')}
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('confirm_password')}</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('password')}</label>
                <div className="flex items-center space-x-2">
                  <div className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500">
                    ••••••••••••
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {t('last_updated')}: {new Date().toLocaleDateString()}
                </p>
              </div>
            )}

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
                    t('update_password')
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderSecurityPage;