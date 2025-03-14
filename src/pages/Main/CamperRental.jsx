import React from 'react';
import Navbar from '../../components/HomeComponents/Navbar';
import camperBg from '../../assets/camper.png';
import willyVan from '../../assets/cr1.png';  // You'll need to add these images
import walterVan from '../../assets/cr2.png'; // You'll need to add these images

const CamperRental = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] md:h-[85vh] w-full mt-20"
        style={{
          backgroundImage: `url(${camperBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Dogfriendly camper rental 🚐 🌍 ⛺️
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Welcome to our dogfriendly camper rental. Here you will find
            all the information about our two camper Willy and Walter.
          </p>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center max-w-4xl mx-auto px-4 leading-tight">
          "Traveling with a van means
          freedom and discovering places
          you never had on your radar."
        </h2>
      </div>

      {/* Camper Vans Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Willy Van */}
            <div className="flex flex-col">
            <div className="mb-4">
                <img 
                src={willyVan} 
                alt="Willy Van" 
                className="w-full rounded-lg h-[400px] md:h-[400px] object-cover"
                />
            </div>
            <button 
                className="bg-[#B4A481] text-white px-4 py-2 rounded-md text-sm w-fit"
            >
                Willy
            </button>
            </div>

            {/* Walter Van */}
            <div className="flex flex-col">
            <div className="mb-4">
                <img 
                src={walterVan} 
                alt="Walter Van" 
                className="w-full rounded-lg h-[400px]  object-cover"
                />
            </div>
            <div 
                className="text-black text-sm font-bold"
            >
                Coming soon
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default CamperRental;