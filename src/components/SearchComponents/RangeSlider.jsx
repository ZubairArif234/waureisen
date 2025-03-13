import React, { useState, useEffect } from 'react';

const RangeSlider = ({ 
  icon,
  label, 
  min, 
  max, 
  value, 
  onChange,
  currency = false
}) => {
  const [localValue, setLocalValue] = useState({ min: value.min, max: value.max });

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (type, newValue) => {
    const parsedValue = parseInt(newValue) || 0;
    const updatedValue = {
      ...localValue,
      [type]: parsedValue
    };
    
    // Ensure min doesn't exceed max and max doesn't go below min
    if (type === 'min' && parsedValue > localValue.max) {
      updatedValue.min = localValue.max;
    } else if (type === 'max' && parsedValue < localValue.min) {
      updatedValue.max = localValue.min;
    }

    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  // Calculate the percentage for the slider track
  const getPercentage = (value) => ((value - min) / (max - min)) * 100;
  const leftPercentage = getPercentage(localValue.min);
  const rightPercentage = getPercentage(localValue.max);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <input
          type="number"
          min={min}
          max={max}
          value={localValue.min}
          onChange={(e) => handleInputChange('min', e.target.value)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          min={min}
          max={max}
          value={localValue.max}
          onChange={(e) => handleInputChange('max', e.target.value)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
        />
        {currency && <span className="text-gray-500">CHF</span>}
      </div>

      <div className="relative w-full h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-brand rounded-full"
          style={{
            left: `${leftPercentage}%`,
            right: `${100 - rightPercentage}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue.min}
          onChange={(e) => handleInputChange('min', e.target.value)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue.max}
          onChange={(e) => handleInputChange('max', e.target.value)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default RangeSlider;