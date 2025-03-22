import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, CreditCard, Users, UserCog, Newspaper } from 'lucide-react';
import logo from '../../assets/logo.png';

const SidebarLink = ({ icon: Icon, label, to, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-brand text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: Building2,
      label: 'Accommodations',
      path: '/admin/accommodations'
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/admin/customers'
    },
    {
      icon: UserCog,
      label: 'Providers',
      path: '/admin/providers'
    },
    {
      icon: CreditCard,
      label: 'Transactions',
      path: '/admin/transactions'
    },
    {
      icon: Newspaper,
      label: 'Travel Magazine',
      path: '/admin/magazine'
    }
  ];

  const sidebarContent = (
    <>
      <div className="px-4 py-6 border-b">
        <img src={logo} alt="Waureisen Logo" className="h-8" />
      </div>
      
      <div className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <SidebarLink
            key={index}
            icon={item.icon}
            label={item.label}
            to={item.path}
            isActive={location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-lg md:hidden z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-[#FEFCF5]">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-[#FEFCF5] border-r min-h-screen fixed left-0 top-0">
        {sidebarContent}
      </div>
    </>
  );
};

export default AdminSidebar;