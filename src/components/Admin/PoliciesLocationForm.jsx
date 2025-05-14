import React, { useState, useRef, useEffect } from 'react';
import { MapPin, FileText, X, Upload } from 'lucide-react';
import { loadGoogleMapsScript, initAutocomplete, createMap } from '../../utils/googleMapsUtils';

const PoliciesLocationForm = ({ formData, handleInputChange, handleNestedInputChange }) => {
  const fullAddressRef = useRef(null);
const mapRef = useRef(null);
const [mapInstance, setMapInstance] = useState(null);
const [marker, setMarker] = useState(null);
  const [inputAddress, setInputAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(formData.location?.address || '');
  const [mapLocation, setMapLocation] = useState(formData.location?.mapLocation || null);
  const [uploadedFile, setUploadedFile] = useState(null);
// console.log(selectedAddress , mapLocation , "klj");

// Load Google Maps script and initialize autocomplete
useEffect(() => {
  let mapInstanceRef = null;
  let markerRef = null;
  const initializeMap = () => {
    console.log("Initializing map...");
    if (!mapRef.current || !fullAddressRef.current) {
      console.warn("Map or address input refs not available yet");
      return;
    }
    
    try {
        const initialCenter = mapLocation || { lat: 46.818188, lng: 8.227512 };
        
      mapInstanceRef = new window.google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: mapLocation ? 15 : 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      
      setMapInstance(mapInstanceRef);
      
        if (mapLocation) {
          markerRef = new window.google.maps.Marker({
            position: mapLocation,
            map: mapInstanceRef,
            animation: window.google.maps.Animation.DROP
          });
          setMarker(markerRef);
        }
        
      const autocomplete = new window.google.maps.places.Autocomplete(fullAddressRef.current, {
        fields: ['formatted_address', 'geometry', 'name'],
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address && place.geometry) {
          console.log("Place selected:", place);
          
            const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
            // Update map location state
            setMapLocation(newPosition);
            
            // Update selected address state
            setSelectedAddress(place.formatted_address);
            
            // Update form data
            handleLocationChange('fullAddress', place.formatted_address);
            handleLocationChange('address', place.formatted_address);
            handleLocationChange('mapLocation', newPosition);
          
            // Update map
            mapInstanceRef.setCenter(newPosition);
          mapInstanceRef.setZoom(15);
          
          if (markerRef) markerRef.setMap(null);
          
          markerRef = new window.google.maps.Marker({
              position: newPosition,
            map: mapInstanceRef,
            animation: window.google.maps.Animation.DROP
          });
          
          setMarker(markerRef);
        }
      });
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  };


  loadGoogleMapsScript(() => {
    if (window.google && window.google.maps) {
      setTimeout(initializeMap, 100);
    }
  });

  return () => {
    if (mapInstanceRef) {
      // Clean up resources if needed
    }
  };
  }, []); // Only run once on mount

  // Update form data when selected address changes
  useEffect(() => {
    if (selectedAddress) {
      handleLocationChange('address', selectedAddress);
    }
  }, [selectedAddress]);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!validTypes.includes(fileType) && 
          !file.name.endsWith('.docx')) {
        alert('Please upload only PDF, DOCX, or TXT files');
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
        <p className="text-gray-600 text-sm mb-6">Provide the location details for your property.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* <div className="space-y-2">
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
          </div> */}

        <div className="space-y-2">
          <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700">
            Full Address
          </label>
          <input
            type="text"
            id="fullAddress"
            ref={fullAddressRef}
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="e.g. 7082 Vaz/Obervaz, Switzerland"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          {/* Display selected address */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Selected Address
            </label>
            <input
              type="text"
              readOnly
              value={selectedAddress || 'No address selected'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>
        </div>

        {/* Map Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Map Location
          </label>
          <div 
            ref={mapRef}
            className="border border-gray-300 rounded-md overflow-hidden h-64 bg-gray-100"
          ></div>
          <p className="text-xs text-gray-500">
            Search for your address above and the map will update automatically. For privacy reasons, guests will only see the approximate location until they book.
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
            <option value="Flexible (Full refund 1 day prior to arrival)">Flexible (Full refund 1 day prior to arrival)</option>
            <option value="Moderate (Full refund 5 days prior to arrival)">Moderate (Full refund 5 days prior to arrival)</option>
            <option value="Strict (50% refund up to 1 week prior to arrival)">Strict (50% refund up to 1 week prior to arrival)</option>
          </select>
        </div>

        {/* House Rules */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">House Rules</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.noSmoking}
                onChange={(e) => handleHouseRuleChange('noSmoking', e.target.checked)}
                className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
              />
              <span className="text-gray-700">No smoking</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.noParties}
                onChange={(e) => handleHouseRuleChange('noParties', e.target.checked)}
                className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
              />
              <span className="text-gray-700">No parties or events</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.policies.houseRules.quietHours}
                onChange={(e) => handleHouseRuleChange('quietHours', e.target.checked)}
                className="w-4 h-4 rounded border-[#B4A481] accent-[#B4A481] checked:bg-[#B4A481] checked:border-[#B4A481] focus:ring-[#B4A481] focus:ring-2 focus:ring-offset-0"
              />
              <span className="text-gray-700">Quiet hours after 10 PM</span>
            </label>
          </div>
        </div>

        {/* Additional Custom Document Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mt-8">Additional Documents</h3>
        <p className="text-sm text-gray-600">Upload any additional policy documents or guidelines (PDF, DOCX, or TXT)</p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {!uploadedFile ? (
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <FileText className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium mb-1">Drag & drop your document here</span>
              <span className="text-gray-500 text-sm mb-3">or</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Choose File
              </span>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-brand" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Upload className="w-4 h-4" />
          <span>Maximum file size: 5MB</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PoliciesLocationForm;