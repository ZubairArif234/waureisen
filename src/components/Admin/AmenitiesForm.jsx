import React from 'react';

const CheckboxGroup = ({ title, description, filters, selected, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filters.map((filter) => (
          <label
            key={filter.name}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected[filter.name] || false}
              onChange={() => onChange(filter.name, !selected[filter.name])}
              className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
            />
            <span className="text-gray-700">{filter.name}</span>
          </label>
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