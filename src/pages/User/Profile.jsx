import React, { useState, useEffect } from "react";
import { Upload, Camera, Edit3, Plus, X } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getUserProfile, updateUserProfile } from "../../api/authAPI";

const Profile = () => {
  const { t } = useLanguage();
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

        const userData = await getUserProfile(userId);

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

      // If profile picture was updated and is a string (URL), include it
      if (previewImage && typeof previewImage === "string") {
        updateData.profilePicture = previewImage;
      }

      console.log("Sending update data:", updateData);

      const result = await updateUserProfile(updateData);
      console.log("Update result:", result);

      setIsEditing(false);
      // Show success message or notification
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {t("profile_settings")}
              </h1>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t("cancel_editing") : t("edit_profile")}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-brand/20 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full cursor-pointer hover:bg-brand/90 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">{t("supported_formats")}</p>
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
                  value={profileData.firstName}
                  onChange={handleInputChange}
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
                  value={profileData.lastName}
                  onChange={handleInputChange}
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
                value={profileData.aboutYou} // Changed from bio to aboutYou
                onChange={handleInputChange}
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
                  {t("street_number")}
                </label>
                <input
                  type="text"
                  name="streetNumber"
                  value={profileData.streetNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("date_of_birth")}
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("nationality")}
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={profileData.nationality}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("gender")}
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">{t("select_gender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                  <option value="preferNotToSay">
                    {t("prefer_not_to_say")}
                  </option>
                </select>
              </div>
            </div>

            {/* Customer Number */}
            <div className="p-4 bg-gray-50 rounded-lg">
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
                  {profileData.customerNumber || "Not assigned"}
                </div>
              </div>
            </div>

            {/* Customer - Provider Toggle */}
            <div className="py-4 border-t border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {t("account_type")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("account_type_desc")}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`mr-3 font-medium ${
                      !profileData.isProvider ? "text-brand" : "text-gray-500"
                    }`}
                  >
                    {t("customer")}
                  </span>
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={toggleProviderCustomer}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      profileData.isProvider ? "bg-brand" : "bg-gray-200"
                    } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.isProvider
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`ml-3 font-medium ${
                      profileData.isProvider ? "text-brand" : "text-gray-500"
                    }`}
                  >
                    {t("provider")}
                  </span>
                </div>
              </div>
            </div>

            {/* Dogs Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {t("your_dogs")}
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addDog}
                    className="flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t("add_dog")}
                  </button>
                )}
              </div>

              {profileData.dogs.map((dog, index) => (
                <div
                  key={dog.id}
                  className="p-4 border rounded-lg bg-gray-50 relative"
                >
                  {isEditing && profileData.dogs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDog(dog.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("dog_name")}
                      </label>
                      <input
                        type="text"
                        value={dog.name}
                        onChange={(e) =>
                          handleDogInputChange(dog.id, "name", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("gender")}
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`dog-gender-${dog.id}`}
                            value="male"
                            checked={dog.gender === "male"}
                            onChange={() =>
                              handleDogInputChange(dog.id, "gender", "male")
                            }
                            disabled={!isEditing}
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              dog.gender === "male"
                                ? "border-brand bg-brand/10"
                                : "border-gray-300"
                            }`}
                          >
                            {dog.gender === "male" && (
                              <div className="w-3 h-3 rounded-full bg-brand" />
                            )}
                          </div>
                          <span>{t("male")}</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`dog-gender-${dog.id}`}
                            value="female"
                            checked={dog.gender === "female"}
                            onChange={() =>
                              handleDogInputChange(dog.id, "gender", "female")
                            }
                            disabled={!isEditing}
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              dog.gender === "female"
                                ? "border-brand bg-brand/10"
                                : "border-gray-300"
                            }`}
                          >
                            {dog.gender === "female" && (
                              <div className="w-3 h-3 rounded-full bg-brand" />
                            )}
                          </div>
                          <span>{t("female")}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Other Travellers Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {t("other_travellers")}
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addTraveller}
                    className="flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t("add_traveller")}
                  </button>
                )}
              </div>

              {profileData.travellers.map((traveller) => (
                <div
                  key={traveller.id}
                  className="p-4 border rounded-lg bg-gray-50 relative"
                >
                  {isEditing && profileData.travellers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTraveller(traveller.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        value={traveller.name}
                        onChange={(e) =>
                          handleTravellerInputChange(
                            traveller.id,
                            "name",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("relationship")}
                      </label>
                      <select
                        value={traveller.relationship}
                        onChange={(e) =>
                          handleTravellerInputChange(
                            traveller.id,
                            "relationship",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="">{t("select_relationship")}</option>
                        <option value="partner">{t("partner")}</option>
                        <option value="friend">{t("friend")}</option>
                        <option value="family">{t("family")}</option>
                        <option value="other">{t("other")}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t("gender")}
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`traveller-gender-${traveller.id}`}
                            value="male"
                            checked={traveller.gender === "male"}
                            onChange={() =>
                              handleTravellerInputChange(
                                traveller.id,
                                "gender",
                                "male"
                              )
                            }
                            disabled={!isEditing}
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              traveller.gender === "male"
                                ? "border-brand bg-brand/10"
                                : "border-gray-300"
                            }`}
                          >
                            {traveller.gender === "male" && (
                              <div className="w-3 h-3 rounded-full bg-brand" />
                            )}
                          </div>
                          <span>{t("male")}</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`traveller-gender-${traveller.id}`}
                            value="female"
                            checked={traveller.gender === "female"}
                            onChange={() =>
                              handleTravellerInputChange(
                                traveller.id,
                                "gender",
                                "female"
                              )
                            }
                            disabled={!isEditing}
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              traveller.gender === "female"
                                ? "border-brand bg-brand/10"
                                : "border-gray-300"
                            }`}
                          >
                            {traveller.gender === "female" && (
                              <div className="w-3 h-3 rounded-full bg-brand" />
                            )}
                          </div>
                          <span>{t("female")}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium"
                >
                  {t("save_changes")}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );

  // Show loading state
  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Profile;
