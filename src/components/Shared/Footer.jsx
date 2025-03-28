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

const FooterSection = ({ title, links, onTermsClick, onDataPolicyClick }) => (
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
              {link.label}
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
              {link.label}
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
            {link.label}
          </a>
        ) : (
          <Link
            key={index}
            to={link.path}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  </div>
);

const Footer = () => {

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDataPolicyOpen, setIsDataPolicyOpen] = useState(false);

  const footerLinks = {
    legal: [
      { label: 'Terms of Service', path: '#' },
      { label: 'Imprint', path: '/imprint' },
      { label: 'Data Policy', path: '/privacy' },
      { label: 'STAR membership', path: '/star-membership' }
    ],
    sitemap: [
      { label: 'Camper rental', path: '/camper-rental' },
      { label: 'Travel shop', path: '/shop' },
      { label: 'Book an appointment', path: 'https://meet.brevo.com/waureisen', external: true },
      { label: 'Become a host', path: '/host' }
    ],
    specials: [
      { label: 'Our partner', path: '/partners' },
      { label: 'Travelmagazine', path: '/publicmagazine' },
      { label: 'Travel Insurance', path: 'https://be.erv.ch/?agency=WAUREISEN_01&lang=de', external: true }
    ],
    more: [
      { label: 'About us', path: '/about-us' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Newsletter', path: 'https://91489596.sibforms.com/serve/MUIFAF7RKiUpQ7DfnIHP2yne3AHbtAygWMg737H-NfJOp6_cw77yfolND_xjtHmbCCmVLvfCdiL7hUtdtSVW6JNYOE7NR3ipyNDP-vuHMjdvdMfZxJxSh9PjXo6OPpeTBeWeLFh7pj3KvI6JDo1eaiso6GnvdceOSIdIA6oZ_8qJRtM8Lijlrumqt6kWZhMeLinfNbpefq5NyHFQ', external: true }
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
              The first Swiss booking platform for dog-friendly travel – exploring Europe with your dog! 🐶 🌍
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
              <a href="https://www.youtube.com/channel/UCQLaDva8GTvc3WG_YAWg5BA" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://www.tiktok.com/@waureisen?_t=ZN-8tilJgcPC5O&_r=1" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <FaTiktok size={20} />
              </a>

            </div>
            <p className="text-gray-500 text-sm ml-2">
              © 2025 Waureisen GmbH. All rights reserved.
            </p>
          </div>

         {/* Right Columns */}
         <div className="md:col-span-8 md:pt-[72px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <FooterSection 
                  title="Legal" 
                  links={footerLinks.legal} 
                  onTermsClick={() => setIsTermsOpen(true)}
                  onDataPolicyClick={() => setIsDataPolicyOpen(true)}
                />
                <FooterSection title="Sitemap" links={footerLinks.sitemap} />
                <FooterSection title="Specials" links={footerLinks.specials} />
                <FooterSection title="More" links={footerLinks.more} />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms of Service"
      >
        <TermsContent />
      </Modal>

      {/* Data Policy Modal */}
      <Modal
        isOpen={isDataPolicyOpen}
        onClose={() => setIsDataPolicyOpen(false)}
        title="Data Protection Policy"
      >
        <DataPolicy/>
      </Modal>
    </>
  );
};

export default Footer;