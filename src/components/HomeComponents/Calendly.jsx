import React from 'react';
import avatar from '../../assets/avatar.png';
import { PawPrint } from 'lucide-react';


const Calendly = () => {
  return (
    <section className="py-20 bg-[#FEFCF5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Do you have any questions?
        </h2>

        {/* Subheading with Paw Print */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <h3 className="text-xl md:text-2xl text-gray-800">
            We are here for you
          </h3>
          <PawPrint className="w-7 h-7 text-[#B4A481]" />
        </div>

        {/* Callback Button */}
        <a
          href="https://calendly.com/hallo-waureisen/austausch"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand">
            <img 
              src={avatar} 
              alt="Support Agent" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-medium text-gray-800">
            Book a callback
          </span>
        </a>
      </div>
    </section>
  );
};

export default Calendly;