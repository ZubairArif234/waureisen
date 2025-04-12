import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube} from 'lucide-react';
import { FaTiktok } from "react-icons/fa";
import logo from '../../assets/logo.png';
import Modal from '../Auth/Modal';
import TermsContent from '../Auth/TermsContent';
import FAQ from '../Footer/FAQ';
import DataPolicy from '../Footer/DataPolicy';
import { useLanguage } from '../../utils/LanguageContext';

const FooterSection = ({ title, links, onTermsClick, onDataPolicyClick, t }) => (
  <div className="flex flex-col space-y-4">
    <h3 className="text-[#4D484D] font-semibold">{title}</h3>
    <div className="flex flex-col space-y-2">
      {links.map((link, index) => {
        if (link.label === 'Terms of Service') {
          return (
            <button
              key={index}
              onClick={onTermsClick}
              className="text-left text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              {t('terms_of_service')}
            </button>
          );
        }
        if (link.label === 'Data Policy') {
          return (
            <button
              key={index}
              onClick={onDataPolicyClick}
              className="text-left text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              {t('data_policy')}
            </button>
          );
        }
        return link.external ? (
          <a
            key={index}
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {t(link.translationKey) || link.label}
          </a>
        ) : (
          <Link
            key={index}
            to={link.path}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {t(link.translationKey) || link.label}
          </Link>
        )
      })}
    </div>
  </div>
);

const Footer = () => {
  const { t } = useLanguage();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDataPolicyOpen, setIsDataPolicyOpen] = useState(false);

  const footerLinks = {
    legal: [
      { label: 'Terms of Service', path: '#', translationKey: 'terms_of_service' },
      { label: 'Imprint', path: '/imprint', translationKey: 'imprint' },
      { label: 'Data Policy', path: '/privacy', translationKey: 'data_policy' },
      { label: 'STAR membership', path: '/star-membership', translationKey: 'star_membership' }
    ],
    sitemap: [
      { label: 'Camper rental', path: '/camper-rental', translationKey: 'camper_rental' },
      { label: 'Travel shop', path: '/travelshop', translationKey: 'travel_shop' },
      { label: 'Book an appointment', path: 'https://meet.brevo.com/waureisen', external: true, translationKey: 'book_appointment' },
      { label: 'Become a host', path: '/host', translationKey: 'become_host' }
    ],
    specials: [
      { label: 'Our partner', path: '/partners', translationKey: 'partners' },
      { label: 'Travelmagazine', path: '/publicmagazine', translationKey: 'travel_magazine' },
      { label: 'Travel Insurance', path: 'https://be.erv.ch/?agency=WAUREISEN_01&lang=de', external: true, translationKey: 'travel_insurance' }
    ],
    more: [
      { label: 'About us', path: '/about-us', translationKey: 'about_us' },
      { label: 'FAQ', path: '/faq', translationKey: 'faq' },
      { label: 'Newsletter', path: 'https://91489596.sibforms.com/serve/MUIFAF7RKiUpQ7DfnIHP2yne3AHbtAygWMg737H-NfJOp6_cw77yfolND_xjtHmbCCmVLvfCdiL7hUtdtSVW6JNYOE7NR3ipyNDP-vuHMjdvdMfZxJxSh9PjXo6OPpeTBeWeLFh7pj3KvI6JDo1eaiso6GnvdceOSIdIA6oZ_8qJRtM8Lijlrumqt6kWZhMeLinfNbpefq5NyHFQ', external: true, translationKey: 'newsletter' }
    ]
  };

  return (
    <>
    <footer className="bg-white pt-12 pb-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-4 space-y-6">
            <img src={logo} alt="Wau Logo" className="h-12 ml-2" />
            <p className="text-gray-600 ml-2">
              {t('dog_friendly_platform')}
            </p>
            <div className="flex space-x-4 ml-2">
              <a href="https://www.instagram.com/waureisen/" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/people/Waureisen/61564615821969/" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.linkedin.com/company/waureisen-gmbh/" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Linkedin size={20} />
              </a>
              {/* <a href="https://www.youtube.com/channel/UCQLaDva8GTvc3WG_YAWg5BA" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://www.tiktok.com/@waureisen?_t=ZN-8tilJgcPC5O&_r=1" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <FaTiktok size={20} />
              </a> */}

            </div>
            <p className="text-gray-500 text-sm ml-2">
              {t('copyright')}
            </p>
          </div>

         {/* Right Columns */}
         <div className="md:col-span-8 md:pt-[72px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <FooterSection 
                  title={t('legal')} 
                  links={footerLinks.legal} 
                  onTermsClick={() => setIsTermsOpen(true)}
                  onDataPolicyClick={() => setIsDataPolicyOpen(true)}
                  t={t}
                />
                <FooterSection title={t('sitemap')} links={footerLinks.sitemap} t={t} />
                <FooterSection title={t('specials')} links={footerLinks.specials} t={t} />
                <FooterSection title={t('more')} links={footerLinks.more} t={t} />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title={t('terms_of_service')}
      >
        <TermsContent />
      </Modal>

      {/* Data Policy Modal */}
      <Modal
        isOpen={isDataPolicyOpen}
        onClose={() => setIsDataPolicyOpen(false)}
        title={t('data_policy')}
      >
        <DataPolicy/>
      </Modal>
    </>
  );
};

export default Footer;