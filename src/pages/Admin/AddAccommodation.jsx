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
  createListingFilter,
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
    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      const validationErrors = [];

      // Basic Info validation
      if (!formData.title) validationErrors.push("Listing title is required");
      if (!formData.propertyType) validationErrors.push("Property type is required");
      if (!formData.listingSource) validationErrors.push("Listing source is required");
      if (!formData.capacity.people) validationErrors.push("Number of people is required");
      if (!formData.capacity.dogs) validationErrors.push("Number of dogs is required");
      if (!formData.capacity.bedrooms) validationErrors.push("Number of bedrooms is required");
      if (!formData.capacity.rooms) validationErrors.push("Number of rooms is required");
      if (!formData.capacity.washrooms) validationErrors.push("Number of washrooms is required");
      if (!formData.pricing.regularPrice) validationErrors.push("Regular price is required");
      if (!formData.pricing.currency) validationErrors.push("Currency is required");

      // Availability validation
      if (!formData.availability?.checkInDates || 
          !formData.availability?.checkInDate || 
          !formData.availability?.checkOutDate) {
        console.log('Form Data:', formData);
        console.log('Availability:', formData.availability);
        validationErrors.push("Check-in dates are required");
      }
      if (!formData.availability?.checkInTime?.hour || !formData.availability?.checkInTime?.period) {
        validationErrors.push("Check-in time is required");
      }
      if (!formData.availability?.checkOutTime?.hour || !formData.availability?.checkOutTime?.period) {
        validationErrors.push("Check-out time is required");
      }

      // Photos validation
      if (!formData.mainImage) validationErrors.push("Main image is required");
      if (!formData.galleryImages || formData.galleryImages.length < 4) {
        validationErrors.push("At least 4 gallery images are required");
      }

      // Description validation
      if (!formData.shortDescription) validationErrors.push("Short description is required");
      if (!formData.fullDescription) validationErrors.push("Full description is required");

      // Policies & Location validation
      if (!formData.location.mapLocation) validationErrors.push("Map location is required");
      if (!formData.policies.cancellationPolicy) validationErrors.push("Cancellation policy is required");
      if (formData.policies.cancellationPolicy === 'custom' && !formData.policies.customPolicyDetails) {
        validationErrors.push("Custom policy details are required when using custom cancellation policy");
      }

      // If there are validation errors, show them and return
      if (validationErrors.length > 0) {
        alert("Please fix the following errors before publishing:\n\n" + validationErrors.join("\n"));
        return;
      }

      setIsLoading(true);

      // Generate a unique code for the listing
      const uniqueCode = generateUniqueListingCode();

      // Process the images array
      const photos = [];
      if (formData.mainImage) {
        photos.push(formData.mainImage);
      }
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        const galleryUrls = formData.galleryImages.filter(
          (img) => typeof img === "string"
        );
        photos.push(...galleryUrls);
      }

      // Format coordinates correctly - transform from {lat, lng} to [longitude, latitude]
      let coordinates = [0, 0];
      if (formData.location?.mapLocation) {
        const location = formData.location.mapLocation;
        if (typeof location === 'string') {
          try {
            const parsed = JSON.parse(location);
            coordinates = [parsed.lng, parsed.lat];
          } catch (e) {
            console.warn('Could not parse location coordinates:', e);
          }
        } else if (location.lat && location.lng) {
          coordinates = [location.lng, location.lat];
        }
      }

      // Map form data to Listing model structure
      const listingData = {
        Code: uniqueCode,
        title: formData.title,
        listingType: "waureisen", // Hardcoded to waureisen for admin-created listings
        propertyType: formData.propertyType,
        description: {
          general: formData.fullDescription,
          short: formData.shortDescription,
        },
        checkInTime: formData.availability?.checkInTime 
          ? new Date(`1970-01-01T${formData.availability.checkInTime.hour}:00${formData.availability.checkInTime.period === 'PM' ? '+12:00' : ':00'}`)
          : null,
        checkOutTime: formData.availability?.checkOutTime
          ? new Date(`1970-01-01T${formData.availability.checkOutTime.hour}:00${formData.availability.checkOutTime.period === 'PM' ? '+12:00' : ':00'}`)
          : null,
        checkInDates: formData.availability?.checkInDates || '',
        location: {
          address: formData.location.fullAddress,
          optional: formData.location.city || "",
          type: 'Point',
          coordinates: coordinates,
        },
        pricePerNight: {
          price: formData.pricing.regularPrice,
          currency: formData.pricing.currency,
        },
        maxDogs: formData.capacity.dogs,
        maxGuests: formData.capacity.people,
        bedRooms: formData.capacity.bedrooms,
        rooms: {
          number: formData.capacity.rooms,
        },
        washrooms: formData.capacity.washrooms,
        status: formData.availability?.active ? "active" : "pending approval",
        source: {
          name: "waureisen", // Always set to waureisen for admin-created listings
          redirectLink: null,
        },
        images: photos,
        legal: {
          cancellationPolicy: formData.policies.cancellationPolicy,
          customPolicyDetails: formData.policies.customPolicyDetails,
        },
      };

      // Create Filter document structure based on template
      const filterData = {
        subsections: []
      };

      if (template?.subsections) {
        template.subsections.forEach(section => {
          const newSection = {
            name: section.name,
            description: section.description,
            hasSubsections: section.hasSubsections,
            subsubsections: [],
            filters: []
          };

          // Handle direct filters in the section
          if (section.filters) {
            section.filters.forEach(filter => {
              const value = formData[`${section.name.toLowerCase()}_${filter.name.toLowerCase()}`];
              if (value !== undefined) {
                newSection.filters.push({
                  name: filter.name,
                  type: filter.type,
                  value: value
                });
              }
            });
          }

          // Handle subsubsections and their filters
          if (section.subsubsections) {
            section.subsubsections.forEach(subsub => {
              const newSubsub = {
                name: subsub.name,
                description: subsub.description,
                filters: []
              };

              // Get the form data key for this subsubsection
              const formDataKey = `amenities_${subsub.name.toLowerCase().replace(/\s+/g, '_')}`;
              const subsectionData = formData[formDataKey] || {};

              // Add filters that are selected (true)
              subsub.filters.forEach(filter => {
                if (subsectionData[filter.name]) {
                  newSubsub.filters.push({
                    name: filter.name,
                    type: filter.type,
                    value: true
                  });
                }
              });

              if (newSubsub.filters.length > 0) {
                newSection.subsubsections.push(newSubsub);
              }
            });
          }

          filterData.subsections.push(newSection);
        });
      }

      // Create the listing first
      const listingResponse = await createListing(listingData);
      console.log("Created new listing:", listingResponse);

      // Create the filter document and link it to the listing
      if (listingResponse._id) {
        // Add the listing reference to the filter data
        filterData.listing = listingResponse._id;
        const filterResponse = await createListingFilter(filterData);
        console.log("Created filters:", filterResponse);

        // Update the listing with the filter reference
        if (filterResponse._id) {
          const updatedListingData = {
            ...listingData,
            filters: filterResponse._id
          };
          await updateListing(listingResponse._id, updatedListingData);
        }

        // Show success message
        alert("Listing created successfully!");

        // Redirect to the detail view with state indicating we came from admin
        navigate(`/accommodation/${listingResponse._id}`, { state: { from: 'admin' } });
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "create"} listing. Please try again. Error: ${error.message}`
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
