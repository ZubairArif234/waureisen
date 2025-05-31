import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import authBg from "../../assets/bg.png";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import {
  login,
  isAccountNotFoundError,
  redirectToSignup,
} from "../../utils/authService";
import WelcomeCustomerModal from "../../components/SearchComponents/WelcomeCustomerModal";
import { changeMetaData } from "../../utils/extra";
import { SendHorizontal } from "lucide-react";

const ForgotPassword = () => {
 useEffect(() => {
  
    changeMetaData(`Forgot Password - Waureisen`);
  }, []);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpField, setOtpField] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
     const [activeModal, setActiveModal] = useState(false);

  // Check for session_expired param in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("session_expired") === "true") {
      setError(
        t("session_expired") || "Your session has expired. Please log in again."
      );
    }
  }, [location, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on new submission
    setIsLoading(true);

    try {
      // Use the centralized login function from authService
      const response = await login({ email, password }, userType);

      // console.log("Login successful:", response);

      // Navigate based on user type
      if (userType === "admin") {
        navigate("/admin/accommodations");
      } else if (userType === "provider") {
        navigate("/provider/dashboard");
      } else {
        setActiveModal(true)
        // navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Check if account is banned
      if (error.response?.data?.isBanned) {
        setError(
          error.response.data.message ||
            "Your account has been banned. Please contact support."
        );
        return;
      }

      // Check for specific errors that indicate the user doesn't exist
      if (isAccountNotFoundError(error)) {
        // Show error for 2 seconds then redirect to signup with the same user type
        setError(
          t("account_not_found") ||
            "Account not found. Redirecting to signup..."
        );

        setTimeout(() => {
          // Redirect to signup with userType parameter
          redirectToSignup(userType);
        }, 2000);
      } else {
        // For other errors, just show the message
        setError(error.response?.data?.message || t("invalid_credentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (email?.trim() !== ""){
        setOtpField(true)
    }
  }

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
        <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Auth Type Selector */}
            <div className="flex text-2xl font-semibold border-b relative">
              <Link
                to="/forgot-password"
                className="flex-1 text-center py-4 text-gray-500 hover:text-gray-700"
              >
                {t("forgot_password")}
              </Link>
             
              {/* Active Indicator Line */}
              {/* <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-[#B4A481]" /> */}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

               

                {/* Email Field */}
                <div className="flex items-end gap-2">
                <div className="space-y-3 w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email_placeholder")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                  />
                </div>
<button type="button" onClick={handleSendOtp}  className={` py-3 px-4 rounded-lg font-medium ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}><SendHorizontal /></button>
                </div>

                {/* Password Field */}
                {otpField && (

                <div className="space-y-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <input
                    type="text"
                    id="password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t("otp_placeholder")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B4A481] focus:border-[#B4A481]"
                  />
                </div>
                )}

              
                <button
                  type="submit"
                  disabled={isLoading || !otp }
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {isLoading ? t("logging_in") : t("reset_password")}
                </button>

              
               
              </div>
            </form>

            {/* Added Footer */}
            <div className="h-1 bg-[#B4A481] mt-0 opacity-75" />
          </div>
        </div>
      </div>
     
      <Footer />
    </div>
  );
};

export default ForgotPassword;
