import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, ChevronDown, ChevronUp } from 'lucide-react';
import dogImage from '../../assets/r1.png';
import { useLanguage } from '../../utils/LanguageContext';

const Benefit = ({ title, description, isOpen, onClick }) => {
  return (
    <div className="group">
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left group-hover:text-[#B4A481] transition-colors"
      >
        <PawPrint className="text-[#B4A481] w-4 h-4 flex-shrink-0" />
        <span className="text-sm text-white">{title}</span>
        {isOpen ? (
          <ChevronUp className="ml-auto w-4 h-4 text-[#B4A481]" />
        ) : (
          <ChevronDown className="ml-auto w-4 h-4 text-[#B4A481]" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300  ${
          isOpen ? 'max-h-20 mt-2 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const Register = () => {
  const [openBenefit, setOpenBenefit] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const benefits = [
    {
      id: 1,
      title: t('increased_visibility'),
      description: t('increased_visibility_desc')
    },
    {
      id: 2,
      title: t('easy_booking'),
      description: t('easy_booking_desc')
    },
    {
      id: 3,
      title: t('targeted_marketing'),
      description: t('targeted_marketing_desc')
    },
    {
      id: 4,
      title: t('trust_security'),
      description: t('trust_security_desc')
    },
    {
      id: 5,
      title: t('direct_communication'),
      description: t('direct_communication_desc')
    },
    {
      id: 6,
      title: t('commission'),
      description: t('commission_desc')
    }
  ];

  const handleBenefitClick = (benefitId) => {
    setOpenBenefit(openBenefit === benefitId ? null : benefitId);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#4D484D] rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-12">
            <p className="text-[#B4A481] text-sm font-medium mb-6">{t('become_host').toUpperCase()}</p>
            
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">
              {t('got_accommodations')} {' '}
              <span className="text-[#B4A481]">{t('join_us_now')}</span>
            </h2>
            
            <p className="text-gray-300 mb-8">
              {t('earn_money')}
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map(benefit => (
                <Benefit
                  key={benefit.id}
                  title={benefit.title}
                  description={benefit.description}
                  isOpen={openBenefit === benefit.id}
                  onClick={() => handleBenefitClick(benefit.id)}
                />
              ))}
            </div>

            <button 
              onClick={() => {
                // Check if user is logged in (would typically check auth state or token)
                const isUserLoggedIn = localStorage.getItem('user') || false;
                
                if (isUserLoggedIn) {
                  navigate('/host');
                } else {
                  // Redirect to signup with a redirect parameter
                  navigate('/signup?redirect=host');
                }
              }}
              className="bg-[#B4A481] text-white px-6 py-3 rounded-lg hover:bg-[#a3927b] transition-colors"
            >
              {t('register_accommodation')}
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 h-[250px] md:h-auto relative">
            <img 
              src={dogImage} 
              alt="Cozy dog under blanket" 
              className=" object-cover  h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;