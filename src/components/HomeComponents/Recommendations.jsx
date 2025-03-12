import React from 'react';
import AccommodationCard from './AccommodationCard';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const RecommendationsSection = ({ title }) => {
  const accommodations = [
    {
      image: i1,
      price: 230.00,
      location: "Room in Rio de Janeiro, Brazil",
      provider: "Waureisen"
    },
    {
      image: i2,
      price: 230.00,
      location: "Room in Rio de Janeiro, Brazil",
      provider: "Waureisen"
    },
    {
      image: i3,
      price: 230.00,
      location: "Room in Rio de Janeiro, Brazil",
      provider: "Interhome"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation, index) => (
          <AccommodationCard
            key={index}
            image={accommodation.image}
            price={accommodation.price}
            location={accommodation.location}
            provider={accommodation.provider}
          />
        ))}
      </div>
    </div>
  );
};

const Recommendations = () => {
  const sections = [
    "Our Top Recommendations",
    "Popular Accommodations",
    "Exclusive Finds"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {sections.map((title, index) => (
        <RecommendationsSection key={index} title={title} />
      ))}
    </section>
  );
};

export default Recommendations;