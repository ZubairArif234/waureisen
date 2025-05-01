import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProviderListings from "../Provider/ProviderListings";
import YourListings from "../Provider/YourListings";
import AddAccommodation from "../Admin/AddAccommodation"; // Using the shared component
import ProviderBookings from "../Provider/ProviderBookings";
import ProviderDashboard from "../Provider/ProviderDashboard";
import ProviderEarnings from "../Provider/ProviderEarnings";
import ProviderMessages from "../Provider/ProviderMessages";
import ProviderAnalytics from "../Provider/ProviderAnalytics";
import ProviderCalendar from "../Provider/ProviderCalendar";
import ProviderRegistration from "../Provider/ProviderRegistration";
import RegistrationSuccess from "../Provider/RegistrationSuccess";
import ProviderAccountPage from "../Provider/ProviderAccountPage";
import ProviderProfilePage from "../Provider/ProviderProfilePage";
import ProviderBankingPage from "../Provider/ProviderBankingPage";
import ProviderSecurityPage from "../Provider/ProviderSecurityPage";
import { isAuthenticated, isUserType } from "../../utils/authService";

const ProviderLayout = () => {
  const isRegistrationRoute =
    window.location.pathname.includes("/provider/registration") ||
    window.location.pathname.includes("/provider/registration-success");

  if (!isRegistrationRoute && (!isAuthenticated() || !isUserType("provider"))) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/your-listings" element={<YourListings />} />
        
        {/* Use the shared AddAccommodation component with isProviderMode=true */}
        <Route path="/create-listing" element={<AddAccommodation isProviderMode={true} />} />
        <Route path="/edit-listing/:id" element={<AddAccommodation isProviderMode={true} />} />
        
        <Route path="/bookings" element={<ProviderBookings />} />
        <Route path="/earnings" element={<ProviderEarnings />} />
        <Route path="/messages" element={<ProviderMessages />} />
        <Route path="/analytics" element={<ProviderAnalytics />} />
        <Route path="/calendar" element={<ProviderCalendar />} />
        <Route path="/registration" element={<ProviderRegistration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/analytics/listing/:id" element={<ProviderAnalytics />} />
        <Route path="/account" element={<ProviderAccountPage />} />
        <Route path="/account/profile" element={<ProviderProfilePage />} />
        <Route path="/account/banking" element={<ProviderBankingPage />} />
        <Route path="/account/security" element={<ProviderSecurityPage />} />
        <Route path="/listings" element={<Navigate to="/provider/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default ProviderLayout;