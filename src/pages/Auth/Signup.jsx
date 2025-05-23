import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import authBg from "../../assets/bg.png";
import Footer from "../../components/Shared/Footer";
import Modal from "../../components/Auth/Modal";
import TermsContent from "../../components/Auth/TermsContent";
import PrivacyContent from "../../components/Auth/PrivacyContent";
import { useLanguage } from "../../utils/LanguageContext";
import { userSignup, providerSignup } from "../../api/authAPI";
import { sendVerificationCode, verifyCode } from "../../api/verificationAPI";
import toast from "react-hot-toast";
import WelcomeCustomerModal from "../../components/SearchComponents/WelcomeCustomerModal";

const Signup = () => {
  const [userType, setUserType] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    password: "",
  });
  
   const [activeModal, setActiveModal] = useState(false);
  // Email verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [redirectAfterSignup, setRedirectAfterSignup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Check for redirect parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get("redirect");
    // Check for userType in URL params (from login redirect)
    const userTypeParam = queryParams.get("userType");

    if (userTypeParam) {
      // Map "user" to "customer" as that's what this component uses
      setUserType(userTypeParam === "user" ? "customer" : userTypeParam);
    }

    if (redirect) {
      setRedirectAfterSignup(redirect);

      // If redirecting from provider registration, pre-select provider type
      if (redirect === "provider-registration") {
        setUserType("provider");
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Reset verification status if email changes
    if (name === "email") {
      setIsEmailVerified(false);
      setShowVerificationField(false);
    }
  };

  // Handle sending verification code
  const handleSendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      setVerificationLoading(true);
      setError("");
      
      // Map customer to user for the API
      const apiUserType = userType === "customer" ? "user" : userType;
      
      const response = await sendVerificationCode(formData.email, apiUserType);
      
      if (response.success) {
        toast.success("Verification code sent to your email");
        setShowVerificationField(true);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Handle verifying the code
  const handleVerifyCode = async () => {
    if (!enteredCode) {
      setError("Please enter the verification code");
      return;
    }
    
    try {
      setVerificationLoading(true);
      setError("");
      
      const response = await verifyCode(formData.email, enteredCode);
      
      if (response.success) {
        setIsEmailVerified(true);
        toast.success("Email verified successfully");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.response?.data?.message || "Invalid verification code");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // if (!isEmailVerified) {
    //   setError("Please verify your email before signing up");
    //   return;
    // }
    
    if (!acceptTerms) {
      setError(
        t("please_accept_terms") || "Please accept the terms and conditions"
      );
      return;
    }
  
    setError("");
    setIsLoading(true);
  
    try {
      // Create common user data object
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || "",
        username:
          formData.displayName || `${formData.firstName} ${formData.lastName}`,
      };
  
      let response;
  
      // Different API call based on user type
      if (userType === "customer") {
        // console.log("Attempting customer signup with:", userData);
        response = await userSignup(userData);
        // console.log("Customer signup response:", response);
  
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userType", "user");
  
          if (response.user) {
            localStorage.setItem("user_data", JSON.stringify(response.user));
          }
  setActiveModal(true)
          // navigate("/");
        } else {
          throw new Error("Invalid response from server - no token received");
        }
      } else if (userType === "provider") {
        // console.log("Attempting provider signup with:", userData);
        response = await providerSignup(userData);
        // console.log("Provider signup response:", response);
  
        // Store the token and provider data
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userType", "provider");
  
          if (response.provider) {
            localStorage.setItem(
              "provider_user",
              JSON.stringify(response.provider)
            );
          }
  
          // Store form data in sessionStorage to pre-fill provider registration form
          sessionStorage.setItem(
            "providerSignupData",
            JSON.stringify({
              ...userData,
              // Don't include password in the session storage for security reasons
              password: undefined,
            })
          );
  
          // Redirect to provider registration instead of dashboard
          navigate("/provider/registration");
        } else {
          throw new Error("Invalid response from server - no token received");
        }
      } else {
        throw new Error("Please select a user type");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Container with Background */}
      <div
        className="min-h-screen pt-8 mt-20 relative"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Form Container */}
        <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Auth Type Selector */}
            <div className="flex text-2xl font-semibold border-b relative">
              <Link
                to="/signup"
                className="flex-1 text-center py-4 text-gray-900"
              >
                {t("sign_up")}
              </Link>
              <Link
                to="/login"
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                {t("log_in")}
              </Link>
              {/* Active Indicator Line */}
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#B4A481]" />
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("user_type")}
                  </label>
                  <div className="relative">
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481] appearance-none bg-white"
                    >
                      <option value="">{t("choose_user_type")}</option>
                      <option value="customer">{t("customer")}</option>
                      <option value="provider">{t("provider")}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Common Fields */}
                {userType && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("email")}
                      </label>
                      {/* Email input and verification button - RESPONSIVE FIX */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t("email_placeholder")}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            isEmailVerified 
                              ? "border-green-300 bg-green-50" 
                              : "border-gray-300"
                          } focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]`}
                          required
                          disabled={isEmailVerified}
                        />
                        {!isEmailVerified && (
                          <button
                            type="button"
                            onClick={handleSendVerification}
                            disabled={verificationLoading || !formData.email || !userType}
                            className={`mt-2 sm:mt-0 px-4 py-3 rounded-lg text-sm font-medium w-full sm:w-auto ${
                              verificationLoading || !formData.email || !userType
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-[#B4A481] text-white hover:bg-[#a3927b]"
                            } transition-colors whitespace-nowrap`}
                          >
                            {verificationLoading ? t("sending") : t("verify")}
                          </button>
                        )}
                        {isEmailVerified && (
                          <div className="mt-2 sm:mt-0 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium text-center sm:text-left">
                            {t("verified")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verification code input field - RESPONSIVE FIX */}
                    {showVerificationField && !isEmailVerified && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("verification_code")}
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <input
                            type="text"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                            placeholder={t("enter_verification_code")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={verificationLoading || !enteredCode}
                            className={`mt-2 sm:mt-0 px-4 py-3 rounded-lg text-sm font-medium w-full sm:w-auto ${
                              verificationLoading || !enteredCode
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-[#B4A481] text-white hover:bg-[#a3927b]"
                            } transition-colors whitespace-nowrap`}
                          >
                            {verificationLoading ? t("verifying") : t("submit")}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {t("verification_code_info")}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("first_name")}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={t("first_name_placeholder")}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("last_name")}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={t("last_name_placeholder")}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                          required
                        />
                      </div>
                    </div>

                    {/* Provider-specific Fields */}
                    {userType === "provider" && (
                      <>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            {t("display_name")}
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            placeholder={t("display_name_placeholder")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            {t("phone_number")}
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder={t("phone_number_placeholder")}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("password")}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={t("password_placeholder")}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                        required
                        minLength="8"
                      />
                    </div>
                  </>
                )}

                {/* Terms Acceptance */}
                <div className="flex items-start sm:items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 sm:mt-0 rounded border-gray-300 text-[#B4A481] focus:ring-[#B4A481]"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t("accept_terms")}{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsOpen(true)}
                      className="text-[#B4A481] hover:underline"
                    >
                      {t("terms_and_conditions")}
                    </button>{" "}
                    {t("and_the")}{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyOpen(true)}
                      className="text-[#B4A481] hover:underline"
                    >
                      {t("privacy_policy")}
                    </button>
                  </label>
                </div>

                {/* Terms of Service Modal */}
                <Modal
                  isOpen={isTermsOpen}
                  onClose={() => setIsTermsOpen(false)}
                  title={t("terms_and_conditions")}
                >
                  <TermsContent />
                </Modal>

                {/* Privacy Policy Modal */}
                <Modal
                  isOpen={isPrivacyOpen}
                  onClose={() => setIsPrivacyOpen(false)}
                  title={t("privacy_policy")}
                >
                  <PrivacyContent />
                </Modal>

                {/* Signup Button */}
                <button
                  type="submit"
                   disabled={!acceptTerms || isLoading || !userType || !isEmailVerified}
                  className={`w-full py-3 rounded-lg font-medium ${
                   acceptTerms && !isLoading && userType && isEmailVerified
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                   }`}
                >
                  {isLoading ? t("signing_up") : t("sign_up")}
                </button>
              </div>
            </form>

            {/* Added Footer */}
            <div className="h-1 bg-[#B4A481] mt-0 opacity-75" />
          </div>
        </div>
      </div>
        <WelcomeCustomerModal
              isOpen={activeModal}
              onClose={() =>{ setActiveModal(false);navigate("/")}}
              title={t("welcome_back")}
              onConfirm={()=>navigate("/")}
            >
              <p className="text-center">
               {t("account_created")}
              </p>
            </WelcomeCustomerModal>
      <Footer />
    </div>
  );
};

export default Signup;