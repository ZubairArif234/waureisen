import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const WelcomeCustomerModal = ({ isOpen, onClose, title, children ,onConfirm}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-[100]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-[100] max-h-[90vh] md:max-h-[75vh] md:w-[400px] w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {children}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-3 border-t bg-white mt-auto">
          <div className="flex gap-2 safe-bottom">
          
<button
  onClick={onConfirm}
  className="flex-1 px-3 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors"
>
  {t('continue')}
</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeCustomerModal;