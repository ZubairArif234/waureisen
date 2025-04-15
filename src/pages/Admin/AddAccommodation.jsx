import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import BasicInfoForm from '../../components/Admin/BasicInfoForm';
import PhotosForm from '../../components/Admin/PhotosForm';
import AmenitiesForm from '../../components/Admin/AmenitiesForm';
import DescriptionForm from '../../components/Admin/DescriptionForm';
import PoliciesLocationForm from '../../components/Admin/PoliciesLocationForm';

// Mock data for edit mode
const mockAccommodationData = {
  title: 'Modern and Luxury 1BHK Studio/Self Check-in/Eiffle',
  propertyType: 'Studio',
  listingSource: 'Admin',
  capacity: {
    people: 6,
    dogs: 1,
    bedrooms: 2,
    rooms: 2,
    washrooms: 1
  },
  pricing: {
    currency: 'CHF',
    regularPrice: 360,
    discountedPrice: 240
  },
  availability: {
    checkInDates: '',
    checkInDate: null,
    checkOutDate: null,
    checkInTime: { hour: '', period: '' },
    checkOutTime: { hour: '', period: '' },
    allowInstantBooking: false,
    active: false
  },
  mainImage: null,
  galleryImages: [],
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
  shortDescription: 'Modern and Luxury 1BHK Studio with self check-in in a prime location',
  fullDescription: 'Innenbereich:20 m². Weitere Angaben des Anbieters: Wir bieten grosszügige Rabatte schon ab 3 Tagen. Langzeitaufenthalte möglich. Perfekte Lage: Unsere Unterkunft bietet eine unschlagbare zentrale Lage. Lebensmittelgeschäfte, Bushaltestellen, erstklassige Restaurants, Bars und Shoppingmöglichkeiten – alles ist nur einen kurzen Spaziergang entfernt. Stilvolle Einrichtung: Erleben Sie stillen Luxus und höchste Funktionalität. Unsere Einrichtung umfasst ein Top-Bett, hochwertigste Bettwäsche und Seifen, schnellen WLAN-Zugang, einen Flachbild-TV und eine Musikanlage. Top-Qualität und Sauberkeit: Wir garantieren Ihnen Top-Qualität und makellose Sauberkeit. Sie finden alles in perfektem Zustand vor, sodass Sie sich sofort wohlfühlen können. Eigener Garagenplatz: Für zusätzlichen Komfort steht Ihnen ein eigener Garagenplatz zur Verfügung. So haben Sie jederzeit einen sicheren Stellplatz für Ihr Fahrzeug. Ruhige Umgebung: Trotz der zentralen Lage ist die Umgebung unserer Unterkunft sehr ruhig, sodass Sie jederzeit entspannen und zur Ruhe kommen können. Unser Studio zeichnet sich durch qualitativ hochstehende, stilvolle',
  location: {
    city: 'Vaz',
    fullAddress: '7082 Vaz/Obervaz, Switzerland',
    mapLocation: null
  },
  policies: {
    cancellationPolicy: 'flexible',
    customPolicyDetails: 'Je nach Reisezeitraum 90% Rückerstattung bis 0% Rückerstattung.',
    houseRules: {
      noSmoking: true,
      noParties: true,
      quietHours: true
    }
  }
};

const AddAccommodation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode); // Start with loading if in edit mode
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    propertyType: 'Studio',
    listingSource: 'Admin',
    capacity: {
      people: 6,
      dogs: 1,
      bedrooms: 2,
      rooms: 2,
      washrooms: 1
    },
    pricing: {
      currency: 'CHF',
      regularPrice: 360,
      discountedPrice: 240
    },
    availability: {
      checkInDates: '',
      checkInDate: null,
      checkOutDate: null,
      checkInTime: { hour: '', period: '' },
      checkOutTime: { hour: '', period: '' },
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
      dogsAllowed: false
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

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the data from an API based on the ID
      console.log(`Fetching data for listing with ID: ${id}`);
      setIsLoading(true);
      
      // Simulate API call delay
      const fetchData = async () => {
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Set form data to mock data
          setFormData(mockAccommodationData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching accommodation data:", error);
          // Handle error here - show error message to user
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

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    if (isEditMode) {
      console.log(`Updating listing ${id} with data:`, formData);
      // In a real app, you would make a PUT or PATCH request to update the listing
    } else {
      console.log('Creating new listing with data:', formData);
      // In a real app, you would make a POST request to create the listing
    }
    
    // Show success message (in a real app)
    alert(isEditMode ? 'Listing updated successfully!' : 'Listing created successfully!');
    
    // Redirect back to accommodations list
    navigate('/admin/accommodations');
  };

  const tabs = [
    { id: 'basicInfo', label: 'Basic Info' },
    { id: 'photos', label: 'Photos' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'description', label: 'Description' },
    { id: 'policiesLocation', label: 'Policies & Location' }
  ];

  const renderForm = () => {
    switch (activeTab) {
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
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/accommodations')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Listing' : 'Add New Listing'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading listing data...</p>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              {renderForm()}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/accommodations')}
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