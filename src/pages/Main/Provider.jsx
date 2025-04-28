import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProviderListings from "../Provider/ProviderListings";
import YourListings from "../Provider/YourListings";
import CreateListing from "../Provider/CreateListing";
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
  // Public registration routes don't need authentication
  const isRegistrationRoute =
    window.location.pathname.includes("/provider/registration") ||
    window.location.pathname.includes("/provider/registration-success");

  // Allow access to registration routes without authentication
  if (!isRegistrationRoute && (!isAuthenticated() || !isUserType("provider"))) {
    // If not authenticated as provider and not on registration routes, redirect to login
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/provider/dashboard" replace />}
        />
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/your-listings" element={<YourListings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<CreateListing />} />
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
        {/* Redirect old listings path to dashboard */}
        <Route
          path="/listings"
          element={<Navigate to="/provider/dashboard" replace />}
        />
      </Routes>
    </div>
  );
};

export default ProviderLayout;
