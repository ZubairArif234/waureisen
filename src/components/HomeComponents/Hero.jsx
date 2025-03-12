import React from 'react';
import Navbar from './Navbar';
import { Search, Calendar, Users } from 'lucide-react';
import bgImage from '../../assets/bg.png';

const Hero = () => {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 w-full h-full"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
  
        {/* Navbar */}
        <Navbar />
  
        {/* Hero Content */}
        <div className="relative z-10 pt-40 md:pt-56 min-h-screen flex items-center">
          <div className="w-full px-4 md:px-6">
            <div className="max-w-5xl mx-auto">  {/* Changed from max-w-3xl to max-w-5xl */}
              <div className="md:max-w-2xl pl-4 md:pl-0">  {/* Added container for text content */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 font-poppins">
                  Urlaub mit Hund
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white mb-8 font-bold font-poppins">
                  Finden Sie die passende Unterkunft
                </p>
              </div>
  
              {/* Search Bar Container */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
                {/* Where Input */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                    <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Where"
                      className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-500"
                    />
                  </div>
                </div>
  
                {/* When Input */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="When"
                      className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-500"
                    />
                  </div>
                </div>
  
                {/* People & Dog Input */}
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
                    <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 text-sm">1 people, 1 dog</span>
                  </div>
                </div>
  
                {/* Search Button */}
                <button
                  className="w-full md:w-auto px-8 py-3 rounded-lg text-sm text-white font-medium flex-shrink-0"
                  style={{ backgroundColor: '#B4A481' }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Hero;