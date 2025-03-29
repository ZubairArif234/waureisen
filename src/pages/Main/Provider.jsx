import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProviderListings from '../Provider/ProviderListings';
import YourListings from '../Provider/YourListings';
import CreateListing from '../Provider/CreateListing';
import ProviderBookings from '../Provider/ProviderBookings';

const ProviderLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/provider/listings" replace />} />
        <Route path="/listings" element={<ProviderListings />} />
        <Route path="/your-listings" element={<YourListings />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<CreateListing />} />
        <Route path="/bookings" element={<ProviderBookings />} />
        {/* Additional provider routes will be added as needed */}
      </Routes>
    </div>
  );
};

export default ProviderLayout;