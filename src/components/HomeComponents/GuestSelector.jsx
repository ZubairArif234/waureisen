import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const CounterButton = ({ icon: Icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
      disabled 
        ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
        : 'text-gray-600 border-gray-300 hover:border-gray-400'
    }`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

const GuestSelector = ({ isOpen, onClose, guests, onGuestsChange }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const handleIncrement = (type) => {
    onGuestsChange({
      ...guests,
      [type]: guests[type] + 1
    });
  };

  const handleDecrement = (type) => {
    if (guests[type] > 0) {
      onGuestsChange({
        ...guests,
        [type]: guests[type] - 1
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-[70]" 
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="fixed top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-80 z-[90]">
        <div className="p-6 space-y-6">
          {/* People Counter */}
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{t('people')}</span>
            <div className="flex items-center gap-4">
              <CounterButton
                icon={Minus}
                onClick={() => handleDecrement('people')}
                disabled={guests.people <= 1}
              />
              <span className="w-8 text-center text-lg">{guests.people}</span>
              <CounterButton
                icon={Plus}
                onClick={() => handleIncrement('people')}
                disabled={guests.people >= 10}
              />
            </div>
          </div>

          {/* Dogs Counter */}
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{t('dogs')}</span>
            <div className="flex items-center gap-4">
              <CounterButton
                icon={Minus}
                onClick={() => handleDecrement('dogs')}
                disabled={guests.dogs <= 0}
              />
              <span className="w-8 text-center text-lg">{guests.dogs}</span>
              <CounterButton
                icon={Plus}
                onClick={() => handleIncrement('dogs')}
                disabled={guests.dogs >= 5}
              />
            </div>
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-lg"
          >
            {t('done') || 'Done'}
          </button>
        </div>
      </div>
    </>
  );
};

export default GuestSelector;