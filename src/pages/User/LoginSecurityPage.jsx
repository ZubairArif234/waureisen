import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit3, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getCurrentUser } from "../../utils/authService";
import { updateUserPassword, updateProviderPassword } from "../../api/authAPI";
import toast from "react-hot-toast";

const LoginSecurityPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData && userData.email) {
      setFormData((prev) => ({
        ...prev,
        email: userData.email,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("current_password_required");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("new_password_required");
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("password_min_length");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("confirm_password_required");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_do_not_match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get current user type
      const userType = localStorage.getItem("userType") || "user";

      // Prepare data
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      // Use the appropriate function based on user type
      if (userType === "provider") {
        await updateProviderPassword(passwordData);
      } else {
        await updateUserPassword(passwordData);
      }

      // Reset form fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Exit edit mode
      setIsEditing(false);

      // Show success toast
      toast.success(t("password_updated_successfully"), {
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
      console.error("Error changing password:", error);

      // Handle specific error responses
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the API returns a specific error message
        if (error.response.data.message.includes("current password")) {
          setErrors({ currentPassword: error.response.data.message });
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        // Generic error message
        toast.error(t("password_update_failed"), {
          position: "top-right",
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
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
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/account")}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {t("login_security")}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t("login_security_desc")}</p>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  // Reset form errors when toggling edit mode
                  setErrors({});
                  // Reset password fields when canceling edit
                  if (isEditing) {
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }));
                  }
                }}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t("cancel_editing") : t("edit_profile")}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Email Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("email_address")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
              />
              <p className="text-sm text-gray-500">{t("email_access_tip")}</p>
            </div>

            {/* Password Section */}
            {isEditing && (
              <>
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("current_password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.currentPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("new_password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.newPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {t("password_requirements")}
                  </p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("confirm_password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium flex items-center ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
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
};

export default LoginSecurityPage;
