import React, { useState } from 'react';
import { Globe, Menu, User, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-b-2xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8"> {/* Added padding */}
        {/* Logo */}
        <div className="flex-shrink-0 ml-4 md:ml-8"> {/* Added margin */}
          <img src={logo} alt="Wau Logo" className="h-12" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            List your space
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Camper Rental
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Book an appointment
          </a>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4 mr-4 md:mr-8"> 
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Globe className="h-6 w-6 text-gray-700" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full md:hidden"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm py-4 px-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">
              List your space
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">
              Camper Rental
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">
              Book an appointment
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;