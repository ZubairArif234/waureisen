import React from 'react';
import {
  Utensils,
  Dog,
  Briefcase,
  Wind,
  Sparkles,
  Wifi,
  Waves,
  Tv,
} from "lucide-react";

// Icon mapping for amenities
const getAmenityIcon = (amenityName) => {
  const iconMap = {
    kitchen: Utensils,
    dogs_allowed: Dog,
    workspace: Briefcase,
    air_conditioning: Wind,
    firework_free: Sparkles,
    wifi: Wifi,
    swimming_pool: Waves,
    tv: Tv,
  };

  return iconMap[amenityName?.toLowerCase()] || Sparkles; // Default to Sparkles if no match
};

const AmenityItem = ({ name, checked, onChange }) => {
  const Icon = getAmenityIcon(name);
  
  return (
    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
      />
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#767676]" />
        <span className="text-gray-700">{name}</span>
      </div>
    </label>
  );
};

const CheckboxGroup = ({ title, description, filters, selected, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filters.map((filter) => (
          <AmenityItem
            key={filter.name}
            name={filter.name}
            checked={selected[filter.name] || false}
            onChange={() => onChange(filter.name, !selected[filter.name])}
          />
        ))}
      </div>
    </div>
  );
};

const AmenitiesForm = ({ formData, handleNestedInputChange, subsection }) => {
  // If no subsection data is provided, don't render anything
  if (!subsection) {
    return null;
  }

  // Function to handle changes for a specific subsubsection
  const handleSubsubsectionChange = (subsubsectionName, filterName, value) => {
    handleNestedInputChange(
      `amenities_${subsubsectionName.toLowerCase().replace(/\s+/g, '_')}`,
      filterName,
      value
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Amenities & Features</h2>
        <p className="text-gray-600 text-sm">Select the amenities and features available at your property.</p>
      </div>

      {/* Dynamically render subsubsections */}
      {subsection.subsubsections?.map((subsubsection) => (
        <CheckboxGroup
          key={subsubsection.name}
          title={subsubsection.name}
          description={subsubsection.description}
          filters={subsubsection.filters}
          selected={formData[`amenities_${subsubsection.name.toLowerCase().replace(/\s+/g, '_')}`] || {}}
          onChange={(filterName, value) => 
            handleSubsubsectionChange(subsubsection.name, filterName, value)
          }
        />
      ))}
    </div>
  );
};

export default AmenitiesForm;