import React, { useEffect } from 'react';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';
import FAQContent from './FAQContent';
import { changeMetaData } from '../../utils/extra';

const FAQ = () => {
  useEffect(() => {
            changeMetaData("Frequently Asked Questions - Waureisen");
          }, [])
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