import React from 'react';
import { AlignLeft, Headphones, LayoutGrid, Tag } from 'lucide-react';
import s1 from '../../assets/s1.svg';
import s2 from '../../assets/s2.svg';
import s3 from '../../assets/s3.svg';
import s4 from '../../assets/s4.svg';
import { useLanguage } from '../../utils/LanguageContext';

const FeatureCard = ({ icon: IconSrc, title, description }) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center"> {/* Changed items-start to items-center */}
      <div className="mb-6 flex justify-center"> {/* Added flex justify-center */}
        <img 
          src={IconSrc} 
          alt={title}
          className="w-9 h-9 text-brand"
        />
      </div>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 text-center">{title}</h3> {/* Added text-center */}
      <p className="text-gray-600 leading-relaxed text-center">{description}</p> {/* Added text-center */}
    </div>
  );
};

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: s1,
      title: t('unique_dog_filters'),
      description: t('unique_dog_filters_desc')
    },
    {
      icon: s2,
      title: t('personal_contact'),
      description: t('personal_contact_desc')
    },
    {
      icon: s3,
      title: t('all_in_one_place'),
      description: t('all_in_one_place_desc')
    },
    {
      icon: s4,
      title: t('transparent_pricing'),
      description: t('transparent_pricing_desc')
    }
  ];

  return (
    <section className="bg-[#FEFCF5] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-lg mb-3">{t('features')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('why_waureisen_best')}
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