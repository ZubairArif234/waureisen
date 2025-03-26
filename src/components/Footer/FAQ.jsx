import React from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';
import FAQContent from './FAQContent';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <FAQContent />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;