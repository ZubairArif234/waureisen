import React from 'react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DateRangePicker from '../HomeComponents/DateRangePicker';


const BasicInfoForm = ({ formData, handleInputChange, handleNestedInputChange }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    start: formData.availability.checkInDate ? new Date(formData.availability.checkInDate) : null,
    end: formData.availability.checkOutDate ? new Date(formData.availability.checkOutDate) : null
  });

  const handleRangeSelect = (range) => {
    console.log("Date range selected:", range); // Debug log
    setSelectedRange(range);
    
    // Always update checkInDates with the current state
    if (range.start && range.end) {
      // Format dates for display and storage
      const formattedStart = range.start.toISOString().split('T')[0];
      const formattedEnd = range.end.toISOString().split('T')[0];
      const dateRangeString = `${formattedStart} - ${formattedEnd}`;
      
      // Update all necessary date fields
      handleNestedInputChange('availability', 'checkInDate', formattedStart);
      handleNestedInputChange('availability', 'checkOutDate', formattedEnd);
      handleNestedInputChange('availability', 'checkInDates', dateRangeString);
      
      setIsDatePickerOpen(false);
    } else if (range.start) {
      // If only start date is selected, still update checkInDates
      const formattedStart = range.start.toISOString().split('T')[0];
      handleNestedInputChange('availability', 'checkInDate', formattedStart);
      handleNestedInputChange('availability', 'checkOutDate', '');
      handleNestedInputChange('availability', 'checkInDates', formattedStart);
    } else {
      // Clear all date fields if no dates are selected
      handleNestedInputChange('availability', 'checkInDate', '');
      handleNestedInputChange('availability', 'checkOutDate', '');
      handleNestedInputChange('availability', 'checkInDates', '');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600 text-sm">Enter the essential details about the accommodation.</p>
      </div>

      {/* Listing Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Listing Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g. Modern and Luxury 1BHK Studio/Self Check-in/Eiffle"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
      </div>

      {/* Property Type & Listing Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="Studio">Studio</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Cabin">Cabin</option>
            <option value="Chalet">Chalet</option>
            <option value="Hotel">Hotel</option>
            <option value="Holiday Home">Holiday Home</option>
            <option value="Tiny House">Tiny House</option>
            <option value="Holiday Apartment">Holiday Apartment</option>
            <option value="Bungalow">Bungalow</option>
            <option value="House Boat">House Boat</option>
            <option value="Guest House">Guest House</option>
            <option value="Yurt">Yurt</option>
            <option value="Log Cabin">Log Cabin</option>
            <option value="Camper Van">Camper Van</option>
            <option value="Farm House">Farm House</option>
            <option value="Tent">Tent</option>
            <option value="Tree House">Tree House</option>
          </select>

           {/* Room Category input - only shows when Hotel is selected */}
    {formData.propertyType === 'Hotel' && (
      <div className="mt-4">
        <label htmlFor="roomCategory" className="block text-sm font-medium text-gray-700">
          Room Category
        </label>
        <input
          type="text"
          id="roomCategory"
          value={formData.roomCategory || ''}
          onChange={(e) => handleInputChange('roomCategory', e.target.value)}
          placeholder="e.g. Deluxe Room, Suite, etc."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
      </div>
    )}
        </div>

        <div className="space-y-2">
          <label htmlFor="listingSource" className="block text-sm font-medium text-gray-700">
            Listing Source
          </label>
          <input
            type="text"
            id="listingSource"
            value={formData.listingSource}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>
      </div>

      {/* Capacity Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Capacity</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">People</label>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Up to</span>
              <select
                value={formData.capacity.people}
                onChange={(e) => handleNestedInputChange('capacity', 'people', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[...Array(25)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dogs</label>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Up to</span>
              <select
                value={formData.capacity.dogs}
                onChange={(e) => handleNestedInputChange('capacity', 'dogs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Up to</span>
              <select
                value={formData.capacity.bedrooms}
                onChange={(e) => handleNestedInputChange('capacity', 'bedrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rooms</label>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Up to</span>
              <select
                value={formData.capacity.rooms}
                onChange={(e) => handleNestedInputChange('capacity', 'rooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[...Array(15)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Washrooms</label>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Up to</span>
              <select
                value={formData.capacity.washrooms}
                onChange={(e) => handleNestedInputChange('capacity', 'washrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Regular Price per Night</label>
            <div className="flex">
              <select
                value={formData.pricing.currency}
                onChange={(e) => handleNestedInputChange('pricing', 'currency', e.target.value)}
                className="w-auto px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
              <input
                type="number"
                value={formData.pricing.regularPrice}
                onChange={(e) => handleNestedInputChange('pricing', 'regularPrice', parseInt(e.target.value))}
                className="w-full px-3 py-2 border-y border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Discounted Price per Night</label>
            <div className="flex">
              <select
                value={formData.pricing.currency}
                disabled
                className="w-auto px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="CHF">CHF</option>
              </select>
              <input
                type="number"
                value={formData.pricing.discountedPrice}
                onChange={(e) => handleNestedInputChange('pricing', 'discountedPrice', parseInt(e.target.value))}
                className="w-full px-3 py-2 border-y border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability Section */}
<div className="space-y-4">
  <h3 className="text-lg font-medium text-gray-900">Availability</h3>
  
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Check-in/Check-out Dates
      </label>
      <div 
        className="relative border border-gray-300 rounded-md px-3 py-2 cursor-pointer flex items-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDatePickerOpen(true);
        }}
      >
        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-sm text-gray-700">
          {selectedRange.start && selectedRange.end ? (
            `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`
          ) : selectedRange.start ? (
            `${selectedRange.start.toLocaleDateString()} - Select check-out date`
          ) : (
            'Select check-in and check-out dates'
          )}
        </span>
      </div>
    </div>

    {/* Check-in and Check-out Times */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Check-in Time
        </label>
        <div className="flex">
          <select
            value={formData.availability.checkInTime?.hour || ""}
            onChange={(e) => handleNestedInputChange('availability', 'checkInTime', {
              ...formData.availability.checkInTime || {},
              hour: e.target.value
            })}
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3"
          >
            <option value="">Hour</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select
            value={formData.availability.checkInTime?.period || ""}
            onChange={(e) => handleNestedInputChange('availability', 'checkInTime', {
              ...formData.availability.checkInTime || {},
              period: e.target.value
            })}
            className="w-20 border-t border-b border-r border-gray-300 rounded-r-md py-2 px-3"
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Check-out Time
        </label>
        <div className="flex">
          <select
            value={formData.availability.checkOutTime?.hour || ""}
            onChange={(e) => handleNestedInputChange('availability', 'checkOutTime', {
              ...formData.availability.checkOutTime || {},
              hour: e.target.value
            })}
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3"
          >
            <option value="">Hour</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select
            value={formData.availability.checkOutTime?.period || ""}
            onChange={(e) => handleNestedInputChange('availability', 'checkOutTime', {
              ...formData.availability.checkOutTime || {},
              period: e.target.value
            })}
            className="w-20 border-t border-b border-r border-gray-300 rounded-r-md py-2 px-3"
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="instantBooking" className="text-sm font-medium text-gray-700">
          Allow Instant Booking
        </label>
        <div className="relative inline-block w-10 align-middle select-none">
          <input
            type="checkbox"
            id="instantBooking"
            checked={formData.availability.allowInstantBooking}
            onChange={(e) => handleNestedInputChange('availability', 'allowInstantBooking', e.target.checked)}
            className="absolute block w-6 h-6 bg-white border-2 border-gray-300 rounded-full appearance-none cursor-pointer checked:right-0 checked:border-brand checked:bg-brand"
          />
          <label
            htmlFor="instantBooking"
            className="block h-6 overflow-hidden bg-gray-200 rounded-full cursor-pointer"
          ></label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="activeListing" className="text-sm font-medium text-gray-700">
          Active Listing
        </label>
        <div className="relative inline-block w-10 align-middle select-none">
          <input
            type="checkbox"
            id="activeListing"
            checked={formData.availability.active}
            onChange={(e) => handleNestedInputChange('availability', 'active', e.target.checked)}
            className="absolute block w-6 h-6 bg-white border-2 border-gray-300 rounded-full appearance-none cursor-pointer checked:right-0 checked:border-brand checked:bg-brand"
          />
          <label
            htmlFor="activeListing"
            className="block h-6 overflow-hidden bg-gray-200 rounded-full cursor-pointer"
          ></label>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Date Range Picker */}
<DateRangePicker
  isOpen={isDatePickerOpen}
  onClose={() => setIsDatePickerOpen(false)}
  selectedRange={selectedRange}
  onRangeSelect={handleRangeSelect}
  availableDates={[]}
/>
    </div>

    
  );
};

export default BasicInfoForm;