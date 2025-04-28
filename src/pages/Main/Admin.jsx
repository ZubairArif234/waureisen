import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import Accommodations from "../Admin/Accommodations";
import AddAccommodation from "../Admin/AddAccommodation";
import Transactions from "../Admin/Transactions";
import TravelMagazine from "../Admin/TravelMagazine";
import CreateBlogPost from "../Admin/CreateBlogPost"; // Import the new component
import Customers from "../Admin/Customers";
import Providers from "../Admin/Providers";
// import AdminMessages from '../Admin/AdminMessages';
import DiscountVouchers from "../Admin/DiscountVouchers";
import FiltersManagement from "../Admin/FiltersManagement";
import Campers from "../Admin/Campers";
import AddCamper from "../Admin/AddCamper";
import CreateCamperPost from "../Admin/CreateCamperPost";
import ProtectedRoute from "../../components/Shared/ProtectedRoute";
import { isAuthenticated, isUserType } from "../../utils/authService";

const AdminLayout = () => {
  if (!isAuthenticated() || !isUserType("admin")) {
    // If not authenticated as admin, redirect to login
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <div className="md:ml-64">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/accommodations" replace />}
          />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/new" element={<AddAccommodation />} />
          <Route
            path="/accommodations/edit/:id"
            element={<AddAccommodation />}
          />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/magazine" element={<TravelMagazine />} />
          <Route path="/magazine/create" element={<CreateBlogPost />} />
          <Route path="/magazine/edit/:id" element={<CreateBlogPost />} />{" "}
          {/* New edit route */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/providers" element={<Providers />} />
          {/* <Route path="/messages" element={<AdminMessages />} /> */}
          <Route path="/vouchers" element={<DiscountVouchers />} />
          <Route path="/filters" element={<FiltersManagement />} />
          <Route path="/campers" element={<Campers />} />
          <Route path="/campers/new" element={<CreateCamperPost />} />
          <Route path="/campers/edit/:id" element={<CreateCamperPost />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
