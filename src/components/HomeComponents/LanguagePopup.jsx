import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const LanguagePopup = ({ isOpen, onClose, onLanguageSelect, currentLanguage }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English', region: 'United States' },
    { code: 'de', name: 'Deutsch', region: 'Deutschland' }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      
     {/* Popup */}
    <div className="fixed md:top-[300px] md:left-[825px] top-[400px] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-[101] w-[90%] max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <h2 className="text-lg md:text-xl font-semibold">{t('language_region')}</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

         {/* Translation Toggle */}
      <div className="p-4 md:p-5 bg-gray-50 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">{t('translation')}</h3>
            <p className="text-sm text-gray-500">
              {t('auto_translate')}
            </p>
          </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B4A481]"></div>
            </label>
          </div>
        </div>

        {/* Language Options */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageSelect(language.code);
                  onClose();
                }}
                className={`flex flex-col items-start p-4 rounded-lg transition-colors ${
                  currentLanguage === language.code
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{language.name}</span>
                <span className="text-sm text-gray-500">{language.region}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguagePopup;