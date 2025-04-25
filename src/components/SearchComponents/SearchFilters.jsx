import React, { useState, useEffect } from 'react';
import { Calendar, Home, Filter, Dog, SlidersHorizontal } from 'lucide-react';
import FilterModal from './FilterModal';
import { accommodationTypes, mainFilters, dogFilters } from './filterData';
import MoreFiltersModal from './MoreFiltersModal';
import { useLanguage } from '../../utils/LanguageContext';

const FilterButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
      active 
        ? 'bg-brand text-white' 
        : 'border border-gray-300 hover:border-gray-400'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{label}</span>
  </button>
);

const FilterGroup = ({ options, selectedFilters, onFilterChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label 
          key={option}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedFilters.includes(option)}
            onChange={() => onFilterChange(option)}
            className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
};

const SearchFilters = ({ dateRange }) => {
  const [activeModal, setActiveModal] = useState({ isOpen: false });
  const { t } = useLanguage();
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [selectedMainFilters, setSelectedMainFilters] = useState([]);
  const [selectedDogFilters, setSelectedDogFilters] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/filters/template');
        const data = await response.json();
        const amenities = data.subsections.find(sub => sub.name === 'Amenities');
        setFilters(amenities.subsubsections.slice(0, 3));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleAccommodationChange = (accommodation) => {
    setSelectedAccommodations(prev => 
      prev.includes(accommodation)
        ? prev.filter(item => item !== accommodation)
        : [...prev, accommodation]
    );
  };

  const handleMainFilterChange = (filter) => {
    setSelectedMainFilters(prev => 
      prev.includes(filter)
        ? prev.filter(item => item !== filter)
        : [...prev, filter]
    );
  };

  const handleDogFilterChange = (filter) => {
    setSelectedDogFilters(prev => 
      prev.includes(filter)
        ? prev.filter(item => item !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="relative mt-24 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FilterButton
            icon={Calendar}
            label={dateRange}
            active={true}
          />
          {filters.map((filter, index) => (
            <FilterButton
              key={index}
              icon={Filter}
              label={filter.name}
              active={selectedFilters.some(f => f.category === filter.name)}
              onClick={() => {
                const selectedFilter = filters.find(f => f.name === filter.name);
                if (selectedFilter) {
  console.log('Filter button clicked:', selectedFilter);
console.log('Active Modal State Before:', activeModal);
console.log('Filter Data:', selectedFilter);

                  setActiveModal({ 
                    isOpen: true,
                    name: filter.name, 
                    filters: selectedFilter.filters,
                    subsubsection: selectedFilter.subsubsections?.length > 0 ? selectedFilter.subsubsections[0] : null
                  });
console.log('Active Modal State After:', {
  name: filter.name, 
  filters: selectedFilter.filters,
  subsubsection: selectedFilter.subsubsections?.length > 0 ? selectedFilter.subsubsections[0] : null
});
                  console.log('Selected Filter:', selectedFilter);
                }
              }}
            />
          ))}
          <div className="ml-auto">
          <FilterButton
            icon={SlidersHorizontal}
            label={t('more_filters')}
            active={true}
            onClick={() => setIsMoreFiltersOpen(true)}
          />
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={!!activeModal.isOpen}
        onClose={() => setActiveModal(null)}
        title={activeModal?.name}
        activeModal={activeModal || { isOpen: false }}
        onClose={() => setActiveModal({ isOpen: false })}
      >
        {/* Render filters inside modal */}
        {activeModal?.filters?.map(filter => (
          <div key={filter._id} className="space-y-3">
            <p className="text-sm text-gray-500">Type: {filter.type}</p>
            <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type={filter.type}
                className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-gray-700">{filter.name}</span>
            </label>
          </div>
        ))}
      </FilterModal>

      {/* More Filters Modal */}
      <MoreFiltersModal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
      />
    </div>
  );
};

export default SearchFilters;