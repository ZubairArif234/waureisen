import React, { useState } from 'react';
import { 
  Users, Dog, Lock, Bath, DollarSign, Tv, ChefHat, Eclipse,
  Baby, Waves, UtensilsCrossed, Car, Mountain, Dumbbell, Cigarette,
  Accessibility, X
} from 'lucide-react';
import RangeSlider from './RangeSlider';
import * as filterData from './moreFiltersData';

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
  const [ranges, setRanges] = useState({
    people: { min: 1, max: 25 },
    dogs: { min: 0, max: 25 },
    rooms: { min: 1, max: 25 },
    bathrooms: { min: 1, max: 25 },
    price: { min: 1, max: 10000 }
  });

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

  const handleSelectionChange = (category, option) => {
    setSelected(prev => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter(item => item !== option)
        : [...prev[category], option]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
       <div 
    className="fixed inset-0 bg-black bg-opacity-10 z-100"
    onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-50 max-h-[90vh] md:max-h-[85vh] md:w-[800px] w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">More Filters</h2>
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
            label="Max. people"
            min={1}
            max={25}
            value={ranges.people}
            onChange={(value) => setRanges(prev => ({ ...prev, people: value }))}
          />
          <RangeSlider
            icon={<Dog className="w-5 h-5 text-gray-400" />}
            label="Max. dogs"
            min={0}
            max={25}
            value={ranges.dogs}
            onChange={(value) => setRanges(prev => ({ ...prev, dogs: value }))}
          />
          <RangeSlider
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            label="No. of room"
            min={1}
            max={25}
            value={ranges.rooms}
            onChange={(value) => setRanges(prev => ({ ...prev, rooms: value }))}
          />
          <RangeSlider
            icon={<Bath className="w-5 h-5 text-gray-400" />}
            label="No. of bathroom"
            min={1}
            max={25}
            value={ranges.bathrooms}
            onChange={(value) => setRanges(prev => ({ ...prev, bathrooms: value }))}
          />
          <RangeSlider
            icon={<DollarSign className="w-5 h-5 text-gray-400" />}
            label="Price per person/night in CHF from"
            min={1}
            max={10000}
            value={ranges.price}
            onChange={(value) => setRanges(prev => ({ ...prev, price: value }))}
            currency
          />

          {/* Checkboxes */}
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
              onClick={() => {
                setRanges({
                  people: { min: 1, max: 25 },
                  dogs: { min: 0, max: 25 },
                  rooms: { min: 1, max: 25 },
                  bathrooms: { min: 1, max: 25 },
                  price: { min: 1, max: 10000 }
                });
                setSelected({
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
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreFiltersModal;