import React, { useState, useEffect } from "react";
import { Upload, Camera, Edit3, Plus, X } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getUserProfile, updateUserProfile } from "../../api/authAPI";
import { updateProviderProfile } from "../../api/providerAPI";
import { getProviderProfile } from "../../api/providerAPI";
import { getUserType, isUserType } from "../../utils/authService";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const ProviderPublicProfile = () => {
  const { t } = useLanguage();
  const {state} = useLocation()
  console.log(state);
  
  // Update the initial state to use streetNumber instead of street
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    aboutYou: "", // Changed from bio to aboutYou
    streetNumber: "", // This is already correct
    dateOfBirth: "",
    nationality: "",
    gender: "",
    isProvider: false,
    profilePicture: null,
    customerNumber: "",
    dogs: [{ id: 1, name: "", gender: "" }],
    travellers: [{ id: 1, name: "", gender: "", relationship: "" }],
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // Get user ID from localStorage or context
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Decode token to get user ID
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id;

        // Determine whether to use user or provider API based on user type
        const userType = getUserType();
        let userData;

        if (userType === "provider") {
          userData = await getProviderProfile();
        } else {
          userData = await getUserProfile(userId);
        }

        // Map backend data to component state
        setProfileData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          aboutYou: userData.aboutYou || "", // Consistent naming
          streetNumber: userData.paymentMethod?.streetNumber || "", // Changed from street to streetNumber
          dateOfBirth: userData.dateOfBirth || "",
          nationality: userData.nationality || "",
          gender: userData.gender || "",
          isProvider: userData.isProvider || false, // Now mapping from the backend
          profilePicture: null,
          customerNumber: userData.customerNumber || "",
          dogs: userData.dogs?.map((dog) => ({
            id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for frontend
            name: dog.name || "",
            gender: dog.gender || "",
          })) || [{ id: 1, name: "", gender: "" }],
          // Initialize travellers array even if it doesn't exist in backend data
          travellers: userData.travellers?.map((traveller) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: traveller.name || "",
            gender: traveller.gender || "",
            relationship: traveller.relationship || "",
          })) || [{ id: 1, name: "", gender: "", relationship: "" }],
        });

        // Set profile picture if available
        if (userData.profilePicture && userData.profilePicture !== "N/A") {
          setPreviewImage(userData.profilePicture);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData((prev) => ({ ...prev, profilePicture: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleProviderCustomer = () => {
    setProfileData((prev) => ({ ...prev, isProvider: !prev.isProvider }));
  };

  const handleDogInputChange = (id, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      dogs: prev.dogs.map((dog) =>
        dog.id === id ? { ...dog, [field]: value } : dog
      ),
    }));
  };

  const addDog = () => {
    const newId =
      profileData.dogs.length > 0
        ? Math.max(...profileData.dogs.map((dog) => dog.id)) + 1
        : 1;

    setProfileData((prev) => ({
      ...prev,
      dogs: [...prev.dogs, { id: newId, name: "", gender: "" }],
    }));
  };

  const removeDog = (id) => {
    if (profileData.dogs.length > 1) {
      setProfileData((prev) => ({
        ...prev,
        dogs: prev.dogs.filter((dog) => dog.id !== id),
      }));
    }
  };

  const handleTravellerInputChange = (id, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      travellers: prev.travellers.map((traveller) =>
        traveller.id === id ? { ...traveller, [field]: value } : traveller
      ),
    }));
  };

  const addTraveller = () => {
    const newTravellerId =
      Math.max(0, ...profileData.travellers.map((t) => t.id)) + 1;
    setProfileData((prev) => ({
      ...prev,
      travellers: [
        ...prev.travellers,
        { id: newTravellerId, name: "", gender: "", relationship: "" },
      ],
    }));
  };

  const removeTraveller = (id) => {
    if (profileData.travellers.length > 1) {
      setProfileData((prev) => ({
        ...prev,
        travellers: prev.travellers.filter((t) => t.id !== id),
      }));
    }
  };

  // In the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Create a clean copy of the data to send
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        aboutYou: profileData.aboutYou,
        dateOfBirth: profileData.dateOfBirth,
        nationality: profileData.nationality,
        gender: profileData.gender,
        isProvider: profileData.isProvider,
        // For nested objects, make sure to include the entire structure
        paymentMethod: {
          streetNumber: profileData.streetNumber,
          // Include other payment fields to avoid overwriting them with undefined
          cardNumber: "N/A",
          cardHolderName: "N/A",
          optional: "N/A",
          postalCode: "N/A",
          city: "N/A",
          state: "N/A",
          country: "N/A",
          expiryDate: "N/A",
        },
        // Format dogs array for backend - remove frontend-specific IDs
        dogs: profileData.dogs.map((dog) => ({
          name: dog.name,
          gender: dog.gender,
        })),
        // Format travellers array for backend - remove frontend-specific IDs
        travellers: profileData.travellers.map((traveller) => ({
          name: traveller.name,
          gender: traveller.gender,
          relationship: traveller.relationship,
        })),
      };

      // Handle the profile picture properly
      if (profileData.profilePicture) {
        // If it's a File object, it will be uploaded in the API function
        // If it's already a string URL, pass it as is
        updateData.profilePicture = profileData.profilePicture;
      }

      console.log("Sending update data:", updateData);

      // Determine whether to use user or provider update API based on user type
      let result;
      const userType = getUserType();

      if (userType === "provider") {
        result = await updateProviderProfile(updateData);
      } else {
        result = await updateUserProfile(updateData);
      }

      console.log("Update result:", result);

      // Update the user data in localStorage to reflect changes in Navbar
      if (result) {
        // Get the correct storage key based on user type
        const storageKey =
          userType === "provider" ? "provider_user" : "user_data";
        const userData = JSON.parse(localStorage.getItem(storageKey) || "{}");
        const updatedUserData = {
          ...userData,
          firstName: result.firstName || userData.firstName,
          lastName: result.lastName || userData.lastName,
          profilePicture: result.profilePicture || userData.profilePicture,
        };
        localStorage.setItem(storageKey, JSON.stringify(updatedUserData));

        // Force refresh the navbar by triggering a storage event
        window.dispatchEvent(new Event("storage"));
      }

      setIsEditing(false);
      // Show success toast notification
      toast.success(t("profile_saved_successfully"), {
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        iconTheme: {
          primary: "#B4A481",
          secondary: "white",
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      // Show error toast notification
      toast.error(t("profile_update_failed"), {
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <div className="flex justify-between items-center ">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {t("profile")}
              </h1>
             
            </div>
          </div>

          <form className="px-6 py-8 sm:px-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-brand/20 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {state?.data?.profilePicture && (
                    <img
                      src={state?.data?.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                     
                    />
                  ) }
                </div>
              
              </div>
             </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("first_name")}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={state?.data?.firstName}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("last_name")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={state?.data?.lastName}
                
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("about_you")}
              </label>
              <textarea
                name="aboutYou" // Changed from bio to aboutYou
                value={state?.data?.aboutYou} // Changed from bio to aboutYou
                
                disabled={!isEditing}
                placeholder={t("bio_placeholder")}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-500">{t("relationship_text")}</p>
            </div>

            {/* Address, DOB, Nationality, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("Website")}
                </label>
                <input
                  type="text"
                  name="streetNumber"
                  value={state?.data?.website}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("phone_number")}
                </label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={state?.data?.phoneNumber}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("business_name")}
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={state?.data?.businessName}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("business_type")}
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={state?.data?.businessType}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Customer Number */}
            {/* <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-800">
                    {t("customer_number") || "Customer Number"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("customer_number_desc") ||
                      "Your unique customer identification number"}
                  </p>
                </div>
                <div className="text-lg font-semibold text-brand">
                  {profileData.customerNumber ? (
                    profileData.customerNumber
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </div>
              </div>
            </div> */}

         
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderPublicProfile;
