import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  title, 
  activeModal,
  selectedFilters,
  onFilterChange,
  onApply,
  onClear
}) => {
  const [subsubsectionFilters, setSubsubsectionFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && title) {
      setLoading(true);
      fetch(`/api/filters/template?title=${encodeURIComponent(title)}`)
        .then(response => response.json())
        .then(data => {
          const filters = data.subsections
            .flatMap(section => section.subsubsections)
            .find(sub => sub.name === title)?.filters;
          setSubsubsectionFilters(filters);
        })
        .catch(error => console.error('Error fetching filters:', error))
        .finally(() => setLoading(false));
    }
  }, [isOpen, title]);

  if (!isOpen) return null;

  const handleFilterToggle = (filterName) => {
    const isSelected = selectedFilters.includes(filterName);
    onFilterChange(filterName, !isSelected);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : (
            (subsubsectionFilters || activeModal?.subsubsection?.filters)?.map(filter => (
              <div key={filter._id} className="space-y-3">
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter.name)}
                    onChange={() => handleFilterToggle(filter.name)}
                    className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="text-gray-700">{filter.name}</span>
                </label>
              </div>
            ))
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-3 border-t bg-white mt-auto">
          <div className="flex gap-2 safe-bottom">
            <button
              onClick={onClear}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('clear')}
            </button>
            <button
              onClick={onApply}
              className="flex-1 px-3 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 transition-colors"
            >
              {t('apply')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;