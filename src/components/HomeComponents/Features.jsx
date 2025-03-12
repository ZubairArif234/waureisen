import React from 'react';
import { AlignLeft, Headphones, LayoutGrid, Tag } from 'lucide-react';
import s1 from '../../assets/s1.svg';
import s2 from '../../assets/s2.svg';
import s3 from '../../assets/s3.svg';
import s4 from '../../assets/s4.svg';

const FeatureCard = ({ icon: IconSrc, title, description }) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-start shadow-sm">
      <div className="mb-6">
        <img 
          src={IconSrc} 
          alt={title}
          className="w-9 h-9 text-brand" // Same size as previous icons (24px)
        />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: s1,
      title: "Unique Dog Filters",
      description: "The first booking platform with 30+ dog filters to find the perfect stay for you and your dog."
    },
    {
      icon: s2,
      title: "Personal Contact",
      description: "Book easily on your own or reach out for help anytime - we're here for your questions and requests."
    },
    {
      icon: s3,
      title: "All in One Place",
      description: "Explore our travel blog for tips on dog-friendly destinations and book travel gear conveniently."
    },
    {
      icon: s4,
      title: "Transparent Pricing",
      description: "No hidden fees - pay the same as booking directly with the accommodation."
    }
  ];

  return (
    <section className="bg-[#FEFCF5] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-lg mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Waureisen is the best choice for your next trip
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;