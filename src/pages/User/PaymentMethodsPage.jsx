import React, { useState } from 'react';
import { ArrowLeft, Edit3, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

const InputField = ({ label, type = "text", placeholder, optional = false, value, onChange, name }) => (
  <div className="space-y-2">
    <label className="flex text-sm font-medium text-gray-700">
      {label}
      {optional && <span className="ml-1 text-gray-500">• optional</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
    />
  </div>
);

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    streetAddress: '',
    aptNumber: '',
    postalCode: '',
    city: '',
    state: '',
    country: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/account')}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Payment methods
              </h1>
            </div>
            <p className="text-gray-600">
              Add a payment method to easily pay for your bookings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Payment Card Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment card details
              </h2>
              
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card number"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-green-900 text-green-400 rounded text-sm font-medium"
                >
                  Autofill
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                I authorise Waureisen to send instructions to the financial institution that issued my
                card to take payments from my card account in accordance with the terms of my
                agreement with you.
              </p>
            </div>

            {/* Billing Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Billing details
              </h2>
              
              <div className="space-y-6">
                <InputField
                  label="Card holder's name"
                  name="cardHolder"
                  placeholder="Name on card"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Street address"
                    name="streetAddress"
                    placeholder="Enter street address"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Apt #"
                    name="aptNumber"
                    placeholder="Enter apartment number"
                    value={formData.aptNumber}
                    onChange={handleInputChange}
                    optional
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Postal code"
                    name="postalCode"
                    placeholder="Enter postal code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="City"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="State"
                    name="state"
                    placeholder="Enter your state"
                    value={formData.state}
                    onChange={handleInputChange}
                    optional
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="">Select a country...</option>
                      <option value="CH">Switzerland</option>
                      <option value="DE">Germany</option>
                      <option value="CH">Austria</option>
                      <option value="FI">Finland</option>
                      <option value="CH">France</option>
                      <option value="CH">Italy</option>
                      <option value="CH">The Netherlands</option>
                      <option value="CH">Denmark</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
            >
              Save payment card
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentMethodsPage;