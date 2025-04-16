import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import authBg from '../../assets/bg.png';
import Footer from '../../components/Shared/Footer';
import Modal from '../../components/Auth/Modal';
import TermsContent from '../../components/Auth/TermsContent';
import PrivacyContent from '../../components/Auth/PrivacyContent';
import { useLanguage } from '../../utils/LanguageContext';
import { userSignup, providerSignup } from '../../api/authAPI';

const Signup = () => {
  const [userType, setUserType] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    phoneNumber: '',
    password: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [redirectAfterSignup, setRedirectAfterSignup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Check for redirect parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get('redirect');
    if (redirect) {
      setRedirectAfterSignup(redirect);
      
      // If redirecting from provider registration, pre-select provider type
      if (redirect === 'provider-registration') {
        setUserType('provider');
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      setError(t('please_accept_terms') || 'Please accept the terms and conditions');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Create common user data object
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || '',
        username: formData.displayName || `${formData.firstName} ${formData.lastName}`
      };

      let response;
      
      // Different API call based on user type
      if (userType === 'customer') {
        console.log('Attempting customer signup with:', userData);
        response = await userSignup(userData);
        console.log('Customer signup response:', response);
        
        // Store the token and user data
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', 'user');
          
          if (response.user) {
            localStorage.setItem('user_data', JSON.stringify(response.user));
          }
          
          // Navigate to home page after successful signup
          navigate('/');
        } else {
          throw new Error('Invalid response from server - no token received');
        }
      } else if (userType === 'provider') {
        // Add any provider-specific fields
        const providerData = {
          ...userData,
          displayName: formData.displayName || `${formData.firstName} ${formData.lastName}`
        };
        
        // If the redirect is for provider registration, just navigate there
        if (redirectAfterSignup === 'provider-registration') {
          // Store data temporarily to be used in the registration form
          sessionStorage.setItem('providerSignupData', JSON.stringify(providerData));
          navigate('/provider/registration');
        } else {
          // Otherwise, make the actual API call
          console.log('Attempting provider signup with:', providerData);
          response = await providerSignup(providerData);
          console.log('Provider signup response:', response);
          
          // Store the token and provider data
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userType', 'provider');
            
            if (response.provider) {
              localStorage.setItem('provider_user', JSON.stringify(response.provider));
            }
            
            navigate('/provider/dashboard');
          } else {
            throw new Error('Invalid response from server - no token received');
          }
        }
      } else {
        throw new Error('Please select a user type');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Main Container with Background */}
      <div 
        className="min-h-screen pt-8 mt-20 relative"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Form Container */}
        <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Auth Type Selector */}
            <div className="flex text-2xl font-semibold border-b relative">
              <Link 
                to="/signup" 
                className="flex-1 text-center py-4 text-gray-900"
              >
                {t('sign_up')}
              </Link>
              <Link 
                to="/login" 
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                {t('log_in')}
              </Link>
              {/* Active Indicator Line */}
              <div 
                className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#B4A481]"
              />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('user_type')}
                  </label>
                  <div className="relative">
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481] appearance-none bg-white"
                    >
                      <option value="">{t('choose_user_type')}</option>
                      <option value="customer">{t('customer')}</option>
                      <option value="provider">{t('provider')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Common Fields */}
                {userType && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('email_placeholder')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('first_name')}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={t('first_name_placeholder')}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('last_name')}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={t('last_name_placeholder')}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          required
                        />
                      </div>
                    </div>

                    {/* Provider-specific Fields */}
                    {userType === 'provider' && (
                      <>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('display_name')}
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            placeholder={t('display_name_placeholder')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('phone_number')}
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder={t('phone_number_placeholder')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('password')}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={t('password_placeholder')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                        required
                        minLength="8"
                      />
                    </div>
                  </>
                )}


                 {/* Terms Acceptance */}
                 <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="rounded border-gray-300 text-[#B4A481] focus:ring-[#B4A481]"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        {t('accept_terms')}{' '}
                        <button 
                          type="button"
                          onClick={() => setIsTermsOpen(true)}
                          className="text-[#B4A481] hover:underline"
                        >
                          {t('terms_of_service')}
                        </button>
                        {' '}{t('and_the')}{' '}
                        <button
                          type="button"
                          onClick={() => setIsPrivacyOpen(true)}
                          className="text-[#B4A481] hover:underline"
                        >
                          {t('privacy_policy')}
                        </button>
                      </label>
                    </div>

                    {/* Terms of Service Modal */}
                    <Modal
                      isOpen={isTermsOpen}
                      onClose={() => setIsTermsOpen(false)}
                      title={t('terms_of_service')}
                    >
                      <TermsContent />
                    </Modal>

                     {/* Privacy Policy Modal */}
                     <Modal
                      isOpen={isPrivacyOpen}
                      onClose={() => setIsPrivacyOpen(false)}
                      title={t('privacy_policy')}
                    >
                      <PrivacyContent />
                    </Modal>

                    {/* Signup Button */}
                    <button
                      type="submit"
                      disabled={!acceptTerms || isLoading || !userType}
                      className={`w-full py-3 rounded-lg font-medium ${
                        acceptTerms && !isLoading && userType
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? t('signing_up') : t('sign_up')}
                    </button>
              </div>
            </form>

            {/* Added Footer */}
            <div className="h-1 bg-[#B4A481] mt-0 opacity-75" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;