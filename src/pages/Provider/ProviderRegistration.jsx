import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, HelpCircle } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { completeProviderRegistration } from "../../api/authAPI";
import { useLanguage } from "../../utils/LanguageContext";
import { connectToStripe, getStripeAccount } from "../../api/paymentAPI";
import { changeMetaData } from "../../utils/extra";
import Modal from "../../components/Auth/Modal";
import TermsContent from "../../components/Auth/TermsContent";
import DataPolicy from "../../components/Footer/DataPolicy";
import { getProviderProfile } from "../../api/providerAPI";
import toast from "react-hot-toast";

const ProviderRegistration = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const accountId = searchParams.get("account");

  // State declarations
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDataPolicyOpen, setIsDataPolicyOpen] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeAccount, setStripeAccount] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const buttonRef = useRef(null);


  // Initialize form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "Switzerland",
    },
    dateOfBirth: "",
    businessName: "",
    businessType: "individual",
    vatNumber: "",
    website: "",
    bankName: "",
    accountHolder: "",
    iban: "",
    swift: "",
    stripeAccountId: "",
    hostingExperience: "none",
    propertyCount: "1",
    heardAboutUs: "",
    terms: false,
    newsletter: false,
  });

  // Set metadata on mount
  useEffect(() => {
    changeMetaData(`Complete Profile - Provider`);
  }, []);

  // Initialize profile data and form data
  useEffect(() => {
    const initializeData = () => {
      try {
        // Get profile data from localStorage
        const storedProfileData = localStorage.getItem("provider_user");
        const parsedProfileData = storedProfileData ? JSON.parse(storedProfileData) : null;
        
        // Get signup data from sessionStorage
        const storedSignupData = sessionStorage.getItem("providerSignupData");
        const parsedSignupData = storedSignupData ? JSON.parse(storedSignupData) : null;

        if (parsedProfileData) {
          setProfileData(parsedProfileData);
          
          // Set Stripe account if available
          if (parsedProfileData.stripeAccountId) {
            setStripeAccount(parsedProfileData.stripeAccountId);
          }
          
          // Set current step based on profile data
          if (parsedProfileData.step !== undefined) {
            setCurrentStep(Math.min(parsedProfileData.step + 1, 4));
          }
        }

        // Merge form data with stored data
        setFormData(prevFormData => ({
          ...prevFormData,
          // Profile data takes precedence
          ...(parsedProfileData && {
            firstName: parsedProfileData.firstName || prevFormData.firstName,
            lastName: parsedProfileData.lastName || prevFormData.lastName,
            email: parsedProfileData.email || prevFormData.email,
            phone: parsedProfileData.phoneNumber || prevFormData.phone,
            address: {
              ...prevFormData.address,
              ...(parsedProfileData.address || {})
            },
            businessName: parsedProfileData.businessName || prevFormData.businessName,
            businessType: parsedProfileData.businessType || prevFormData.businessType,
            vatNumber: parsedProfileData.vatNumber || prevFormData.vatNumber,
            website: parsedProfileData.website || prevFormData.website,
            bankName: parsedProfileData.bankName || prevFormData.bankName,
            accountHolder: parsedProfileData.accountHolder || prevFormData.accountHolder,
            iban: parsedProfileData.iban || prevFormData.iban,
            swift: parsedProfileData.swift || prevFormData.swift,
            stripeAccountId: parsedProfileData.stripeAccountId || prevFormData.stripeAccountId,
            hostingExperience: parsedProfileData.hostingExperience || prevFormData.hostingExperience,
            propertyCount: parsedProfileData.propertyCount || prevFormData.propertyCount,
            heardAboutUs: parsedProfileData.heardAboutUs || prevFormData.heardAboutUs,
            terms: parsedProfileData.terms || prevFormData.terms,
            newsletter: parsedProfileData.newsletter || prevFormData.newsletter,
          }),
          // Signup data for missing fields
          ...(parsedSignupData && {
            firstName: parsedSignupData.firstName || prevFormData.firstName,
            lastName: parsedSignupData.lastName || prevFormData.lastName,
            email: parsedSignupData.email || prevFormData.email,
            phone: parsedSignupData.phoneNumber || prevFormData.phone,
          }),
          // Account ID from URL
          stripeAccountId: accountId || prevFormData.stripeAccountId || parsedProfileData?.stripeAccountId ,
        }));

      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [accountId]);

  // Handle provider profile fetch
  const handleGetProviderProfile = async () => {
    try {
      const profile = await getProviderProfile();
      console.log(profile, "provider profile");
      
      if (profile?.profileCompleted && profile?.registrationStatus === "complete") {
        navigate("/provider/registration-success");
      }
    } catch (error) {
      console.error("Error fetching provider profile:", error);
    }
  };

  useEffect(() => {
    handleGetProviderProfile();
  }, []);

  // Handle Stripe account verification
  const handleGetStripeAccount = async () => {
    if (!accountId) return;
    
    setStripeLoading(true);
    try {
      const res = await getStripeAccount(accountId);
      if (res?.data) {
        const isAccountValid = res.data.details_submitted && 
                              res.data.charges_enabled && 
                              res.data.payouts_enabled;
        setStripeAccount(isAccountValid ? accountId : null);
      }
    } catch (error) {
      console.error("Error fetching Stripe account:", error);
      setStripeAccount(null);
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    handleGetStripeAccount();
  }, [accountId]);

  console.log(buttonRef , "button ref");
  // Handle Stripe connection
  const handleConnectStripe = async () => {
    try {
      
      console.log(buttonRef , "button ref inside");
  setStripeLoading(true);
   buttonRef.current.disabled = true;
  const res = await connectToStripe({ email: formData.email, accountId });
  if (res?.url) {
    setIsRedirecting(true);
    window.location.href = res.url;
    return;
  }
} catch (error) {
  console.error("Error connecting to Stripe:", error);
  toast.error("Failed to connect to Stripe. Please try again.");
} finally {
  setStripeLoading(false);
  buttonRef.current.disabled = true;
  // if (buttonRef.current) {
  //   }
}

  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  // Handle address changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [name]: value,
      },
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  // Validation function
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (!formData.address?.street?.trim()) {
        newErrors.street = "Street address is required";
      }
      if (!formData.address?.city?.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.address?.postalCode?.trim()) {
        newErrors.postalCode = "Postal code is required";
      }
    }

    if (step === 2) {
      if (!formData.businessName?.trim() && formData.businessType !== "individual") {
        newErrors.businessName = "Business name is required for businesses";
      }
    }

    if (step === 3) {
      if (!formData.stripeAccountId && !stripeAccount) {
        newErrors.stripeAccountId = "Stripe account is required";
      }
    }

    if (step === 4) {
      if (!formData.terms) {
        newErrors.terms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const nextStep = async () => {
    const isValid = validateStep(currentStep);
    if (!isValid) {
      // Show toast errors for validation failures
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      const registrationData = {
        step: currentStep,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        address: formData.address,
        businessName: formData.businessName,
        businessType: formData.businessType,
        vatNumber: formData.vatNumber,
        website: formData.website,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        iban: formData.iban,
        swift: formData.swift,
        stripeAccountId: stripeAccount || formData.stripeAccountId,
        hostingExperience: formData.hostingExperience,
        propertyCount: formData.propertyCount,
        heardAboutUs: formData.heardAboutUs,
        newsletter: formData.newsletter,
        registrationStatus: currentStep === 4 ? "complete" : "pending",
      };

      const response = await completeProviderRegistration(registrationData);
      
      if (response?.provider) {
        // Update form data with response
        setFormData(prevFormData => ({
          ...prevFormData,
          ...response.provider,
          phone: response.provider.phoneNumber || prevFormData.phone,
          address: response.provider.address || prevFormData.address,
        }));
        
        // Move to next step
        setCurrentStep(prevStep => prevStep + 1);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
    window.scrollTo(0, 0);
  };

  // Handle final submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateStep(currentStep);
    if (!isValid) {
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    if (!formData.terms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        step: 4,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        address: formData.address,
        businessName: formData.businessName,
        businessType: formData.businessType,
        vatNumber: formData.vatNumber,
        website: formData.website,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        iban: formData.iban,
        swift: formData.swift,
        stripeAccountId: stripeAccount || formData.stripeAccountId,
        hostingExperience: formData.hostingExperience,
        propertyCount: formData.propertyCount,
        heardAboutUs: formData.heardAboutUs,
        newsletter: formData.newsletter,
        registrationStatus: "complete",
      };

      const response = await completeProviderRegistration(registrationData);

      // Update localStorage
      const prevUserStr = localStorage.getItem("provider_user");
      if (prevUserStr) {
        const prevUser = JSON.parse(prevUserStr);
        const updatedUser = { ...prevUser, profileCompleted: true };
        localStorage.setItem("provider_user", JSON.stringify(updatedUser));
      }

      // Clear session storage
      sessionStorage.removeItem("providerSignupData");
      localStorage.removeItem("currentStep");

      // Navigate to success page
      navigate("/provider/registration-success");
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response?.data) {
        setErrors(error.response.data.errors || {
          form: error.response.data.message || "Registration failed",
        });
      } else {
        setErrors({
          form: "Registration failed. Please try again later.",
        });
      }
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("personal_information")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("first_name")} *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("last_name")} *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("email_address")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("phone_number")} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("street_address")} *
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData?.address?.street}
                onChange={handleAddressChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.street ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors?.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("city")} *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData?.address?.city}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors?.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("postal_code")} *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData?.address?.postalCode}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors?.postalCode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors?.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("country")} *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData?.address?.country}
                  onChange={handleAddressChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  <option value="Switzerland">{t("switzerland")}</option>
                  <option value="Germany">{t("germany")}</option>
                  <option value="Austria">{t("austria")}</option>
                  <option value="France">{t("france")}</option>
                  <option value="Italy">{t("italy")}</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("date_of_birth")}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData?.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("business_information")}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("business_type")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    formData?.businessType === "individual"
                      ? "border-brand bg-brand/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, businessType: "individual" })
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.businessType === "individual"
                          ? "border-brand"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.businessType === "individual" && (
                        <div className="w-3 h-3 rounded-full bg-brand"></div>
                      )}
                    </div>
                    <span className="font-medium">{t("individual")}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("renting_personal_property")}
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    formData.businessType === "company"
                      ? "border-brand bg-brand/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, businessType: "company" })
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.businessType === "company"
                          ? "border-brand"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.businessType === "company" && (
                        <div className="w-3 h-3 rounded-full bg-brand"></div>
                      )}
                    </div>
                    <span className="font-medium">{t("company")}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("represent_registered_business")}
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    formData.businessType === "property_manager"
                      ? "border-brand bg-brand/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      businessType: "property_manager",
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.businessType === "property_manager"
                          ? "border-brand"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.businessType === "property_manager" && (
                        <div className="w-3 h-3 rounded-full bg-brand"></div>
                      )}
                    </div>
                    <span className="font-medium">{t("property_manager")}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("manage_properties_for_others")}
                  </p>
                </div>
              </div>
            </div>

            {formData.businessType !== "individual" && (
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("business_name")} *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessName}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="vatNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("vat_number")} ({t("optional")})
              </label>
              <input
                type="text"
                id="vatNumber"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("website")} ({t("optional")})
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="https://"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("properties_to_list")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["1", "2-5", "6-10", "10+"].map((count) => (
                  <div
                    key={count}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.propertyCount === count
                        ? "border-brand bg-brand/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, propertyCount: count })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.propertyCount === count
                            ? "border-brand"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.propertyCount === count && (
                          <div className="w-3 h-3 rounded-full bg-brand"></div>
                        )}
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("hosting_experience")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "none", label: "None" },
                  { value: "other_platforms", label: "On other platforms" },
                  { value: "professional", label: "Professional" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.hostingExperience === option.value
                        ? "border-brand bg-brand/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        hostingExperience: option.value,
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.hostingExperience === option.value
                            ? "border-brand"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.hostingExperience === option.value && (
                          <div className="w-3 h-3 rounded-full bg-brand"></div>
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("banking_details")}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {t("banking_details_required")}
            </p>
            { !stripeAccount  && (
              <div className="flex justify-center">
                <button
                 ref={buttonRef}
                 disabled={stripeLoading || isRedirecting}
                  className="bg-brand text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-dark transition-color disabled:cursor-not-allowed"
                  onClick={handleConnectStripe}
                >
                  Connect to stripe
                </button>
              </div>
            ) }
           {accountId  && !stripeAccount && !stripeLoading ? (
            <> 
  <p className="text-amber-500 text-center">
    {t("restricted_stripe")}
   </p>
  <p className="text-sm">
{t("click_here")} :- 
  <Link target="_blank" className=" underline underline-offset-2 text-blue-500" to={"https://support.stripe.com/"}> Stripe Support </Link>
  </p>
            </>
  // <p className="text-red-500 text-center">
  //   Failed to connect to stripe, Please try again!
  // </p>
) : (accountId !== null && accountId !== "failed") || profileData?.stripeAccountId ? (
  !stripeLoading ? (
    <div>
      <p className="text-xl font-semibold">Account Connected</p>
      <p className="font-semibold">
        Account ID:{" "}
        <span className="font-medium text-slate-500">
          {accountId || formData?.stripeAccountId}
        </span>
      </p>
    </div>
  ) : (
    <p>Connecting...</p>
  )
) :  null}

            {/* <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('bank_name')} *
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-1">
              {t('account_holder_name')} *
              </label>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.accountHolder ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountHolder && (
                <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
              {t('match_bank_account_name')}
              </p>
            </div>
            
            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
              {t('iban')} *
              </label>
              <input
                type="text"
                id="iban"
                name="iban"
                value={formData.iban}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                  errors.iban ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="eg. CH93 0076 2011 6238 5295 7"
              />
              {errors.iban && (
                <p className="mt-1 text-sm text-red-600">{errors.iban}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="swift" className="block text-sm font-medium text-gray-700 mb-1">
              {t('swift_code')} ({t('optional')})
              </label>
              <input
                type="text"
                id="swift"
                name="swift"
                value={formData.swift}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                <h3 className="text-sm font-medium text-blue-800">{t('payment_information')}</h3>
                  <p className="mt-1 text-sm text-blue-600">
                  {t('payment_explanation')}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("final_steps")}
            </h2>
            <div>
              <label
                htmlFor="heardAboutUs"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("heard_about_us")}
              </label>
              <select
                id="heardAboutUs"
                name="heardAboutUs"
                value={formData?.heardAboutUs || ""} 
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="">{t("select_option")}</option>
                <option value="search">{t("search_engine")}</option>
                <option value="social">{t("social_media")}</option>
                <option value="friend">{t("friend_colleague")}</option>
                <option value="advertisement">{t("advertisement")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-1">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className={`h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    {t("agree_to")}{" "}
                    <span onClick={()=>setIsTermsOpen(true)} className="text-brand hover:underline cursor-pointer">
                      {t("terms_and_conditions")}
                    </span>{" "}
                    {t("and")}{" "}
                    <span
                      onClick={()=> setIsDataPolicyOpen(true)}
                      className="text-brand hover:underline cursor-pointer"
                    >
                      {t("data_policy")}
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-1">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    {t("newsletter_opt_in")}
                  </label>
                </div>
              </div>
            </div>

            {/* <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t("what_happens_next")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">1</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("application_review")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">2</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("create_listings_when_approved")}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium">3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("optimize_listings")}
                  </p>
                </div>
              </div>
            </div> */}

            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                {errors.form}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("register_as_provider")}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="hidden sm:flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step !== 4 ? "flex-1" : ""}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step === currentStep
                      ? "border-brand bg-brand text-white"
                      : step < currentStep
                      ? "border-brand bg-brand text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                {step !== 4 && (
                  <div
                    className={`h-0.5 w-full ${
                      step < currentStep ? "bg-brand" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium text-gray-500">
              {t("personal_info")}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {t("business_info")}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {t("banking_details")}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {t("final_steps")}
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                currentStep === 1 ? "invisible" : ""
              }`}
            >
              {t("previous")}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                {t("next")}
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>{t("complete_registration")}</span>
                  </div>
                ) : (
                  t("complete_registration")
                )}
              </button>
            )}
          </div>
        </div>
      </main>
      <Modal
                        isOpen={isTermsOpen}
                        onClose={() => setIsTermsOpen(false)}
                        title={t("terms_and_conditions")}
                      >
                        <TermsContent />
                      </Modal>
      
                      {/* Data Policy Modal */}
                     <Modal
                  isOpen={isDataPolicyOpen}
                  onClose={() => setIsDataPolicyOpen(false)}
                  title={t("data_policy")}
                >
                  <DataPolicy />
                </Modal>

      {/* <Footer /> */}
    </div>
  );
};

export default ProviderRegistration;
