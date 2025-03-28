import React, { useState } from 'react';
import { ArrowLeft, Save, ChevronDown  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import BasicInfoForm from '../../components/Admin/BasicInfoForm';
import PhotosForm from '../../components/Admin/PhotosForm';
import AmenitiesForm from '../../components/Admin/AmenitiesForm';
import DescriptionForm from '../../components/Admin/DescriptionForm';
import PoliciesLocationForm from '../../components/Admin/PoliciesLocationForm';



const ListingTypeForm = ({ formData, handleInputChange }) => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Type</h2>
          <p className="text-gray-600 text-sm">Select the type of accommodation you want to register.</p>
        </div>
  
        <div className="space-y-2 max-w-2xl">
          <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">
            Select your accommodation provider
          </label>
          <div className="relative">
            <select
              id="listingType"
              value={formData.listingType}
              onChange={(e) => handleInputChange('listingType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand pr-10"
            >
              <option value="" disabled>Select a listing type</option>
              <option value="interhome">Register Interhome accommodation</option>
              <option value="europarcs">Register EuroParcs accommodation</option>
              <option value="other">Register other accommodation</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Choose "other" if you're listing your own property not associated with Interhome or EuroParcs.
          </p>
        </div>
  
        {formData.listingType && (
          <div className="bg-blue-50 p-4 rounded-lg max-w-2xl">
            <h3 className="text-blue-800 font-medium mb-2">About {formData.listingType === 'interhome' ? 'Interhome' : formData.listingType === 'europarcs' ? 'EuroParcs' : 'Direct'} Listings</h3>
            {formData.listingType === 'interhome' && (
              <p className="text-blue-700 text-sm">
                Interhome has been providing high-quality vacation rentals since 1965. By registering your Interhome accommodation, 
                you'll connect with our platform's dog-loving audience while maintaining your Interhome standards.
              </p>
            )}
            {formData.listingType === 'europarcs' && (
              <p className="text-blue-700 text-sm">
                EuroParcs offers premium holiday parks across Europe. Registering your EuroParcs accommodation on our platform 
                allows you to reach dog owners specifically looking for pet-friendly vacation experiences.
              </p>
            )}
            {formData.listingType === 'other' && (
              <p className="text-blue-700 text-sm">
                Direct listings allow you to showcase your own property on our platform. You'll have full control over your 
                listing details, pricing, and availability while benefiting from our specialized dog-friendly travel audience.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

const HostRegistration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listingType');
  const [formData, setFormData] = useState({
    // Listing Type
    listingType: '',
    
    // Basic Info
    title: '',
    propertyType: 'Studio',
    listingSource: 'Provider', // Default to Provider for host registrations
    capacity: {
      people: 2,
      dogs: 1,
      bedrooms: 1,
      rooms: 1,
      washrooms: 1
    },
    pricing: {
      currency: 'CHF',
      regularPrice: 0,
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
      kitchen: false,
      airConditioning: false,
      parking: false,
      wifi: false,
      dedicatedWorkspace: false,
      fireworkFreeZone: false,
      tv: false,
      swimmingPool: false,
      dogsAllowed: true // Default for dog-friendly platform
    },
    dogFilters: {
      fireworkFreeZone: false,
      dogParksNearby: false,
      dogFriendlyRestaurants: false,
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
        noSmoking: false,
        noParties: false,
        quietHours: false
      }
    },
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // For nested objects in the form data
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
    
    // Here you would typically send the data to your backend
    console.log('Submitting host registration with data:', formData);
    
    // Show success message
    alert('Thank you for your interest in becoming a host! Our team will review your listing and contact you soon.');
    
    // Redirect to homepage or confirmation page
    navigate('/');
  };

  const tabs = [
    { id: 'listingType', label: 'Listing Type' },
    { id: 'basicInfo', label: 'Basic Info' },
    { id: 'photos', label: 'Photos' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'description', label: 'Description' },
    { id: 'policiesLocation', label: 'Policies & Location' }
  ];

  // Determine if we can proceed to the next tab
  const canProceed = () => {
    if (activeTab === 'listingType' && !formData.listingType) {
      return false;
    }
    return true;
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'listingType':
        return (
          <ListingTypeForm 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        );
      case 'basicInfo':
        return (
          <BasicInfoForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 'photos':
        return (
          <PhotosForm 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        );
      case 'amenities':
        return (
          <AmenitiesForm 
            formData={formData} 
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      case 'description':
        return (
          <DescriptionForm 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        );
      case 'policiesLocation':
        return (
          <PoliciesLocationForm 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
      default:
        return <ListingTypeForm formData={formData} handleInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Register Your Accommodation
            </h1>
          </div>
          
          <p className="mt-4 text-gray-600 max-w-3xl">
            Join Waureisen as a host and share your dog-friendly accommodation with travelers and their furry friends. 
            Complete the form below to register your property.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {renderForm()}
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-between gap-4">
            <div>
              {activeTab !== 'listingType' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {activeTab !== 'policiesLocation' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (canProceed()) {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id);
                      }
                    } else {
                      alert('Please select a listing type to continue.');
                    }
                  }}
                  className={`px-4 py-2 bg-brand text-white rounded-lg ${
                    canProceed() ? 'hover:bg-brand/80' : 'opacity-50 cursor-not-allowed'
                  } transition-colors`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Submit Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HostRegistration;