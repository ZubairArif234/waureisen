import React from 'react';
import { Check } from 'lucide-react';
import dogImage from '../../assets/r1.png';

const Register = () => {
  const benefits = [
    "Increased Visibility",
    "Easy Booking Process",
    "Targeted Marketing",
    "Trust & Security",
    "Direct Communication",
    "10% commission on the overnight price"
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#4D484D] rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-12">
            <p className="text-[#B4A481] text-sm font-medium mb-6">BECOME A HOST</p>
            
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">
              Got accommodations to offer? {' '}
              <span className="text-[#B4A481]">Join us now</span>
            </h2>
            
            <p className="text-gray-300 mb-6">
              Earn money by list your own offer with us
            </p>

            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="text-[#B4A481] w-4 h-4 flex-shrink-0" />
                  <span className="text-white text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <button 
              className="bg-[#B4A481] text-white px-6 py-3 rounded-lg hover:bg-[#a3927b] transition-colors"
            >
              Register accommodation
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 h-[250px] md:h-auto relative">
            <img 
              src={dogImage} 
              alt="Cozy dog under blanket" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;