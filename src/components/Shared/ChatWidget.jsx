import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import avatar from '../../assets/founder.jpg';

const ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <>
      {/* Contact Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-brand text-white p-4 rounded-full shadow-lg hover:bg-brand/90 transition-transform transform hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Contact Us"
      >
        <Phone className="w-6 h-6" />
      </button>

      {/* Contact Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-brand text-white rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <img 
                  src={avatar} 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{t('contact_us') || 'Contact Us'}</h3>
                <p className="text-sm opacity-90">{t('we_are_here_to_help') || 'We are here to help'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close contact popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand mb-4">
                <img 
                  src={avatar} 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{t('our_founder') || 'Our Founder'}</h3>
              <p className="text-gray-600 mb-4">{t('ready_to_assist') || 'Ready to assist with your pet-friendly travel needs'}</p>
            </div>
            
            {/* <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <h4 className="font-medium text-gray-800 mb-2">{t('call_us') || 'Call Us'}</h4>
              <div className="text-brand text-lg font-bold flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                0041 76 474 34 34
              </div>
            </div> */}
          </div>
          
          {/* Footer with action button */}
          <div className="p-4 border-t">
            <a
              href="https://calendly.com/hallo-waureisen/austausch"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-brand text-white py-3 rounded-lg text-center hover:bg-brand/90 transition-colors"
            >
              {t('schedule_callback') || 'Schedule a Callback'}
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactWidget;