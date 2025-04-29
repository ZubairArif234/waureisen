import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import BasicInfoForm from "../../components/Admin/BasicInfoForm";
import PhotosForm from "../../components/Admin/PhotosForm";
import AmenitiesForm from "../../components/Admin/AmenitiesForm";
import DescriptionForm from "../../components/Admin/DescriptionForm";
import PoliciesLocationForm from "../../components/Admin/PoliciesLocationForm";
import {
  createListing,
  updateListing,
  getListingById,
  getTemplateFilter,
} from "../../api/adminAPI";
import { generateUniqueListingCode } from "../../utils/uniqueCodeGenerator";

const AddAccommodation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState(null); // Changed to null initially
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    propertyType: "Studio",
    listingSource: "Admin",
    capacity: {
      people: 6,
      dogs: 1,
      bedrooms: 2,
      rooms: 2,
      washrooms: 1,
    },
    pricing: {
      currency: "CHF",
      regularPrice: 360,
      discountedPrice: 240,
    },
    availability: {
      checkInDates: "",
      checkInDate: null,
      checkOutDate: null,
      checkInTime: { hour: "", period: "" },
      checkOutTime: { hour: "", period: "" },
      allowInstantBooking: false,
      active: false,
    },

    // Photos
    mainImage: null,
    galleryImages: [],

    // Description
    shortDescription: "",
    fullDescription: "",

    // Policies & Location
    location: {
      city: "",
      fullAddress: "",
      mapLocation: null,
    },
    policies: {
      cancellationPolicy: "flexible",
      customPolicyDetails: "",
      houseRules: {
        noSmoking: false,
        noParties: false,
        quietHours: false,
      },
    },
  });

  // Define all possible tabs with their corresponding section names in template
  const allTabs = [
    { id: "basicInfo", label: "Basic Info", templateName: "Basic Info" },
    { id: "photos", label: "Photos", templateName: "Photos" },
    { id: "amenities", label: "Amenities", templateName: "Amenities" },
    { id: "description", label: "Description", templateName: "Description" },
    { id: "policiesLocation", label: "Policies & Location", templateName: "Policies & Location" },
  ];

  // Filter tabs based on template data
  const availableTabs = template 
    ? allTabs.filter(tab => 
        template.subsections?.some(section => section.name === tab.templateName)
      )
    : [];

  // Set initial active tab when template loads
  useEffect(() => {
    if (template && availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].id);
    }
  }, [template, availableTabs]);

  // Fetch template filter on mount and initialize amenities
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplateFilter();
        setTemplate(data);

        // Initialize form data based on template structure
        if (data?.subsections) {
          const newFormData = { ...formData };

          // Initialize amenities
          const amenitiesSection = data.subsections.find(s => s.name === 'Amenities');
          if (amenitiesSection?.subsubsections) {
            amenitiesSection.subsubsections.forEach(subsection => {
              const key = `amenities_${subsection.name.toLowerCase().replace(/\s+/g, '_')}`;
              newFormData[key] = {};
              subsection.filters.forEach(filter => {
                newFormData[key][filter.name] = false;
              });
            });
          }

          setFormData(newFormData);
        }
      } catch (err) {
        console.error('Failed to fetch template filter:', err);
      }
    };
    fetchTemplate();
  }, []);

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        try {
          setIsLoading(true);
          // Fetch actual listing data using the API
          const listingData = await getListingById(id);
          setFormData(listingData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching accommodation data:", error);
          alert("Failed to load listing data. Please try again.");
          setIsLoading(false);
          // Navigate back to listings on error
          navigate("/admin/accommodations");
        }
      };

      fetchListing();
    }
  }, [isEditMode, id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // For nested objects in the form data
  const handleNestedInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Generate a unique code for the listing
      const uniqueCode = generateUniqueListingCode();

      // Process the images array
      const photos = [];

      // Add main image if available
      if (formData.mainImage) {
        photos.push(formData.mainImage);
      }

      // Add gallery images if available
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        // Filter to make sure we only include string URLs (not File objects)
        const galleryUrls = formData.galleryImages.filter(
          (img) => typeof img === "string"
        );
        photos.push(...galleryUrls);
      }

      // Format selected filters based on template structure
      const selectedFilters = {};
      if (template?.subsections) {
        const amenitiesSection = template.subsections.find(s => s.name === 'Amenities');
        if (amenitiesSection?.subsubsections) {
          amenitiesSection.subsubsections.forEach(subsection => {
            const key = `amenities_${subsection.name.toLowerCase().replace(/\s+/g, '_')}`;
            selectedFilters[key] = Object.entries(formData[key] || {})
              .filter(([, value]) => value === true)
              .map(([name]) => name);
          });
        }
      }

      // Create a completely new data structure to ensure all required fields
      const listingSubmitData = {
        title: formData.title || "New Listing",
        description:
          formData.fullDescription || formData.shortDescription || "",
        shortDescription: formData.shortDescription || "",
        listingType: formData.propertyType || "Studio",
        status: "active",
        provider: "Waureisen",
        // Add unique code to prevent duplicate key error
        Code: uniqueCode,

        // Format pricing data correctly
        pricePerNight: {
          price: formData.pricing?.regularPrice || 0,
          currency: formData.pricing?.currency || "CHF",
        },

        // Format location with required address
        location: {
          city: formData.location?.city || "",
          address: formData.location?.fullAddress || "Default Address",
          coordinates: formData.location?.mapLocation || [0, 0],
        },

        // Copy capacity information
        capacity: formData.capacity || {
          people: 2,
          dogs: 1,
          bedrooms: 1,
          rooms: 1,
          washrooms: 1,
        },

        // Add processed photos array
        photos: photos,

        // Source information
        source: {
          name: "waureisen",
          redirectLink: null,
        },

        // Format selected filters
        selectedFilters,
      };

      // Log the exact data being sent for debugging
      console.log(
        "Sending data to server:",
        JSON.stringify(listingSubmitData, null, 2)
      );

      let result;
      if (isEditMode) {
        result = await updateListing(id, listingSubmitData);
        console.log(`Updated listing ${id}:`, result);
      } else {
        result = await createListing(listingSubmitData);
        console.log("Created new listing:", result);
      }

      // Show success message
      alert(
        isEditMode
          ? "Listing updated successfully!"
          : "Listing created successfully!"
      );

      // Redirect back to accommodations list
      navigate("/admin/accommodations");
    } catch (error) {
      console.error("Error saving listing:", error);
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } listing. Please try again. Error: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (!template) return <div>Loading template...</div>;
    if (!activeTab) return null;

    const getSubsection = (name) => template.subsections?.find(s => s.name === name);
    const currentTab = allTabs.find(tab => tab.id === activeTab);
    const subsection = currentTab ? getSubsection(currentTab.templateName) : null;

    // Only render if we have both the tab configuration and corresponding subsection
    if (!subsection) return null;

    switch (activeTab) {
      case "basicInfo":
        return (
          <BasicInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            subsection={subsection}
          />
        );
      case "photos":
        return (
          <PhotosForm
            formData={formData}
            handleInputChange={handleInputChange}
            subsection={subsection}
          />
        );
      case "amenities":
        return (
          <AmenitiesForm
            formData={formData}
            handleNestedInputChange={handleNestedInputChange}
            subsection={subsection}
          />
        );
      case "description":
        return (
          <DescriptionForm
            formData={formData}
            handleInputChange={handleInputChange}
            subsection={subsection}
          />
        );
      case "policiesLocation":
        return (
          <PoliciesLocationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            subsection={subsection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/accommodations")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? "Edit Listing" : "Add New Listing"}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Only render tabs if template is loaded */}
        {template && (
          <div className="flex border-b overflow-x-auto">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading listing data...</p>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>{renderForm()}</form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/accommodations")}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccommodation;
