import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const AddToFeaturedModal = ({
  isOpen,
  onClose,
  onConfirm,
  maxAllowed = 6,
  currentCounts = {},
  listingTitle,
  listingId,
  sections: predefinedSections,
  isRemoveMode,
}) => {
  const [selectedSection, setSelectedSection] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reset selected section when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedSection(
        predefinedSections && predefinedSections.length === 1
          ? getSectionId(predefinedSections[0])
          : ""
      );
    } else {
      setSelectedSection("");
    }
    setErrorMessage("");
  }, [isOpen, predefinedSections]);

  // Helper function to convert section name to section ID
  const getSectionId = (sectionName) => {
    if (sectionName === "Featured") return "featured_accommodations";
    if (sectionName === "New") return "new_accommodations";
    if (sectionName === "Popular") return "popular_accommodations";
    return "";
  };

  // Modified sections array with more friendly display names
  const defaultSections = [
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

  // Filter sections if in remove mode to only show sections the item is in
  const availableSections =
    isRemoveMode && predefinedSections
      ? defaultSections.filter((section) =>
          predefinedSections.includes(
            section.name === "Featured Accommodations"
              ? "Featured"
              : section.name === "New Accommodations"
              ? "New"
              : section.name === "Popular Accommodations"
              ? "Popular"
              : ""
          )
        )
      : defaultSections;

  const handleConfirm = () => {
    if (!selectedSection) {
      setErrorMessage("Please select a section");
      return;
    }

    // Only check the max limit when adding, not when removing
    if (!isRemoveMode) {
      const currentCount = currentCounts[selectedSection] || 0;
      if (currentCount >= maxAllowed) {
        setErrorMessage(
          `Cannot add more than ${maxAllowed} accommodations to ${
            defaultSections.find((s) => s.id === selectedSection).name
          }`
        );
        return;
      }
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
            <h3 className="text-lg font-medium">
              {isRemoveMode
                ? "Remove from Featured Section"
                : "Add to Featured Section"}
            </h3>
          </div>

          <p className="text-gray-600 mb-4">
            Select a featured section to {isRemoveMode ? "remove" : "add"} "
            <span className="font-medium">{listingTitle}</span>"
            {isRemoveMode ? "from" : "to"}.
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
                {availableSections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    disabled={
                      !isRemoveMode &&
                      (currentCounts[section.id] || 0) >= maxAllowed
                    }
                  >
                    {section.name}{" "}
                    {!isRemoveMode &&
                      `(${currentCounts[section.id] || 0}/${maxAllowed})`}
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
              className={`px-4 py-2 ${
                isRemoveMode
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-800 hover:bg-gray-700"
              } text-white rounded-lg transition-colors`}
            >
              {isRemoveMode ? "Remove" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToFeaturedModal;
