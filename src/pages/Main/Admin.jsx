import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import Accommodations from '../Admin/Accommodations';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/accommodations" replace />} />
          <Route path="/accommodations" element={<Accommodations />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;