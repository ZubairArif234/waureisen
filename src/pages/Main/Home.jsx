import React from 'react';
import Hero from '../../components/HomeComponents/Hero';
import Recommendations from '../../components/HomeComponents/Recommendations';
import Features from '../../components/HomeComponents/Features';
import Travellers from '../../components/HomeComponents/Travellers';
import Register from '../../components/HomeComponents/Register';
import FAQ from '../../components/HomeComponents/FAQ';

const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Recommendations />
      <Features />
      <Travellers />
      <Register />
      <FAQ />
    </main>
  );
};

export default Home;