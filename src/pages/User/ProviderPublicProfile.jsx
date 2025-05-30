import React, { useState, useEffect, memo, useMemo } from "react";
import { Upload, Camera, Edit3, Plus, X, Slice } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getUserProfile, updateUserProfile } from "../../api/authAPI";
import { updateProviderProfile } from "../../api/providerAPI";
import { getProviderProfile } from "../../api/providerAPI";
import { getUserType, isUserType } from "../../utils/authService";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import AccommodationCard from "../../components/HomeComponents/AccommodationCard";
import API from "../../api/config";
import { getListingById } from "../../api/listingAPI";
import logo from "../../assets/logo.png";


// Skeleton card for loading state
const SkeletonCard = memo(() => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="rounded-xl overflow-hidden mb-3 relative bg-gray-200 h-48 w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
});

const RecommendationsSection = memo(({ title, listings, isLoading }) => {
  const { t } = useLanguage();
  const skeletonCards = useMemo(
    () =>
      Array(6)
        .fill()
        .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />),
    []
  );

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
        {isLoading ? (
          // Show skeleton cards when loading
          skeletonCards
        ) : listings && listings.length > 0 ? (
          listings?.map((listing,i ) => (
            <AccommodationCard
              key={i}
              id={listing?._id}
              image={
                listing?.images && listing?.images?.length > 0
                  ? listing?.images[0]
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              price={listing?.dynamicPrice || listing?.pricePerNight?.price || 0}
              location={listing?.title || "Unnamed Accommodation"}
              provider={listing?.provider || "Unknown"}
              listingSource={
                listing?.listingSource ||
                (listing?.source && listing?.source?.name) ||
                "Provider"
              }
              pricePerNight={
                listing?.dynamicPrice
                  ? { price: listing?.dynamicPrice, currency: "CHF" }
                  : listing?.pricePerNight
              }
            //   isFavorited={isLoggedIn && favorites.includes(listing._id)}
            />
          ))
        ) : (
          <p>{t("no_listings_available")}</p>
        )}
      </div>
    </div>
  );
});


const ProviderPublicProfile = () => {
  const { t } = useLanguage();
  const {state} = useLocation()
  const userType = localStorage?.getItem("userType")
  // console.log(state);
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    console.log("func chala");
  let data;
    try {
      if (state?.data?.role != "admin"){

        data = await Promise.all(
          state?.data?.listings?.slice(0,4)?.map((id) => getListingById(id))
        );
      }else{
        data = await Promise.all(
          state?.data?.topRecommendations?.slice(0,4)?.map((id) => getListingById(id))
        );

      }
      console.log("yaham tak jkjj");
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };
  
  useEffect(() => {
    if (state?.data?.listings?.length > 0 || state?.data?.topRecommendations?.length > 0) {
      fetchListings();
    }
  }, [state?.data]);

  console.log(listings, state?.data?.listings);
  console.log(listings, state?.data?.topRecommendations);
  

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

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data when component mounts
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       setIsLoading(true);
  //       // Get user ID from localStorage or context
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         throw new Error("No authentication token found");
  //       }

  //       // Decode token to get user ID
  //       const tokenData = JSON.parse(atob(token.split(".")[1]));
  //       const userId = tokenData.id;

  //       // Determine whether to use user or provider API based on user type
  //       const userType = getUserType();
  //       let userData;

  //       if (userType === "provider") {
  //         userData = await getProviderProfile();
  //       } else {
  //         userData = await getUserProfile(userId);
  //       }

  //       // Map backend data to component state
  //       setProfileData({
  //         firstName: userData.firstName || "",
  //         lastName: userData.lastName || "",
  //         aboutYou: userData.aboutYou || "", // Consistent naming
  //         streetNumber: userData.paymentMethod?.streetNumber || "", // Changed from street to streetNumber
  //         dateOfBirth: userData.dateOfBirth || "",
  //         nationality: userData.nationality || "",
  //         gender: userData.gender || "",
  //         isProvider: userData.isProvider || false, // Now mapping from the backend
  //         profilePicture: null,
  //         customerNumber: userData.customerNumber || "",
  //         dogs: userData.dogs?.map((dog) => ({
  //           id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for frontend
  //           name: dog.name || "",
  //           gender: dog.gender || "",
  //         })) || [{ id: 1, name: "", gender: "" }],
  //         // Initialize travellers array even if it doesn't exist in backend data
  //         travellers: userData.travellers?.map((traveller) => ({
  //           id: Math.random().toString(36).substr(2, 9),
  //           name: traveller.name || "",
  //           gender: traveller.gender || "",
  //           relationship: traveller.relationship || "",
  //         })) || [{ id: 1, name: "", gender: "", relationship: "" }],
  //       });

  //       // Set profile picture if available
  //       if (userData.profilePicture && userData.profilePicture !== "N/A") {
  //         setPreviewImage(userData.profilePicture);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch profile:", error);
  //       setError("Failed to load profile data. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);
console.log(state?.data);


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
                  {state?.data?.profilePicture  && (
                    <img
                      src={state?.data?.profilePicture }
                      alt="Profile"
                      className="w-full h-full object-cover"
                     
                    />
                  ) }
                  {!state?.data?.profilePicture && logo  && (
                    <img
                      src={logo }
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
                  {state?.data?.role != "admin" ? t("first_name") : t("user_name")}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={state?.data?.role != "admin" ? state?.data?.firstName : state?.data?.username 
                    || "admin"
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {state?.data?.role != "admin" ? t("last_name") : t("email")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={state?.data?.role != "admin" ? state?.data?.lastName : state?.data?.email}
                
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Bio Section */}
            {state?.data?.role !== "admin" && 
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("about_you")}
              </label>
              <textarea
                name="aboutYou" // Changed from bio to aboutYou
                value={state?.data?.bio} // Changed from bio to aboutYou
                
                disabled={!isEditing}
                placeholder={t("bio_placeholder")}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500 min-h-[120px] resize-none"
              />
              <p className="text-sm text-gray-500">{t("relationship_text")}</p>
            </div>
            }

            {listings?.length > 0 &&
            <RecommendationsSection
            title={t("my_accommodations")}
            listings={listings}
            isLoading={false}
            />
        }

            {/* Address, DOB, Nationality, Gender */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div> */}

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
