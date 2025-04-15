import React from 'react';
import { ListPlus, Type, Heading } from 'lucide-react';

const DescriptionForm = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-600 text-sm">Provide detailed information about your property.</p>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
          Short Description
        </label>
        <input
          type="text"
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Modern and Luxury 1BHK Studio with self check-in in a prime location"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
        <p className="text-xs text-gray-500">
          A brief description that appears in search results. Keep it concise but informative.
        </p>
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700">
          Full Description
        </label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <textarea
            id="fullDescription"
            value={formData.fullDescription}
            onChange={(e) => handleInputChange('fullDescription', e.target.value)}
            placeholder="Provide a detailed description of your property, including special features, nearby attractions, and anything else that makes it unique."
            className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0"
            rows={10}
          ></textarea>
          
          {/* Text Editor Toolbar */}
          <div className="border-t p-2 bg-gray-50 flex gap-2">
            <button
              type="button"
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Add Bullet Point"
            >
              <ListPlus className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Add Paragraph"
            >
              <Type className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Add Heading"
            >
              <Heading className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Use formatting to make your description easier to read. You can use bullet points, paragraphs, and headings.
        </p>
      </div>

      {/* What this place offers
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          What this place offers
        </label>
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            This section is automatically generated based on the amenities you selected.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default DescriptionForm;