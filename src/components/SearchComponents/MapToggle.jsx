import React from 'react';
import { Map, List } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const MapToggle = ({ showMap, onToggle }) => {
  const { t } = useLanguage();
  const handleClick = (e, show) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(show);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[60] lg:hidden">
      <div className="bg-white rounded-full shadow-lg p-1 flex items-center">
        <button
          onClick={(e) => handleClick(e, false)}
          className={`px-4 py-2 rounded-full flex items-center z-[60] gap-2 transition-colors ${
            !showMap ? 'bg-brand text-white' : 'text-gray-600'
          }`}
        >
          <List className="w-4 h-4" />
          <span>{t('list')}</span>
        </button>
        <button
          onClick={(e) => handleClick(e, true)}
          className={`px-4 py-2 rounded-full flex items-center z-[60] gap-2 transition-colors ${
            showMap ? 'bg-brand text-white' : 'text-gray-600'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>{t('map')}</span>
        </button>
      </div>
    </div>
  );
};

export default MapToggle;