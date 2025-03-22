import React from 'react';
import { MapPin } from 'lucide-react';

const PoliciesLocationForm = ({ formData, handleInputChange, handleNestedInputChange }) => {
  const handleLocationChange = (field, value) => {
    handleNestedInputChange('location', field, value);
  };

  const handlePolicyChange = (field, value) => {
    handleNestedInputChange('policies', field, value);
  };

  const handleHouseRuleChange = (field, value) => {
    handleNestedInputChange('policies', 'houseRules', {
      ...formData.policies.houseRules,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
        <p className="text-gray-600 text-sm mb-6">Provide the location details for your property.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City/Town
            </label>
            <input
              type="text"
              id="city"
              value={formData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              placeholder="e.g. Vaz"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700">
              Full Address
            </label>
            <input
              type="text"
              id="fullAddress"
              value={formData.location.fullAddress}
              onChange={(e) => handleLocationChange('fullAddress', e.target.value)}
              placeholder="e.g. 7082 Vaz/Obervaz, Switzerland"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Map Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Map Location
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                Map preview would appear here
              </p>
              <p className="text-gray-500 text-xs mt-1">
                In the actual implementation, this would show a Google Maps view
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Drag the pin to set the exact location of your property. For privacy reasons, guests will only see the approximate location until they book.
          </p>
        </div>
      </div>

      {/* Policies Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
        <p className="text-gray-600 text-sm mb-6">Set your cancellation policy and other rules.</p>

        {/* Cancellation Policy */}
        <div className="space-y-2 mb-6">
          <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700">
            Cancellation Policy
          </label>
          <select
            id="cancellationPolicy"
            value={formData.policies.cancellationPolicy}
            onChange={(e) => handlePolicyChange('cancellationPolicy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="flexible">Flexible (Full refund 1 day prior to arrival)</option>
            <option value="moderate">Moderate (Full refund 5 days prior to arrival)</option>
            <option value="strict">Strict (50% refund up to 1 week prior to arrival)</option>
            <option value="custom">Custom Policy</option>
          </select>
        </div>

        {/* Custom Policy Details */}
        {formData.policies.cancellationPolicy === 'custom' && (
          <div className="space-y-2 mb-6">
            <label htmlFor="customPolicyDetails" className="block text-sm font-medium text-gray-700">
              Custom Policy Details
            </label>
            <textarea
              id="customPolicyDetails"
              value={formData.policies.customPolicyDetails}
              onChange={(e) => handlePolicyChange('customPolicyDetails', e.target.value)}
              placeholder="Describe your custom cancellation policy..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              rows={3}
            ></textarea>
          </div>
        )}

        {/* House Rules */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">House Rules</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.noSmoking}
                onChange={(e) => handleHouseRuleChange('noSmoking', e.target.checked)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-gray-700">No smoking</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.noParties}
                onChange={(e) => handleHouseRuleChange('noParties', e.target.checked)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-gray-700">No parties or events</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.quietHours}
                onChange={(e) => handleHouseRuleChange('quietHours', e.target.checked)}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-gray-700">Quiet hours after 10 PM</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesLocationForm;