import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import authBg from '../../assets/bg.png';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error on new submission

    // Check for admin credentials
    if (email === 'admin@mail.com' && password === '1234') {
      navigate('/admin');
      return;
    }

    // Check for provider credentials
    if (email === 'provider@mail.com' && password === '1234') {
      navigate('/provider/dashboard');
      return;
    }

    // Check for user credentials
    if (email === 'user@mail.com' && password === '1234') {
      navigate('/');
      return;
    }

    // For now, show error for other users
    setError(t('invalid_credentials'));
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
        <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Auth Type Selector */}
            <div className="flex text-2xl font-semibold border-b relative">
              <Link 
                to="/signup" 
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                {t('sign_up')}
              </Link>
              <Link 
                to="/login" 
                className="flex-1 text-center py-4 text-gray-900"
              >
                {t('log_in')}
              </Link>
              {/* Active Indicator Line */}
              <div 
                className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-[#B4A481]"
              />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-3">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email_placeholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password_placeholder')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t('forgot_password')}</span>
                  <button 
                    type="button"
                    className="text-[#B4A481] hover:underline ml-2"
                  >
                    {t('reset_password')}
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {t('log_in')}
                </button>
                
                {/* Login Credentials Help */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-700 mb-1 font-medium">{t('demo_credentials')}</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>{t('provider_credentials')}</li>
                    <li>{t('admin_credentials')}</li>
                    <li>{t('user_credentials')}</li>
                  </ul>
                </div>
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

export default Login;