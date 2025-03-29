import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Pencil } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';

// Reusing existing form components from Admin
import BasicInfoForm from '../../components/Admin/BasicInfoForm';
import PhotosForm from '../../components/Admin/PhotosForm';
import AmenitiesForm from '../../components/Admin/AmenitiesForm';
import DescriptionForm from '../../components/Admin/DescriptionForm';
import PoliciesLocationForm from '../../components/Admin/PoliciesLocationForm';

const CreateListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    propertyType: 'Studio',
    listingSource: 'Provider',
    capacity: {
      people: 2,
      dogs: 1,
      bedrooms: 1,
      rooms: 1,
      washrooms: 1
    },
    pricing: {
      currency: 'CHF',
      regularPrice: 120,
      discountedPrice: 0
    },
    availability: {
      checkInDates: '',
      allowInstantBooking: false,
      active: false
    },
    
    // Photos
    mainImage: null,
    galleryImages: [],
    
    // Amenities
    generalAmenities: {
      kitchen: true,
      airConditioning: true,
      parking: true,
      wifi: true,
      dedicatedWorkspace: true,
      fireworkFreeZone: true,
      tv: true,
      swimmingPool: false,
      dogsAllowed: true
    },
    dogFilters: {
      fireworkFreeZone: true,
      dogParksNearby: false,
      dogFriendlyRestaurants: true,
      petSupplies: false
    },
    
    // Description
    shortDescription: '',
    fullDescription: '',
    
    // Policies & Location
    location: {
      city: '',
      fullAddress: '',
      mapLocation: null
    },
    policies: {
      cancellationPolicy: 'flexible',
      customPolicyDetails: '',
      houseRules: {
        noSmoking: true,
        noParties: true,
        quietHours: true
      }
    },
  });

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      
      // Simulate API call delay
      const fetchData = async () => {
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // For demo purposes, use fixed mock data
          // In real app, we would fetch data from the server based on the id
          setFormData({
            title: 'Mountain View Chalet',
            propertyType: 'Chalet',
            listingSource: 'Provider',
            capacity: {
              people: 4,
              dogs: 2,
              bedrooms: 2,
              rooms: 3,
              washrooms: 2
            },
            pricing: {
              currency: 'CHF',
              regularPrice: 230,
              discountedPrice: 200
            },
            availability: {
              checkInDates: 'Apr 15, 2025 - Apr 30, 2025',
              allowInstantBooking: true,
              active: true
            },
            shortDescription: 'Cozy chalet with mountain views',
            fullDescription: 'Beautiful chalet in the Swiss Alps with amazing mountain views. Perfect for families and dog owners looking for a relaxing getaway.',
            location: {
              city: 'Interlaken',
              fullAddress: 'Alpenstrasse 123, 3800 Interlaken, Switzerland',
              mapLocation: null
            },
            policies: {
              cancellationPolicy: 'moderate',
              customPolicyDetails: 'Full refund up to 5 days before check-in',
              houseRules: {
                noSmoking: true,
                noParties: true,
                quietHours: true
              }
            },
            generalAmenities: {
              kitchen: true,
              airConditioning: false,
              parking: true,
              wifi: true,
              dedicatedWorkspace: true,
              fireworkFreeZone: true,
              tv: true,
              swimmingPool: false,
              dogsAllowed: true
            },
            dogFilters: {
              fireworkFreeZone: true,
              dogParksNearby: true,
              dogFriendlyRestaurants: true,
              petSupplies: false
            }
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching listing data:", error);
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isEditMode, id]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission with status 'pending approval'
    const submissionData = {
      ...formData,
      availability: {
        ...formData.availability,
        active: false // Set to inactive until approved
      },
      status: 'pending approval'
    };
    
    // In a real app, make API call here
    console.log('Submitting listing for approval:', submissionData);
    
    // Show success message
    alert(isEditMode 
      ? 'Your listing has been updated and is awaiting approval.' 
      : 'Your listing has been created and is awaiting approval.');
    
    // Redirect back to listings
    navigate('/provider/your-listings');
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();
    
    // Prepare data for draft with status 'draft'
    const draftData = {
      ...formData,
      availability: {
        ...formData.availability,
        active: false
      },
      status: 'draft'
    };
    
    // In a real app, make API call here
    console.log('Saving as draft:', draftData);
    
    // Show success message
    alert('Listing saved as draft!');
    
    // Redirect back to listings
    navigate('/provider/your-listings');
  };

  const nextStep = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const tabs = [
    { id: 1, label: 'Basic Info' },
    { id: 2, label: 'Photos' },
    { id: 3, label: 'Amenities' },
    { id: 4, label: 'Description' },
    { id: 5, label: 'Policies & Location' }
  ];

  const renderForm = () => {
    switch (activeStep) {
      case 1:
        return (
          <BasicInfoForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 2:
        return (
          <PhotosForm 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <AmenitiesForm 
            formData={formData} 
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 4:
        return (
          <DescriptionForm 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <PoliciesLocationForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      default:
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/provider/your-listings')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Listing' : 'Create New Listing'}
          </h1>
        </div>

        {/* Progress Tabs */}
        <div className="mb-8 border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeStep === tab.id
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading listing data...</p>
            </div>
          ) : (
            <form>
              {renderForm()}
              
              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    activeStep === 1 ? 'invisible' : ''
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {activeStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveAsDraft}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Save as Draft
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isEditMode ? 'Update Listing' : 'Publish Listing'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateListing;