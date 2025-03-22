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
              className="rounded border-gray-300 text-brand focus:ring-brand"
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

      {/* Additional Custom Amenities */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Additional Amenities</h3>
        <p className="text-gray-600 text-sm">Need to add a custom amenity? Let us know and we'll consider adding it to our system.</p>
        
        <textarea
          placeholder="Example: Dog bed provided, Fenced garden up to 1.5m, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          rows={3}
        ></textarea>
        
        <p className="text-xs text-gray-500">
          These amenities won't be added automatically to your listing. Our team will review and add them if appropriate.
        </p>
      </div>
    </div>
  );
};

export default AmenitiesForm;