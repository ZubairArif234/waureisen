import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import Accommodations from '../Admin/Accommodations';
import AddAccommodation from '../Admin/AddAccommodation';
import Transactions from '../Admin/Transactions';
import TravelMagazine from '../Admin/TravelMagazine';
import Customers from '../Admin/Customers';
import Providers from '../Admin/Providers';
import AdminMessages from '../Admin/AdminMessages';
import DiscountVouchers from '../Admin/DiscountVouchers';


const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/accommodations" replace />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/accommodations/new" element={<AddAccommodation />} />
          <Route path="/accommodations/edit/:id" element={<AddAccommodation />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/magazine" element={<TravelMagazine />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/vouchers" element={<DiscountVouchers />} />
          {/* <Route path="/customers" element={<Customers />} />
          <Route path="/magazine" element={<TravelMagazine />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;