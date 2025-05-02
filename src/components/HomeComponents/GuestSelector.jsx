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
        : 'text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
    }`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

const GuestSelector = ({ 
  guests, 
  onChange, 
  onClose,
  maxGuests = 20, // Changed default max guests to 20
  maxDogs = 20    // Changed default max dogs to 20
}) => {
  const { t } = useLanguage();

  const handleIncrement = (type) => {
    if (type === 'people' && guests.people < maxGuests) {
      onChange({ ...guests, people: guests.people + 1 });
    } else if (type === 'dogs' && guests.dogs < maxDogs) {
      onChange({ ...guests, dogs: guests.dogs + 1 });
    }
  };

  const handleDecrement = (type) => {
    if (type === 'people' && guests.people > 1) {
      onChange({ ...guests, people: guests.people - 1 });
    } else if (type === 'dogs' && guests.dogs > 0) {
      onChange({ ...guests, dogs: guests.dogs - 1 });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">{t('guests').charAt(0).toUpperCase() + t('guests').slice(1)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <CounterButton 
              icon={Minus} 
              onClick={() => handleDecrement('people')}
              disabled={guests.people <= 1}
            />
            <span className="w-8 text-center">{guests.people}</span>
            <CounterButton 
              icon={Plus} 
              onClick={() => handleIncrement('people')}
              disabled={guests.people >= maxGuests}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{t('dogs').charAt(0).toUpperCase() + t('dogs').slice(1)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <CounterButton 
              icon={Minus} 
              onClick={() => handleDecrement('dogs')}
              disabled={guests.dogs <= 0}
            />
            <span className="w-8 text-center">{guests.dogs}</span>
            <CounterButton 
              icon={Plus} 
              onClick={() => handleIncrement('dogs')}
              disabled={guests.dogs >= maxDogs}
            />
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark transition-colors"
      >
        {t('apply')}
      </button>
    </div>
  );
};

export default GuestSelector;