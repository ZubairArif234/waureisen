import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube} from 'lucide-react';
import logo from '../../assets/logo.png';
import Modal from '../Auth/Modal';
import TermsContent from '../Auth/TermsContent';
import FAQ from '../Footer/FAQ';

const FooterSection = ({ title, links, onTermsClick }) => (
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
      { label: 'Our partner', path: '/partner' },
      { label: 'Travelmagazine', path: '/magazine' },
      { label: 'Travel Insurance', path: '/insurance' }
    ],
    more: [
      { label: 'About us', path: '/about' },
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
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#B4A481] hover:text-[#a3927b] transition-colors">
                <Youtube size={20} />
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
    </>
  );
};

export default Footer;