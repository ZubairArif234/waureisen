import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import i3 from '../../assets/magazine.jpg';

const ImageGrid = ({ images, title, subtitle, link }) => (
  <div className="flex flex-col items-center w-full md:w-auto">
    <Link 
      to={link}
      className="w-full max-w-[300px] md:w-auto group" 
    >
      <div className="relative mb-4">
        <div className={`grid grid-cols-2 gap-1 p-2 bg-white rounded-xl shadow-md mx-auto ${
          images.length > 1 
            ? 'w-full md:w-[260px]' 
            : 'w-full md:w-[260px]'
        }`}>
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden ${
                images.length === 1 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className={`w-full object-cover scale-100 transition-transform duration-300 ${
                  images.length > 1 
                    ? 'h-[140px] md:h-[118px] rounded-lg group-hover:scale-110' 
                    : 'h-[280px] md:h-[240px] rounded-lg group-hover:scale-110'
                }`}
              />
            </div>
          ))}
        </div>
        <div className={`absolute inset-2 bg-gradient-to-b from-transparent to-black/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          images.length > 1 ? 'w-[244px]' : 'w-[244px]'
        }`} />
      </div>
      <div className="text-center md:text-left w-full">
        <h3 className="text-xl md:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </Link>
  </div>
);

const ProviderListings = () => {
  const yourListings = {
    images: [i1, i2, s1, s2],
    title: "Your Listings",
    subtitle: "4 properties",
    link: "/provider/your-listings"
  };

  const bookings = {
    images: [i3],
    title: "Bookings",
    subtitle: "View all bookings",
    link: "/provider/bookings"
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12 mt-20">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center md:text-left">
          Provider Dashboard
        </h1>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          <ImageGrid {...yourListings} />
          <ImageGrid {...bookings} />
        </div>
      </main>
  
      <Footer />
    </div>
  );
};

export default ProviderListings;