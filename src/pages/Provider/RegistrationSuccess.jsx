import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  
  const nextSteps = [
    {
      step: 1,
      title: 'Complete Your Profile',
      description: 'Add a profile photo and verify your identity to build trust with guests.',
      action: 'Complete Profile',
      link: '/provider/profile'
    },
    {
      step: 2,
      title: 'Create Your First Listing',
      description: 'Add details, photos, and pricing information for your property.',
      action: 'Create Listing',
      link: '/provider/create-listing'
    },
    {
      step: 3,
      title: 'Set Up Your Calendar',
      description: 'Mark your availability and block dates when your property isn\'t available.',
      action: 'Set Calendar',
      link: '/provider/calendar'
    },
    {
      step: 4,
      title: 'Connect Payment Methods',
      description: 'Add or verify your payment details to receive payouts for bookings.',
      action: 'Payment Setup',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Your provider account has been created. We've sent a confirmation email with additional details.
          </p>
        </div>
        
        {/* Welcome card */}
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Waureisen</h2>
          <p className="text-gray-600 mb-4">
            Thank you for joining our community of dog-friendly accommodations. We're excited to have you as a partner and are here to help you succeed.
          </p>
          <p className="text-gray-600">
            Your provider dashboard is now available, where you can manage your listings, bookings, and earnings.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="px-5 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Next steps */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {nextSteps.map((item) => (
            <div key={item.step} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button
                    onClick={() => navigate(item.link)}
                    className="text-brand hover:underline flex items-center gap-1"
                  >
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Support section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Need help getting started?</h2>
          <p className="text-gray-600 mb-4">
            Our team is here to support you. Get answers to common questions, learn best practices, or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/support')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Help Center
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationSuccess;