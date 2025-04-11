import React from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HostRegistration = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 px-5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </button>
        
        <h1 className="text-4xl font-bold mb-8 text-center">Become a Host</h1>
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg mb-6">
            Join our community of dog-friendly accommodation providers and start earning income while creating wonderful experiences for guests and their furry companions.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Benefits of Hosting with Waureisen</h2>
          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>Reach a targeted audience of dog owners looking for pet-friendly stays</li>
            <li>Flexible hosting options - rent your entire property or just a room</li>
            <li>Set your own availability, prices, and house rules</li>
            <li>24/7 host support and dedicated account management</li>
            <li>Professional photography and listing optimization assistance</li>
            <li>Comprehensive host insurance and damage protection</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal ml-6 mb-8 space-y-3">
            <li>
              <strong>Create your listing</strong> - Add photos, description, and set your price
            </li>
            <li>
              <strong>Welcome guests and their dogs</strong> - Provide a memorable stay experience
            </li>
            <li>
              <strong>Get paid</strong> - Receive secure payments for each booking
            </li>
          </ol>
          
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-8">
            Complete our simple registration process and start hosting in as little as 24 hours.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => {
                // Check if user is logged in (would typically check auth state or token)
                const isUserLoggedIn = localStorage.getItem('user') || false;
                
                if (isUserLoggedIn) {
                  navigate('/provider/registration');
                } else {
                  // Redirect to signup with a redirect parameter
                  navigate('/signup?redirect=provider-registration');
                }
              }}
              className="bg-brand hover:bg-brand/90 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300"
            >
              Register as a Host
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostRegistration;