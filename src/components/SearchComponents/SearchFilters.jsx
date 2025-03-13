import React, { useState } from 'react';
import { Calendar, Home, Filter, Dog, SlidersHorizontal } from 'lucide-react';
import FilterModal from './FilterModal';
import { accommodationTypes, mainFilters, dogFilters } from './filterData';
import MoreFiltersModal from './MoreFiltersModal';

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
  const [activeModal, setActiveModal] = useState(null);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [selectedMainFilters, setSelectedMainFilters] = useState([]);
  const [selectedDogFilters, setSelectedDogFilters] = useState([]);

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
          <FilterButton
            icon={Home}
            label="Accommodation Type"
            active={selectedAccommodations.length > 0}
            onClick={() => setActiveModal('accommodation')}
          />
          <FilterButton
            icon={Filter}
            label="Main Filters"
            active={selectedMainFilters.length > 0}
            onClick={() => setActiveModal('main')}
          />
          <FilterButton
            icon={Dog}
            label="Dog Filters"
            active={selectedDogFilters.length > 0}
            onClick={() => setActiveModal('dog')}
          />
          <div className="ml-auto">
            <FilterButton
              icon={SlidersHorizontal}
              label="More Filters"
              active={true}
              onClick={() => setIsMoreFiltersOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Accommodation Type Modal */}
      <FilterModal
        isOpen={activeModal === 'accommodation'}
        onClose={() => setActiveModal(null)}
        title="Accommodation Type"
      >
        <FilterGroup
          options={accommodationTypes}
          selectedFilters={selectedAccommodations}
          onFilterChange={handleAccommodationChange}
        />
      </FilterModal>

      {/* Main Filters Modal */}
      <FilterModal
        isOpen={activeModal === 'main'}
        onClose={() => setActiveModal(null)}
        title="Main Filters"
      >
        <FilterGroup
          options={mainFilters}
          selectedFilters={selectedMainFilters}
          onFilterChange={handleMainFilterChange}
        />
      </FilterModal>

      {/* Dog Filters Modal */}
      <FilterModal
        isOpen={activeModal === 'dog'}
        onClose={() => setActiveModal(null)}
        title="Dog Filters"
      >
        <FilterGroup
          options={dogFilters}
          selectedFilters={selectedDogFilters}
          onFilterChange={handleDogFilterChange}
        />
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