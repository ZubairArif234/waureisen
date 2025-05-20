import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit3, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getCurrentUser } from "../../utils/authService";
import API from "../../api/config";
import { changeMetaData } from "../../utils/extra";

// Custom eye toggle button component to ensure consistent styling
const PasswordToggle = ({ show, toggle }) => {
  return (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 text-gray-500"
      style={{ color: "#6b7280" }} /* Forcing gray color with inline style */
    >
      {show ? (
        <EyeOff
          className="w-5 h-5"
          style={{ color: "#6b7280", strokeWidth: 1.5 }}
        />
      ) : (
        <Eye
          className="w-5 h-5"
          style={{ color: "#6b7280", strokeWidth: 1.5 }}
        />
      )}
    </button>
  );
};

const LoginSecurityPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
                changeMetaData("Security - Waureisen");
              }, [])
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
  };

  const validateForm = () => {
    // Reset error
    setError(null);

    // Check if current password is provided
    if (!formData.currentPassword) {
      setError(
        t("current_password_required") || "Current password is required"
      );
      return false;
    }

    // Check if new password is provided
    if (!formData.newPassword) {
      setError(t("new_password_required") || "New password is required");
      return false;
    }

    // Check if new password meets requirements (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError(
        t("password_requirements_not_met") ||
          "Password doesn't meet requirements"
      );
      return false;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("passwords_dont_match") || "Passwords don't match");
      return false;
    }

    return true;
  };

  const updateUserSecurity = async (securityData) => {
    try {
      const response = await API.put("/users/security", securityData);
      return response.data;
    } catch (error) {
      console.error("Error updating security:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API
      const securityData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      // Update password
      await updateUserSecurity(securityData);

      // Success notification
      toast.success(
        t("password_updated_successfully") || "Password updated successfully"
      );

      // Reset form
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating password:", err);

      // Handle specific errors
      if (err.response && err.response.status === 401) {
        setError(
          t("current_password_incorrect") || "Current password is incorrect"
        );
      } else {
        setError(t("password_update_failed") || "Failed to update password");
        toast.error(t("password_update_failed") || "Failed to update password");
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
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? t("cancel_editing") : t("edit_profile")}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 m-6 p-4 rounded-lg">
              {error}
            </div>
          )}

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
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand pr-10"
                    />
                    <PasswordToggle
                      show={showCurrentPassword}
                      toggle={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("new_password")}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand pr-10"
                    />
                    <PasswordToggle
                      show={showNewPassword}
                      toggle={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {t("password_requirements") ||
                      "Password must be at least 8 characters long, include uppercase, lowercase, and a number"}
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t("confirm_password") || "Confirm Password"}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand/20 focus:border-brand pr-10"
                    />
                    <PasswordToggle
                      show={showConfirmPassword}
                      toggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors font-medium ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading
                    ? t("saving") || "Saving..."
                    : t("save_changes") || "Save Changes"}
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
