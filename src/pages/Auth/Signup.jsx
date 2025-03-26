import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import authBg from '../../assets/bg.png';
import Footer from '../../components/Shared/Footer';
import Modal from '../../components/Auth/Modal';
import TermsContent from '../../components/Auth/TermsContent';
import PrivacyContent from '../../components/Auth/PrivacyContent';

const Signup = () => {
  const [userType, setUserType] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    phoneNumber: '',
    password: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
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
                Sign up
              </Link>
              <Link 
                to="/login" 
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                Log in
              </Link>
              {/* Active Indicator Line */}
              <div 
                className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#B4A481]"
              />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    User type
                  </label>
                  <div className="relative">
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481] appearance-none bg-white"
                    >
                      <option value="">Choose a user type</option>
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
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
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane.doe@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Jane"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                        />
                      </div>
                    </div>

                    {/* Provider-specific Fields */}
                    {userType === 'provider' && (
                      <>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            placeholder="Enter display name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
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
                        I accept the{' '}
                        <button 
                          type="button"
                          onClick={() => setIsTermsOpen(true)}
                          className="text-[#B4A481] hover:underline"
                        >
                          Terms of Service
                        </button>
                        {' '}and the{' '}
                        <button
                          type="button"
                          onClick={() => setIsPrivacyOpen(true)}
                          className="text-[#B4A481] hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    {/* Terms of Service Modal */}
                    <Modal
                      isOpen={isTermsOpen}
                      onClose={() => setIsTermsOpen(false)}
                      title="Terms of Service"
                    >
                      <TermsContent />
                    </Modal>

                     {/* Privacy Policy Modal */}
                     <Modal
                      isOpen={isPrivacyOpen}
                      onClose={() => setIsPrivacyOpen(false)}
                      title=""
                    >
                      <PrivacyContent />
                    </Modal>

                    {/* Signup Button */}
                    <button
                      type="submit"
                      disabled={!acceptTerms}
                      className={`w-full py-3 rounded-lg font-medium ${
                        acceptTerms 
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Sign up
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