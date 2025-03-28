import React from 'react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import heroImage from '../../assets/starmembership.png'; // Make sure you have this image in your assets folder

const StarMembership = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[40vh] md:h-[80vh] w-full mt-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* No overlay or text on this hero image */}
      </div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">STAR Swiss Travel Association</h1>
        
        <h2 className="text-xl font-medium text-gray-700 text-center mb-8">
          Our Membership with the STAR Swiss Travel Association
        </h2>
        
        <p className="text-gray-700 mb-10">
          Waureisen is proud to be a member of the STAR Swiss Travel Association. As a member of this
          renowned Swiss travel agency association, we are committed to adhering to the highest
          quality standards and professional guidelines. This membership guarantees not only excellent
          service but also reliable and secure travel planning.
        </p>
        
        <div className="flex justify-center">
          <a 
            href="https://www.star.ch/agency-details_838"
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            View more
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StarMembership;