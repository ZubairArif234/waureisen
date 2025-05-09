import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, CreditCard } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import { useLanguage } from "../../utils/LanguageContext";
import { getCurrentUser } from "../../utils/authService";

const AccountCard = ({ icon: Icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 bg-brand/10 rounded-lg">
        <Icon className="w-6 h-6 text-brand" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const AccountPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    // Get user data from authService
    const user = getCurrentUser();

    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, []);

  const accountCards = [
    {
      icon: FileText,
      title: t("personal_info"),
      description: t("personal_info_desc"),
      onClick: () => navigate("/profile"),
    },
    {
      icon: Shield,
      title: t("login_security"),
      description: t("login_security_desc"),
      onClick: () => navigate("/account/security"),
    },
    // {
    //   icon: CreditCard,
    //   title: t("payment_details"),
    //   description: t("payments_payouts_desc"),
    //   onClick: () => navigate("/account/payments"),
    // },
  ];

  // Generate display name
  const displayName =
    userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.firstName || userData.email || t("user");

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand/10 px-6 py-8 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
              {t("account")}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-gray-600">{displayName}</span>
              <span className="hidden sm:block text-gray-400">•</span>
              <span className="text-gray-600">{userData.email}</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {accountCards.map((card, index) => (
                <AccountCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
