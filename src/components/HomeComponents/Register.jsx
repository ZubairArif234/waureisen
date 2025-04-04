import React, { useState } from 'react';
import { PawPrint, ChevronDown, ChevronUp } from 'lucide-react';
import dogImage from '../../assets/r1.png';

const Benefit = ({ title, description, isOpen, onClick }) => {
  return (
    <div className="group">
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left group-hover:text-[#B4A481] transition-colors"
      >
        <PawPrint className="text-[#B4A481] w-4 h-4 flex-shrink-0" />
        <span className="text-sm text-white">{title}</span>
        {isOpen ? (
          <ChevronUp className="ml-auto w-4 h-4 text-[#B4A481]" />
        ) : (
          <ChevronDown className="ml-auto w-4 h-4 text-[#B4A481]" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300  ${
          isOpen ? 'max-h-20 mt-2 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const Register = () => {
  const [openBenefit, setOpenBenefit] = useState(null);

  const benefits = [
    {
      id: 1,
      title: "Increased Visibility",
      description: "🐾 Your accommodation will be showcased to dog owners specifically looking for pet-friendly stays."
    },
    {
      id: 2,
      title: "Easy Booking Process",
      description: "🐾 Quick and hassle-free bookings – optimized for both hosts and guests with dogs."
    },
    {
      id: 3,
      title: "Targeted Marketing",
      description: "🐾 We reach exactly the right audience searching for dog-friendly accommodations."
    },
    {
      id: 4,
      title: "Trust & Security",
      description: "🐾 Verified guests, secure payments, and support from our service team."
    },
    {
      id: 5,
      title: "Direct Communication",
      description: "🐾 Easily connect with dog owners to arrange individual requests."
    },
    {
      id: 6,
      title: "10% commission on the overnight price",
      description: "🐾 Fair and transparent – you only pay when a booking is made."
    }
  ];

  const handleBenefitClick = (benefitId) => {
    setOpenBenefit(openBenefit === benefitId ? null : benefitId);
  };

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
            
            <p className="text-gray-300 mb-8">
              Earn money by list your own offer with us
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map(benefit => (
                <Benefit
                  key={benefit.id}
                  title={benefit.title}
                  description={benefit.description}
                  isOpen={openBenefit === benefit.id}
                  onClick={() => handleBenefitClick(benefit.id)}
                />
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