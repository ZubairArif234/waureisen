import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import BasicInfoForm from "../../components/Admin/BasicInfoForm";
import PhotosForm from "../../components/Admin/PhotosForm";
import AmenitiesForm from "../../components/Admin/AmenitiesForm";
import DescriptionForm from "../../components/Admin/DescriptionForm";
import PoliciesLocationForm from "../../components/Admin/PoliciesLocationForm";
import {
  createListing as adminCreateListing,
  updateListing as adminUpdateListing,
  getListingById,
  getListingByIdWithFilters,
  getTemplateFilter,
} from "../../api/adminAPI";
import {
  createListing as providerCreateListing,
  updateListing as providerUpdateListing,
  getListingDetails as getProviderListingDetails,

} from "../../api/providerAPI";
import { generateUniqueListingCode } from "../../utils/uniqueCodeGenerator";
import toast from "react-hot-toast";
import { updateListing } from "../../api/listingAPI";
import moment from "moment";
import { changeMetaData } from "../../utils/extra";
import { ensureCloudinaryUrl, uploadImageToCloudinary } from "../../utils/cloudinaryUtils";

const AddAccommodation = (props) => {
  const { id } = useParams();
    useEffect(() => {
          
            changeMetaData(`${id ? "Edit Accommodation" :"Create Accommodation"} - Provider`);
          }, []);
  const navigate = useNavigate();
  const isEditMode = !!id;
  const isProviderMode = props?.isProviderMode || false;
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState(null); // Changed to null initially
  const [template, setTemplate] = useState(null);
  const [additionalFile, setAdditionalFile] = useState(null);
  const [isDiscount, setIsDiscount] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    propertyType: "Studio",
    listingSource: isProviderMode ? "Provider" : "Admin",
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
      cancellationPolicy: "Flexible (Full refund 1 day prior to arrival)",
      customPolicyDetails: "",
      houseRules: {
        noSmoking: false,
        noParties: false,
        quietHours: false,
      },
    },
  });
  const [customPolicy, setCustomPolicy] = useState([
    {
      days:"",
      refundAmount:"",
    }
  ]);


  // console.log(formData);
  
    // const handleGetTempFilters = async () => {
    //   const res = await getProviderTemplateFilter()
    //   console.log(res);
      
    // }
  
    // useEffect(()=>{
  
    // },[])
  useEffect(() => {
    if (isProviderMode) {
      setFormData(prev => ({
        ...prev,
        listingSource: "Provider"
      }));
    }
  }, [isProviderMode]);

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


  useEffect(() => {
  if (id || isEditMode) {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        // Use the appropriate API based on provider mode
        let listingData;
        if (isProviderMode) {
          listingData = await getProviderListingDetails(id);
        } else {
          listingData = await getListingByIdWithFilters(id);
        }

        let mySelectedData = null;
         if(listingData?.filter){
         mySelectedData = await getListingFilter(formData?.filter);
        }
        console.log("Fetched listing data:", listingData);
        console.log("Fetched listing data:", mySelectedData);
        if (listingData?.title) {
          // First, initialize amenities data from template if available
          const newFormData = { ...formData };
          // Initialize amenities structure from template
          if (template?.subsections) {
            const amenitiesSection = template.subsections.find(s => s.name === 'Amenities');
            if (amenitiesSection?.subsubsections) {
              amenitiesSection.subsubsections.forEach(subsection => {
                const key = `amenities_${subsection.name.toLowerCase().replace(/\s+/g, '_')}`;
                newFormData[key] = {};
                subsection.filters.forEach(filter => {
                  newFormData[key][filter.name] = false;
                });
              });
            }
          }
          // Load existing filter data if available
          if (listingData.filters) {
            const filterData = listingData.filters;
            console.log("Loading existing filter data:", filterData);
            // Map filter data to form structure
            if (filterData?.subsections) {
              filterData.subsections.forEach(section => {
                if (section.name === 'Amenities' && section.subsubsections) {
                  section.subsubsections.forEach(subsection => {
                    const key = `amenities_${subsection.name.toLowerCase().replace(/\s+/g, '_')}`;
                    if (!newFormData[key]) newFormData[key] = {};
                    subsection.filters.forEach(filter => {
                      newFormData[key][filter.name] = filter.value !== undefined ? filter.value : true;
                    });
                  });
                }
              });
            }
          }
          // console.log(a);
          
          // Map basic listing data to form structure
          setIsDiscount(listingData?.pricePerNight?.isDiscountActivate)
          const updatedFormData = {
            ...newFormData,
            // Basic Info
            filter: listingData?.filters, // Store the filter ObjectId reference
            title: listingData?.title || "",
            propertyType: listingData?.listingType || "Studio",
            listingSource: listingData?.ownerType || isProviderMode ? "Provider" : "Admin",
            additionalDoc: listingData?.additionalDoc,
            capacity: {
              people: listingData?.maxGuests || 6,
              dogs: listingData?.maxDogs || 0,
              bedrooms: listingData?.bedRooms || 0,
              rooms: listingData?.rooms?.number || 0,
              washrooms: listingData?.washrooms || 0,
            },
            pricing: {
              currency: listingData?.pricePerNight?.currency || "CHF",
              regularPrice: listingData?.pricePerNight?.price || 0,
              discountedPrice:  listingData?.pricePerNight?.discount || 0,
            },
            availability: {
              checkInDates: "",
              checkInDate: null,
              checkOutDate: null,
              checkInTime: {
                hour: listingData?.checkInTime ? moment(listingData.checkInTime).format("h") : "",
                period: listingData?.checkInTime ? moment(listingData.checkInTime).format("A") : ""
              },
              checkOutTime: {
                hour: listingData?.checkOutTime ? moment(listingData.checkOutTime).format("h") : "",
                period: listingData?.checkOutTime ? moment(listingData.checkOutTime).format("A") : ""
              },
              allowInstantBooking: false,
              active: listingData?.status === "active",
            },
            // Photos
            mainImage: listingData?.images?.[0] || null,
            galleryImages: listingData?.images?.slice(1) || [],
            // Description
            shortDescription: listingData?.description?.general || "",
            fullDescription: listingData?.description?.general || "",
            // Policies & Location
            location: {
              city: "",
              fullAddress: listingData?.location?.address || "",
              mapLocation: listingData?.location?.coordinates
                ? { lat: listingData.location.coordinates[1], lng: listingData.location.coordinates[0] }
                : null,
              address: listingData?.location?.address || "",
            },
            policies: {
              cancellationPolicy: listingData?.legal?.cancellationPolicy || "Flexible (Full refund 1 day prior to arrival)",
              customPolicyDetails: listingData?.legal?.customPolicyDetails || "",
              houseRules: {
                noSmoking:  listingData?.houseRules?.noSmoking || false ,
                noParties: listingData?.houseRules?.noParties || false,
                quietHours: listingData?.houseRules?.quietHours || false,
              },
            },
          };
          console.log("Final form data:", updatedFormData);
          setFormData(updatedFormData);
          if(listingData?.customRefundPolicies && listingData?.customRefundPolicies.length > 0){

            setCustomPolicy(listingData?.customRefundPolicies )
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching accommodation data:", error);
        setIsLoading(false);
        navigate(isProviderMode ? "/provider/your-listings" : "/admin/accommodations");
      }
    };
    fetchListing();
  }
}, [isEditMode, id, navigate, isProviderMode, template]); // Add template as dependency

  // Load data if in edit mode
  // const fetchListing = async (id) => {
  //   try {
  //     setIsLoading(true);
      
  //     // Use the appropriate API based on provider mode
  //     let listingData;
  //     if (isProviderMode) {
  //       listingData = await getProviderListingDetails(id);
  //     } else {
  //       listingData = await getListingById(id);
  //     }
  //     console.log(listingData , " data hai");
      
  //     if(listingData?.title){

  //       setFormData({
  //         // Basic Info
  //         filter:listingData?.filter,
  //         title: listingData?.title,
  //         propertyType: listingData?.listingType,
  //         listingSource: isProviderMode ? "Provider" : "Admin",
  //         capacity: {
  //           people: listingData?.maxGuests,
  //           dogs: listingData?.maxDogs,
  //           bedrooms: listingData?.bedRooms,
  //           rooms: listingData?.rooms?.number,
  //           washrooms: listingData?.washrooms,
  //         },
  //         pricing: {
  //           currency: listingData?.pricePerNight?.currency,
  //           regularPrice: listingData?.pricePerNight?.price,
  //           discountedPrice: 0,
  //         },
  //         availability: {
  //           checkInDates: "",
  //           checkInDate: null,
  //           checkOutDate: null,
  //           checkInTime: { hour:listingData?.checkInTime ? moment(listingData?.checkInTime).format("h") : "", period: listingData?.checkInTime ? moment(listingData?.checkInTime).format("A") : "" },
  //           checkOutTime: { hour:listingData?.checkOutTime ? moment(listingData?.checkOutTime).format("h") : "", period: listingData?.checkOutTime ? moment(listingData?.checkOutTime).format("A") : "" },
  //           allowInstantBooking: false,
  //           active: false,
  //         },
      
  //         // Photos
  //         mainImage: listingData?.images[0],
  //         galleryImages: listingData?.images?.slice(1,listingData?.images?.length),
      
  //         // Description
  //         shortDescription: listingData?.description?.general,
  //         fullDescription: "",
      
  //         // Policies & Location
  //         location: {
  //           city: "",
  //           fullAddress: listingData?.location?.address,
  //           // mapLocation: listingData?.location?.coordinates,
  //           mapLocation: { lat:listingData?.location?.coordinates[0] , lng: listingData?.location?.coordinates[1] },
  //           address:listingData?.location?.address,
  //         },
  //         policies: {
  //           cancellationPolicy: listingData?.legal?.cancellationPolicy,
  //           customPolicyDetails: "",
  //           houseRules: {
  //             noSmoking: false,
  //             noParties: false,
  //             quietHours: false,
  //           },
  //         },
  //       });
  //     }
  //     setCustomPolicy(listingData?.customRefundPolicies )
      
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching accommodation data:", error);
  //     setIsLoading(false);
  //     // Navigate back to listings on error
  //     navigate(isProviderMode ? "/provider/your-listings" : "/admin/accommodations");
  //   }
  // };
  // useEffect(() => {
  //   if (id||isEditMode) {

  //     fetchListing(id);
  //   }
  // }, [isEditMode, id, isProviderMode]);

  

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  console.log("Form Data:", formData);
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
      // Log cancellation policy and location data

      const validationErrors = [];
  
      // ===== Validation =====
      if (!formData?.title) validationErrors.push("Listing title is required");
      if (!formData?.propertyType) validationErrors.push("Property type is required");
      if (!formData?.capacity.people) validationErrors.push("Number of people is required");
      if (!formData?.capacity.dogs) validationErrors.push("Number of dogs is required");
      if (!formData?.capacity.bedrooms) validationErrors.push("Number of bedrooms is required");
      if (!formData?.capacity.rooms) validationErrors.push("Number of rooms is required");
      if (!formData?.capacity.washrooms) validationErrors.push("Number of washrooms is required");
      if (!formData?.pricing.regularPrice) validationErrors.push("Regular price is required");
      if (!formData?.pricing.currency) validationErrors.push("Currency is required");
  
      // if (!formData?.availability?.checkInDates || !formData?.availability?.checkInDate || !formData?.availability?.checkOutDate) {
      //   validationErrors.push("Check-in dates are required");
      // }
      if (!formData?.availability?.checkInTime?.hour || !formData?.availability?.checkInTime?.period) {
        validationErrors.push("Check-in time is required");
      }
      if (!formData?.availability?.checkOutTime?.hour || !formData?.availability?.checkOutTime?.period) {
        validationErrors.push("Check-out time is required");
      }
  
      if (!formData?.mainImage) validationErrors.push("Main image is required");
      // if (!formData?.galleryImages || formData?.galleryImages.length < 4) {
      //   validationErrors.push("At least 4 gallery images are required");
      // }
  
      // if (!formData?.shortDescription) validationErrors.push("Short description is required");
      // if (!formData?.fullDescription) validationErrors.push("Full description is required");
  
      if (!formData?.location.mapLocation) validationErrors.push("Map location is required");
      if (!formData?.policies.cancellationPolicy) validationErrors.push("Cancellation policy is required");
     const isEmpty = customPolicy.some(
      (policy) =>  policy.days == "" || policy.refundAmount == ""
    );
    console.log("Custom Policy Data:", customPolicy, "Is Empty:", isEmpty);
      if (formData?.policies.cancellationPolicy === 'custom' && isEmpty) {
        validationErrors.push("Custom policy details are required when using custom cancellation policy");
      }
  
      if (validationErrors.length > 0) {
        toast.error(
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="font-medium">Please fix the following errors:</p>
              <button 
                onClick={() => toast.dismiss()}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ul className="list-disc list-inside text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>,
          {
            duration: 5000,
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxWidth: '32rem',
            },
            className: '!pl-4'
          }
        );
        return;
      }
  
      setIsLoading(true);
  
      // ===== Prepare Data =====
      const uniqueCode = generateUniqueListingCode();
      const photos = [formData?.mainImage, ...formData?.galleryImages?.filter(img => typeof img === "string")];
  
      let coordinates = [0, 0];
      const location = formData.location?.mapLocation;
      if (location) {
        if (typeof location === "string") {
          try {
            const parsed = JSON.parse(location);
            coordinates = [parsed.lng, parsed.lat];
          } catch (e) {
            console.warn("Could not parse coordinates:", e);
          }
        } else if (location.lat && location.lng) {
          coordinates = [location.lng, location.lat];
        }
      }
  

      const convertTo24Hour = (hour, period) => {
        const h = parseInt(hour);
        if (period?.toLowerCase() === 'pm' && h !== 12) return h ;
        if (period?.toLowerCase() === 'am' && h === 12) return h;
        return h;
      };
      
      const getTimeFromForm = (timeObj) => {
        if (!timeObj?.hour || !timeObj?.period) return null;
      
        const hour24 = String(convertTo24Hour(timeObj.hour, timeObj.period)).padStart(2 ,'0');
        console.log(hour24, "hour24");
        const timeStr = `1970-01-01T${hour24}:00:00Z`;
        const date = new Date(timeStr);
        return isNaN(date.getTime()) ? null : date;
      };

      // -----------------additional file------------
      let validatedUrlOfAdditionalFile;
      if (additionalFile) {
        
        const cloudinaryUrl = await uploadImageToCloudinary(additionalFile);
       
               // Validate the returned URL
                validatedUrlOfAdditionalFile = ensureCloudinaryUrl(cloudinaryUrl);
       console.log(additionalFile , validatedUrlOfAdditionalFile);
      }
      


      const listingData = {
        Code: uniqueCode,
        title: formData?.title,
        listingType: formData?.propertyType,
        description: {
          general: formData?.shortDescription,
          short: formData?.shortDescription,
        },
        additionalDoc:validatedUrlOfAdditionalFile,
        checkInTime: getTimeFromForm(formData.availability.checkInTime),
        checkOutTime: getTimeFromForm(formData.availability.checkOutTime),
        checkInDates: formData?.availability?.checkInDates || '',
        location: {
          address: formData?.location?.fullAddress,
          optional: formData?.location?.city || "",
          type: 'Point',
          coordinates,
        },
        pricePerNight: {
          price: formData?.pricing?.regularPrice,
          discount: formData?.pricing?.discountedPrice,
          currency: formData?.pricing?.currency,
          isDiscountActivate:isDiscount || false,
        },
        maxDogs: formData?.capacity?.dogs,
        maxGuests: formData?.capacity?.people,
        bedRooms: formData?.capacity?.bedrooms,
        rooms: {
          number: formData?.capacity?.rooms,
        },
        washrooms: formData?.capacity?.washrooms,
        // status: isProviderMode ? "pending approval" : (formData?.availability?.active ? "active" : "pending approval"),
        images: photos,
        legal: {
          cancellationPolicy: formData?.policies?.cancellationPolicy,
          customPolicyDetails: formData?.policies?.customPolicyDetails,
        },
        houseRules:formData?.policies?.houseRules,
        customRefundPolicies: customPolicy,
      };
  
      console.log("Listing Data to be saved:", listingData , formData);
      const filterData = { subsections: [] };
      if (template?.subsections) {
        template.subsections.forEach(section => {
          const newSection = {
            name: section.name,
            description: section.description,
            hasSubsections: section.hasSubsections,
            subsubsections: [],
            filters: [],
          };
  
          if (section.filters) {
            section.filters.forEach(filter => {
              const value = formData[`${section.name.toLowerCase()}_${filter.name.toLowerCase()}`];
              if (value !== undefined) {
                newSection.filters.push({ name: filter.name, type: filter.type, value });
              }
            });
          }
  
          if (section.subsubsections) {
            section.subsubsections.forEach(subsub => {
              const subData = formData[`amenities_${subsub.name.toLowerCase().replace(/\s+/g, '_')}`] || {};
              const newSubsub = {
                name: subsub.name,
                description: subsub.description,
                filters: subsub.filters
                  .filter(filter => subData[filter.name])
                  .map(filter => ({ name: filter.name, type: filter.type, value: true })),
              };
              if (newSubsub.filters.length > 0) newSection.subsubsections.push(newSubsub);
            });
          }
  
          filterData.subsections.push(newSection);
        });
      }
  
      let listingResponse;
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_BE_BASE_URL || "http://localhost:5000";
  
      if (isProviderMode) {
        listingData.filterData = filterData;
        // console.log(listingData , formData);
        
        if(id){
          listingResponse = await updateListing(id,listingData);
          setCustomPolicy([
            {days:'', refundAmount:''}
          ]);
  toast.success(
           <div className="flex justify-between items-center">
             <span>Listing updated successfully!</span>
             <button 
               onClick={() => toast.dismiss()}
               className="text-gray-500 hover:text-gray-700 ml-4"
             >
               ×
             </button>
           </div>,
           {
             duration: 3000,
             style: {
               background: '#ECFDF5',
               color: '#065F46',
               border: '1px solid #A7F3D0',
               borderRadius: '0.5rem',
               padding: '1rem',
             },
             className: '!pl-4'
           }
         );
 navigate(-1)
        }else{

          listingResponse = await providerCreateListing(listingData);
          setCustomPolicy([
            {days:'', refundAmount:''}
          ]);
           toast.success(
           <div className="flex justify-between items-center">
             <span>Listing created successfully!</span>
             <button 
               onClick={() => toast.dismiss()}
               className="text-gray-500 hover:text-gray-700 ml-4"
             >
               ×
             </button>
           </div>,
           {
             duration: 3000,
             style: {
               background: '#ECFDF5',
               color: '#065F46',
               border: '1px solid #A7F3D0',
               borderRadius: '0.5rem',
               padding: '1rem',
             },
             className: '!pl-4'
           }
         );
         navigate(-1)
        }
  
        if (listingResponse?._id) {
          toast.success(
            <div className="flex justify-between items-center">
              <span>Listing created successfully and submitted for approval!</span>
              <button 
                onClick={() => toast.dismiss()}
                className="text-gray-500 hover:text-gray-700 ml-4"
              >
                ×
              </button>
            </div>,
            {
              duration: 3000,
              style: {
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
              className: '!pl-4'
            }
          );
          navigate("/provider/your-listings");
        }
      } else {
          listingData.filterData = filterData;
        console.log("Creating listing as admin");
        //  listingResponse = await providerCreateListing(listingData);
       
        // if (!token) throw new Error("Authentication token not found. Please log in again.");
  
        // const response = await fetch(`${apiUrl}/api/admins/add-listing`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({
        //     ...listingData,
        //     owner: localStorage.getItem("adminId") || localStorage.getItem("userId"),
        //     ownerType: "Admin",
        //   }),
        // });
  
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(`Failed to create listing: ${errorData.message || response.statusText}`);
        // }
  
        // listingResponse = await response.json();
  
        if (id) {
           console.log("Update new listing as admin");
           listingResponse = await updateListing(id,listingData);

       
  setCustomPolicy([
            {days:'', refundAmount:''}
          ]);
          toast.success(
            <div className="flex justify-between items-center">
              <span>Listing updated successfully!</span>
              <button 
                onClick={() => toast.dismiss()}
                className="text-gray-500 hover:text-gray-700 ml-4"
              >
                ×
              </button>
            </div>,
            {
              duration: 3000,
              style: {
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
              className: '!pl-4'
            }
          );
          navigate(-1);
          // navigate(`/accommodation/${listingResponse._id}`, { state: { from: "admin" } });
        }else{
         
          console.log("Creating new listing as admin");
          
           listingResponse = await providerCreateListing(listingData);
           setCustomPolicy([
            {days:'', refundAmount:''}
          ]);
        toast.success(
            <div className="flex justify-between items-center">
              <span>Listing created successfully!</span>
              <button 
                onClick={() => toast.dismiss()}
                className="text-gray-500 hover:text-gray-700 ml-4"
              >
                ×
              </button>
            </div>,
            {
              duration: 3000,
              style: {
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                borderRadius: '0.5rem',
                padding: '1rem',
              },
              className: '!pl-4'
            }
          );
          navigate(-1);
        }
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error(
        <div className="flex justify-between items-center">
          <span>{`Failed to ${isEditMode ? "update" : "create"} listing. Please try again. Error: ${error.message}`}</span>
          <button 
            onClick={() => toast.dismiss()}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            ×
          </button>
        </div>,
        {
          duration: 5000,
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FECACA',
            borderRadius: '0.5rem',
            padding: '1rem',
          },
          className: '!pl-4'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

// 1 may function  
  // const handleSubmit = async () => {
  //   try {
  //     // Log cancellation policy and location data
  //     console.log('Cancellation Policy:', formData.policies.cancellationPolicy);
  //     console.log('Location:', formData.location);

  //     const validationErrors = [];
  
  //     // ===== Validation =====
  //     if (!formData?.title) validationErrors.push("Listing title is required");
  //     if (!formData?.propertyType) validationErrors.push("Property type is required");
  //     if (!formData?.capacity.people) validationErrors.push("Number of people is required");
  //     if (!formData?.capacity.dogs) validationErrors.push("Number of dogs is required");
  //     if (!formData?.capacity.bedrooms) validationErrors.push("Number of bedrooms is required");
  //     if (!formData?.capacity.rooms) validationErrors.push("Number of rooms is required");
  //     if (!formData?.capacity.washrooms) validationErrors.push("Number of washrooms is required");
  //     if (!formData?.pricing.regularPrice) validationErrors.push("Regular price is required");
  //     if (!formData?.pricing.currency) validationErrors.push("Currency is required");
  
  //     if (!formData?.availability?.checkInDates || !formData?.availability?.checkInDate || !formData?.availability?.checkOutDate) {
  //       validationErrors.push("Check-in dates are required");
  //     }
  //     if (!formData?.availability?.checkInTime?.hour || !formData?.availability?.checkInTime?.period) {
  //       validationErrors.push("Check-in time is required");
  //     }
  //     if (!formData?.availability?.checkOutTime?.hour || !formData?.availability?.checkOutTime?.period) {
  //       validationErrors.push("Check-out time is required");
  //     }
  
  //     if (!formData?.mainImage) validationErrors.push("Main image is required");
  //     if (!formData?.galleryImages || formData?.galleryImages.length < 4) {
  //       validationErrors.push("At least 4 gallery images are required");
  //     }
  
  //     if (!formData?.shortDescription) validationErrors.push("Short description is required");
  //     if (!formData?.fullDescription) validationErrors.push("Full description is required");
  
  //     if (!formData?.location.mapLocation) validationErrors.push("Map location is required");
  //     if (!formData?.policies.cancellationPolicy) validationErrors.push("Cancellation policy is required");
  //     if (formData?.policies.cancellationPolicy === 'custom' && !formData.policies?.customPolicyDetails) {
  //       validationErrors.push("Custom policy details are required when using custom cancellation policy");
  //     }
  
  //     // if (validationErrors.length > 0) {
  //     //   toast.error(
  //     //     <div className="space-y-2">
  //     //       <div className="flex justify-between items-start">
  //     //         <p className="font-medium">Please fix the following errors:</p>
  //     //         <button 
  //     //           onClick={() => toast.dismiss()}
  //     //           className="text-gray-500 hover:text-gray-700"
  //     //         >
  //     //           ×
  //     //         </button>
  //     //       </div>
  //     //       <ul className="list-disc list-inside text-sm">
  //     //         {validationErrors.map((error, index) => (
  //     //           <li key={index}>{error}</li>
  //     //         ))}
  //     //       </ul>
  //     //     </div>,
  //     //     {
  //     //       duration: 5000,
  //     //       style: {
  //     //         background: '#FEF2F2',
  //     //         color: '#991B1B',
  //     //         border: '1px solid #FECACA',
  //     //         borderRadius: '0.5rem',
  //     //         padding: '1rem',
  //     //         maxWidth: '32rem',
  //     //       },
  //     //       className: '!pl-4'
  //     //     }
  //     //   );
  //     //   return;
  //     // }
  
  //     setIsLoading(true);
  
  //     // ===== Prepare Data =====
  //     const uniqueCode = generateUniqueListingCode();
  //     const photos = [formData?.mainImage, ...formData?.galleryImages?.filter(img => typeof img === "string")];
  
  //     let coordinates = [0, 0];
  //     const location = formData.location?.mapLocation;
  //     if (location) {
  //       if (typeof location === "string") {
  //         try {
  //           const parsed = JSON.parse(location);
  //           coordinates = [parsed.lng, parsed.lat];
  //         } catch (e) {
  //           console.warn("Could not parse coordinates:", e);
  //         }
  //       } else if (location.lat && location.lng) {
  //         coordinates = [location.lng, location.lat];
  //       }
  //     }
  
  //     const listingData = {
  //       Code: uniqueCode,
  //       title: formData?.title,
  //       listingType: formData?.propertyType,
  //       description: {
  //         general: formData?.fullDescription,
  //         short: formData?.shortDescription,
  //       },
  //       checkInTime: formData?.availability?.checkInTime
  //         ? new Date(`1970-01-01T${formData?.availability?.checkInTime?.hour}:00${formData?.availability.checkInTime.period === 'PM' ? '+12:00' : ':00'}`)
  //         : null,
  //       checkOutTime: formData.availability?.checkOutTime
  //         ? new Date(`1970-01-01T${formData?.availability?.checkOutTime?.hour}:00${formData?.availability.checkOutTime.period === 'PM' ? '+12:00' : ':00'}`)
  //         : null,
  //       checkInDates: formData?.availability?.checkInDates || '',
  //       location: {
  //         address: formData?.location?.fullAddress,
  //         optional: formData?.location?.city || "",
  //         type: 'Point',
  //         coordinates,
  //       },
  //       pricePerNight: {
  //         price: formData?.pricing?.regularPrice,
  //         currency: formData?.pricing?.currency,
  //       },
  //       maxDogs: formData?.capacity?.dogs,
  //       maxGuests: formData?.capacity?.people,
  //       bedRooms: formData?.capacity?.bedrooms,
  //       rooms: {
  //         number: formData?.capacity?.rooms,
  //       },
  //       washrooms: formData?.capacity?.washrooms,
  //       status: isProviderMode ? "pending approval" : (formData?.availability?.active ? "active" : "pending approval"),
  //       images: photos,
  //       legal: {
  //         cancellationPolicy: formData?.policies?.cancellationPolicy,
  //         customPolicyDetails: formData?.policies?.customPolicyDetails,
  //       },
  //     };
  
  //     const filterData = { subsections: [] };
  //     if (template?.subsections) {
  //       template.subsections.forEach(section => {
  //         const newSection = {
  //           name: section.name,
  //           description: section.description,
  //           hasSubsections: section.hasSubsections,
  //           subsubsections: [],
  //           filters: [],
  //         };
  
  //         if (section.filters) {
  //           section.filters.forEach(filter => {
  //             const value = formData[`${section.name.toLowerCase()}_${filter.name.toLowerCase()}`];
  //             if (value !== undefined) {
  //               newSection.filters.push({ name: filter.name, type: filter.type, value });
  //             }
  //           });
  //         }
  
  //         if (section.subsubsections) {
  //           section.subsubsections.forEach(subsub => {
  //             const subData = formData[`amenities_${subsub.name.toLowerCase().replace(/\s+/g, '_')}`] || {};
  //             const newSubsub = {
  //               name: subsub.name,
  //               description: subsub.description,
  //               filters: subsub.filters
  //                 .filter(filter => subData[filter.name])
  //                 .map(filter => ({ name: filter.name, type: filter.type, value: true })),
  //             };
  //             if (newSubsub.filters.length > 0) newSection.subsubsections.push(newSubsub);
  //           });
  //         }
  
  //         filterData.subsections.push(newSection);
  //       });
  //     }
  
  //     let listingResponse;
  //     const token = localStorage.getItem("token");
  //     const apiUrl = import.meta.env.VITE_BE_BASE_URL || "http://localhost:5000";
  
  //     if (isProviderMode) {
  //       console.log("Creating listing as provider");
  //       listingData.filterData = filterData;
  //       if(id){
  //         listingResponse = await updateListing(id,listingData);


  //       }else{

  //         listingResponse = await providerCreateListing(listingData);
  //       }
  
  //       if (listingResponse?._id) {
  //         toast.success(
  //           <div className="flex justify-between items-center">
  //             <span>Listing created successfully and submitted for approval!</span>
  //             <button 
  //               onClick={() => toast.dismiss()}
  //               className="text-gray-500 hover:text-gray-700 ml-4"
  //             >
  //               ×
  //             </button>
  //           </div>,
  //           {
  //             duration: 3000,
  //             style: {
  //               background: '#ECFDF5',
  //               color: '#065F46',
  //               border: '1px solid #A7F3D0',
  //               borderRadius: '0.5rem',
  //               padding: '1rem',
  //             },
  //             className: '!pl-4'
  //           }
  //         );
  //         navigate("/provider/your-listings");
  //       }
  //     } else {
  //       console.log("Creating listing as admin");
  //       if (!token) throw new Error("Authentication token not found. Please log in again.");
  
  //       const response = await fetch(`${apiUrl}/api/admins/add-listing`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           ...listingData,
  //           owner: localStorage.getItem("adminId") || localStorage.getItem("userId"),
  //           ownerType: "Admin",
  //         }),
  //       });
  
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`Failed to create listing: ${errorData.message || response.statusText}`);
  //       }
  
  //       listingResponse = await response.json();
  
  //       if (listingResponse?._id) {
  //         try {
  //           filterData.listing = listingResponse._id;
  
  //           const filterResponse = await fetch(`${apiUrl}/api/filters`, {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${token}`,
  //             },
  //             body: JSON.stringify(filterData),
  //           });
  
  //           if (filterResponse.ok) {
  //             const filterRes = await filterResponse.json();
  //             if (filterRes?._id) {
  //               await fetch(`${apiUrl}/api/listings/${listingResponse._id}`, {
  //                 method: "PUT",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //                 body: JSON.stringify({ filters: filterRes._id }),
  //               });
  //             }
  //           }
  //         } catch (err) {
  //           console.error("Error with filter creation:", err);
  //         }
  
  //         toast.success(
  //           <div className="flex justify-between items-center">
  //             <span>Listing created successfully!</span>
  //             <button 
  //               onClick={() => toast.dismiss()}
  //               className="text-gray-500 hover:text-gray-700 ml-4"
  //             >
  //               ×
  //             </button>
  //           </div>,
  //           {
  //             duration: 3000,
  //             style: {
  //               background: '#ECFDF5',
  //               color: '#065F46',
  //               border: '1px solid #A7F3D0',
  //               borderRadius: '0.5rem',
  //               padding: '1rem',
  //             },
  //             className: '!pl-4'
  //           }
  //         );
  //         navigate(`/accommodation/${listingResponse._id}`, { state: { from: "admin" } });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error saving listing:", error);
  //     toast.error(
  //       <div className="flex justify-between items-center">
  //         <span>{`Failed to ${isEditMode ? "update" : "create"} listing. Please try again. Error: ${error.message}`}</span>
  //         <button 
  //           onClick={() => toast.dismiss()}
  //           className="text-gray-500 hover:text-gray-700 ml-4"
  //         >
  //           ×
  //         </button>
  //       </div>,
  //       {
  //         duration: 5000,
  //         style: {
  //           background: '#FEF2F2',
  //           color: '#991B1B',
  //           border: '1px solid #FECACA',
  //           borderRadius: '0.5rem',
  //           padding: '1rem',
  //         },
  //         className: '!pl-4'
  //       }
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  // console.log(activeTab, "active tab");
  

  const handleNext = () => {
     const validationErrors = [];
  
     if (activeTab === "basicInfo") {
      // ===== Validation =====
      if (!formData?.title) validationErrors.push("Listing title is required");
      if (!formData?.propertyType) validationErrors.push("Property type is required");
      if (!formData?.capacity.people) validationErrors.push("Number of people is required");
      if (!formData?.capacity.dogs) validationErrors.push("Number of dogs is required");
      if (!formData?.capacity.bedrooms) validationErrors.push("Number of bedrooms is required");
      if (!formData?.capacity.rooms) validationErrors.push("Number of rooms is required");
      if (!formData?.capacity.washrooms) validationErrors.push("Number of washrooms is required");
      if (!formData?.pricing.regularPrice) validationErrors.push("Regular price is required");
      if (!formData?.pricing.currency) validationErrors.push("Currency is required");
  
      // if (!formData?.availability?.checkInDates || !formData?.availability?.checkInDate || !formData?.availability?.checkOutDate) {
      //   validationErrors.push("Check-in dates are required");
      // }
      if (!formData?.availability?.checkInTime?.hour || !formData?.availability?.checkInTime?.period) {
        validationErrors.push("Check-in time is required");
      }
      if (!formData?.availability?.checkOutTime?.hour || !formData?.availability?.checkOutTime?.period) {
        validationErrors.push("Check-out time is required");
      }
    }else if (activeTab === "photos") {

      if (!formData?.mainImage) validationErrors.push("Main image is required");
      // if (!formData?.galleryImages || formData?.galleryImages.length < 4) {
      //   validationErrors.push("At least 4 gallery images are required");
      // }

    }else if( activeTab === "description") {
       if ( !formData?.shortDescription) validationErrors.push("Description is required");
      
    }else if (activeTab === "policiesLocation") {
       if (!formData?.location.mapLocation) validationErrors.push("Map location is required");
      if (!formData?.policies.cancellationPolicy) validationErrors.push("Cancellation policy is required");
      if (formData?.policies.cancellationPolicy === 'custom' && customPolicy?.length < 1) {
        validationErrors.push("Custom policy details are required when using custom cancellation policy");
      }
    }

      if (validationErrors.length > 0) {
        toast.error(
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <p className="font-medium">Please fix the following errors:</p>
              <button 
                onClick={() => toast.dismiss()}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ul className="list-disc list-inside text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>,
          {
            duration: 5000,
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxWidth: '32rem',
            },
            className: '!pl-4'
          }
        );
        return;
      }

const findIndex = availableTabs.findIndex(tab => tab.id === activeTab);

console.log(findIndex, "find index");
    if (findIndex !== -1 || findIndex !== availableTabs.length - 1) {
      setActiveTab(availableTabs[findIndex+1]?.id );}
  }


  const handleBack =() => {
    const findIndex = availableTabs.findIndex(tab => tab.id === activeTab);

console.log(findIndex, "find index");
    if (findIndex !== -1 || findIndex !== availableTabs.length - 1) {
      setActiveTab(availableTabs[findIndex-1]?.id );}
  }
  
  const handleActivateDiscount = () => {
    setIsDiscount(!isDiscount)
  }

  const renderForm = () => {
    if (!template) return <div>Loading template...</div>;
    if (!activeTab) return null;

    const getSubsection = (name) => template.subsections?.find(s => s.name === name);
    const currentTab = allTabs.find(tab => tab.id === activeTab);
    const subsection = currentTab ? getSubsection(currentTab.templateName) : null;

    // Only render if we have both the tab configuration and corresponding subsection
    if (!subsection) return null;
console.log(subsection , "kln");

    switch (activeTab) {
      case "basicInfo":
        return (
          <BasicInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            subsection={subsection}
            isProviderMode={isProviderMode}
            isDiscount={isDiscount}
            handleActivateDiscount={handleActivateDiscount}
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
            customPolicy={customPolicy}
            setCustomPolicy={setCustomPolicy}
            setAdditionalFile={setAdditionalFile}
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
          onClick={() => navigate(isProviderMode ? "/provider/your-listings" : "/admin/accommodations")}
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
                // onClick={() => setActiveTab(tab.id)}
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
        {activeTab == "basicInfo" ?
          <button
            type="button"
            onClick={() => navigate(isProviderMode ? "/provider/your-listings" : "/admin/accommodations")}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
            Cancel
          </button>
          :
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
            Back
          </button>
          }
          {activeTab == "policiesLocation" ? 
         
           <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
            >
            <Save className="w-4 h-4" />
            {isProviderMode ? "Submit Listing for Approval" : "Publish Listing"}
            </button> 
          :
           <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
          >
           Next
          </button>
            }
        </div>
      </div>
    </div>
  );
};

export default AddAccommodation;