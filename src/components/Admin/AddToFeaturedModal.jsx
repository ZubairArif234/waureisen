import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

const AddToFeaturedModal = ({
  isOpen,
  onClose,
  onConfirm,
  maxAllowed = 6,
  currentCounts = {},
  listingTitle,
  listingId,
}) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modified sections array with more friendly display names
  const sections = [
    {
      id: "featured_accommodations",
      name: "Featured Accommodations",
      apiName: "topRecommendations",
    },
    {
      id: "new_accommodations",
      name: "New Accommodations",
      apiName: "exclusiveFinds",
    },
    {
      id: "popular_accommodations",
      name: "Popular Accommodations",
      apiName: "popularAccommodations",
    },
  ];

  const handleConfirm = () => {
    if (!selectedSection) {
      setErrorMessage("Please select a section");
      return;
    }

    const currentCount = currentCounts[selectedSection] || 0;
    if (currentCount >= maxAllowed) {
      setErrorMessage(
        `Cannot add more than ${maxAllowed} accommodations to ${
          sections.find((s) => s.id === selectedSection).name
        }`
      );
      return;
    }

    onConfirm(selectedSection);
    setSelectedSection("");
    setErrorMessage("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-gray-800 mb-4">
            <h3 className="text-lg font-medium">Add to Featured Section</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Select a featured section to add "
            <span className="font-medium">{listingTitle}</span>" to.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Section
            </label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481] appearance-none bg-white"
              >
                <option value="">Select a section</option>
                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    disabled={(currentCounts[section.id] || 0) >= maxAllowed}
                  >
                    {section.name} ({currentCounts[section.id] || 0}/
                    {maxAllowed})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToFeaturedModal;
