import React, { useState } from 'react';
import { Globe, Menu, User, X, MessageSquare, Map, Heart, Home, UserCircle, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: <MessageSquare className="h-4 w-4" />, label: 'Messages' },
    { icon: <Map className="h-4 w-4" />, label: 'Your Trips' },
    { icon: <Heart className="h-4 w-4" />, label: 'Favorites' },
    { icon: <Home className="h-4 w-4" />, label: 'Your Listings' },
    { icon: <UserCircle className="h-4 w-4" />, label: 'Profile' },
    { icon: <Settings className="h-4 w-4" />, label: 'Account' },
    { icon: <LogOut className="h-4 w-4" />, label: 'Log out' },
  ];


  return (
    <nav className="fixed w-full top-0 z-50 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-b-2xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 ml-4 md:ml-8">
          <img src={logo} alt="Wau Logo" className="h-12" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 ml-[410px]">
          <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            List your space
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Camper Rental
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Book an appointment
          </a>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4 mr-4 md:mr-8"> 
          <button className="p-2 hover:bg-gray-300 rounded-full">
            <Globe className="h-6 w-6 text-gray-700" />
          </button>
          <button 
            className="p-2 hover:bg-gray-300 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
          <button className="p-2 rounded-full" style={{ backgroundColor: '#B4A481' }}>
            <User className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Menu Dropdown - Desktop and Mobile */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 md:right-[150px] w-56 bg-white shadow-lg rounded-lg mt-2 py-1 px-1 text-sm">
          {/* Mobile Navigation Links */}
          <div className="md:hidden border-b border-gray-200 mb-1 pb-1">
            <a href="#" className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm">List your space</a>
            <a href="#" className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm">Camper Rental</a>
            <a href="#" className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm">Book an appointment</a>
          </div>
          
          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              {item.icon}
              <span className="ml-2 text-sm">{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;