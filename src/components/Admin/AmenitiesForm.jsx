import React from 'react';

const CheckboxGroup = ({ title, options, selected, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected[option.value]}
              onChange={() => onChange(option.value, !selected[option.value])}
              className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const AmenitiesForm = ({ formData, handleNestedInputChange }) => {
  const handleGeneralAmenityChange = (field, value) => {
    handleNestedInputChange('generalAmenities', field, value);
  };

  const handleDogFilterChange = (field, value) => {
    handleNestedInputChange('dogFilters', field, value);
  };

  const generalAmenitiesOptions = [
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Air Conditioning', value: 'airConditioning' },
    { label: 'Parking', value: 'parking' },
    { label: 'WiFi', value: 'wifi' },
    { label: 'Dedicated workspace', value: 'dedicatedWorkspace' },
    { label: 'Firework Free Zone', value: 'fireworkFreeZone' },
    { label: 'TV', value: 'tv' },
    { label: 'Swimming Pool', value: 'swimmingPool' },
    { label: 'Dogs Allowed', value: 'dogsAllowed' },
  ];

  const dogFiltersOptions = [
    { label: 'Firework Free Zone', value: 'fireworkFreeZone' },
    { label: 'Dog parks nearby', value: 'dogParksNearby' },
    { label: 'Dog-friendly restaurants nearby', value: 'dogFriendlyRestaurants' },
    { label: 'Pet supplies available', value: 'petSupplies' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Amenities & Features</h2>
        <p className="text-gray-600 text-sm">Select the amenities and features available at your property.</p>
      </div>

      {/* General Amenities */}
      <CheckboxGroup
        title="General Amenities"
        options={generalAmenitiesOptions}
        selected={formData.generalAmenities}
        onChange={handleGeneralAmenityChange}
      />

      {/* Dog Filters */}
      <CheckboxGroup
        title="Dog Filters"
        options={dogFiltersOptions}
        selected={formData.dogFilters}
        onChange={handleDogFilterChange}
      />

     
    </div>
  );
};

export default AmenitiesForm;