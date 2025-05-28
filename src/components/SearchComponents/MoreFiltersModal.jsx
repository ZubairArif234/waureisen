import React, { useState, useEffect } from 'react';
import { 
  Users, Dog, Lock, Bath, DollarSign, Tv, ChefHat, Eclipse,
  Baby, Waves, UtensilsCrossed, Car, Mountain, Dumbbell, Cigarette,
  Accessibility, X
} from 'lucide-react';
import RangeSlider from './RangeSlider';
import * as filterData from './moreFiltersData';
import { useLanguage } from '../../utils/LanguageContext';
import { usePriceFilter } from '../../context/PriceFilterContext';
import { useSearchFilters } from '../../context/SearchFiltersContext';

const FilterSection = ({ icon, title, options, selected, onChange }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-gray-700 font-medium">{title}</h3>
    </div>
    <div className="space-y-3">
      {options.map((option) => (
        <label 
          key={option}
          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const MoreFiltersModal = ({ isOpen, onClose }) => {
  const { priceRange, setPriceRange, setIsPriceFilterActive } = usePriceFilter();
  const { searchFilters, updateFilters } = useSearchFilters();
  const [filters, setFilters] = useState([]);
  const { t } = useLanguage();
  const [ranges, setRanges] = useState(searchFilters.ranges);
  const [selected, setSelected] = useState({
    accommodation: [],
    kitchen: [],
    pool: [],
    wellness: [],
    kids: [],
    water: [],
    catering: [],
    parking: [],
    view: [],
    sport: [],
    smoking: [],
    accessibility: []
  });

  // Initialize selected state from searchFilters when component mounts
  useEffect(() => {
    if (searchFilters.selected) {
      setSelected(prev => ({
        ...prev,
        ...searchFilters.selected
      }));
    }
  }, []);

  // Update local state when global filters change
  useEffect(() => {
    if (searchFilters.ranges) {
      setRanges(searchFilters.ranges);
    }
    if (searchFilters.selected) {
      setSelected(prev => ({
        ...prev,
        ...searchFilters.selected
      }));
    }
  }, [searchFilters]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/filters/template');
        const data = await response.json();
        const amenities = data.subsections.find(sub => sub.name === 'Amenities');
        setFilters(amenities);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    if (isOpen) {
      fetchFilters();
    }
  }, [isOpen]);

  useEffect(() => {
    setRanges(prev => ({
      ...prev,
      price: priceRange
    }));
  }, [priceRange]);

  const handleSelectionChange = (category, option) => {
    // Ensure the category exists in the state
    if (!selected[category]) {
      selected[category] = [];
    }
    
    const newSelected = {
      ...selected,
      [category]: selected[category].includes(option)
        ? selected[category].filter(item => item !== option)
        : [...selected[category], option]
    };
    
    console.log('MoreFiltersModal - Selected filters updated:', newSelected);
    
    // Update local state first
    setSelected(newSelected);
    
    // Then update global context in the next tick
    setTimeout(() => {
      updateFilters({ selected: newSelected });
    }, 0);
  };

  const handleApplyFilters = () => {
    // Update the global price filter
    setPriceRange(ranges.price);
    setIsPriceFilterActive(true);

    // Create filter object with all selected filters
    const filterObject = {
      ranges: {
        ...ranges,
        price: {
          min: Number(ranges.price.min) || 0,
          max: Number(ranges.price.max) || 10000
        }
      },
      selected
    };

    console.log('MoreFiltersModal - Current selected state:', selected);
    console.log('MoreFiltersModal - Current ranges state:', ranges);
    console.log('MoreFiltersModal - Applying filters:', filterObject);

    // Update search filters context
    updateFilters(filterObject);

    // Get current URL parameters
    const searchParams = new URLSearchParams(window.location.search);

    // Add filters to URL parameters
    searchParams.set('searchFilters', JSON.stringify(filterObject));

    // Trigger a new search by updating the URL with a timestamp
    searchParams.set('_t', Date.now());
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    // Dispatch a popstate event to trigger URL change handlers
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Close modal
    onClose();
  };

  const handleClearFilters = () => {
    const defaultPriceRange = { min: 0, max: 10000 };
    setPriceRange(defaultPriceRange);
    setIsPriceFilterActive(false);
    
    const defaultRanges = {
      people: { min: 1, max: 25 },
      dogs: { min: 0, max: 25 },
      rooms: { min: 1, max: 25 },
      bathrooms: { min: 1, max: 25 },
      price: defaultPriceRange
    };

    const defaultSelected = {
      accommodation: [],
      kitchen: [],
      pool: [],
      wellness: [],
      kids: [],
      water: [],
      catering: [],
      parking: [],
      view: [],
      sport: [],
      smoking: [],
      accessibility: []
    };

    setRanges(defaultRanges);
    setSelected(defaultSelected);
    
    // Clear global filters
    updateFilters({
      ranges: defaultRanges,
      selected: defaultSelected
    });
  };

  if (!isOpen || !filters) return null;

  return (
    <>
       <div 
    className="fixed inset-0 bg-black bg-opacity-10 z-100"
    onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-50 max-h-[90vh] md:max-h-[85vh] md:w-[800px] w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">{t('more_filters')}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] md:max-h-[calc(85vh-140px)]">
          {/* Range Sliders */}
          <RangeSlider
            icon={<Users className="w-5 h-5 text-gray-400" />}
            label={t("max_people")}
            min={1}
            max={25}
            value={ranges.people}
            onChange={(value) => setRanges(prev => ({ ...prev, people: value }))}
          />
          <RangeSlider
            icon={<Dog className="w-5 h-5 text-gray-400" />}
            label={t("max_dog")}
            min={0}
            max={25}
            value={ranges.dogs}
            onChange={(value) => setRanges(prev => ({ ...prev, dogs: value }))}
          />
          <RangeSlider
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            label={t("no_of_rooms")}
            min={1}
            max={25}
            value={ranges.rooms}
            onChange={(value) => setRanges(prev => ({ ...prev, rooms: value }))}
          />
          <RangeSlider
            icon={<Bath className="w-5 h-5 text-gray-400" />}
            label={t("no_of_bathroom")}
            min={1}
            max={25}
            value={ranges.bathrooms}
            onChange={(value) => setRanges(prev => ({ ...prev, bathrooms: value }))}
          />
          <RangeSlider
            icon={<DollarSign className="w-5 h-5 text-gray-400" />}
            label={t("price_night")}
            min={0}
            max={10000}
            value={ranges.price}
            onChange={(value) => setRanges(prev => ({ ...prev, price: value }))}
            currency
          />

          {/* Dynamic Filters */}
          {filters.subsubsections?.map(subsection => (
            <div key={subsection._id} className="mb-8">
              <h3 className="text-gray-700 font-medium mb-4">{t(subsection.name)}</h3>
              <div className="space-y-3">
                {subsection.filters?.map(filter => {
                  const category = subsection.name.toLowerCase();
                  // Ensure the category exists in selected state
                  if (!selected[category]) {
                    selected[category] = [];
                  }
                  return (
                    <label key={filter._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type={filter.type}
                        checked={selected[category]?.includes(filter.name)}
                        onChange={() => handleSelectionChange(category, filter.name)}
                        className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                      />
                      <span className="text-gray-700">{t(filter.name)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <FilterSection
            icon={<Tv className="w-5 h-5 text-gray-400" />}
            title="Accommodation features"
            options={filterData.accommodationFeatures}
            selected={selected.accommodation}
            onChange={(option) => handleSelectionChange('accommodation', option)}
          />
          <FilterSection
            icon={<ChefHat className="w-5 h-5 text-gray-400" />}
            title="Kitchen facilities"
            options={filterData.kitchenFeatures}
            selected={selected.kitchen}
            onChange={(option) => handleSelectionChange('kitchen', option)}
          />
          <FilterSection
            icon={<Waves className="w-5 h-5 text-gray-400" />}
            title="Pool"
            options={filterData.poolFeatures}
            selected={selected.pool}
            onChange={(option) => handleSelectionChange('pool', option)}
          />
          <FilterSection
            icon={<Eclipse className="w-5 h-5 text-gray-400" />}
            title="Wellness / Spa / Pool"
            options={filterData.wellnessFeatures}
            selected={selected.wellness}
            onChange={(option) => handleSelectionChange('wellness', option)}
          />
          <FilterSection
            icon={<Baby className="w-5 h-5 text-gray-400" />}
            title="For the kids"
            options={filterData.kidFeatures}
            selected={selected.kids}
            onChange={(option) => handleSelectionChange('kids', option)}
          />
          <FilterSection
            icon={<Waves className="w-5 h-5 text-gray-400" />}
            title="Water nearby"
            options={filterData.waterFeatures}
            selected={selected.water}
            onChange={(option) => handleSelectionChange('water', option)}
          />
          <FilterSection
            icon={<UtensilsCrossed className="w-5 h-5 text-gray-400" />}
            title="Catering"
            options={filterData.cateringOptions}
            selected={selected.catering}
            onChange={(option) => handleSelectionChange('catering', option)}
          />
          <FilterSection
            icon={<Car className="w-5 h-5 text-gray-400" />}
            title="Parking"
            options={filterData.parkingOptions}
            selected={selected.parking}
            onChange={(option) => handleSelectionChange('parking', option)}
          />
          <FilterSection
            icon={<Mountain className="w-5 h-5 text-gray-400" />}
            title="View"
            options={filterData.viewOptions}
            selected={selected.view}
            onChange={(option) => handleSelectionChange('view', option)}
          />
          <FilterSection
            icon={<Dumbbell className="w-5 h-5 text-gray-400" />}
            title="Sport"
            options={filterData.sportFeatures}
            selected={selected.sport}
            onChange={(option) => handleSelectionChange('sport', option)}
          />
          <FilterSection
            icon={<Cigarette className="w-5 h-5 text-gray-400" />}
            title="Smoking"
            options={filterData.smokingOptions}
            selected={selected.smoking}
            onChange={(option) => handleSelectionChange('smoking', option)}
          />
          <FilterSection
            icon={<Accessibility className="w-5 h-5 text-gray-400" />}
            title="Accessibility"
            options={filterData.accessibilityFeatures}
            selected={selected.accessibility}
            onChange={(option) => handleSelectionChange('accessibility', option)}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex gap-4">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('clear_all')}
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              {t('show_results')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreFiltersModal;