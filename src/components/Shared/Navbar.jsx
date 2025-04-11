import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Menu, User, X, MessageSquare, Map, Heart, Home, UserCircle, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/logo.png';
import LanguagePopup from '../HomeComponents/LanguagePopup';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const globeButtonRef = useRef(null);

  const menuItems = [
    { icon: <MessageSquare className="h-4 w-4" />, label: 'Messages', path: '/messages' },
    { icon: <Map className="h-4 w-4" />, label: 'Your Trips', path: '/trips' },
    { icon: <Heart className="h-4 w-4" />, label: 'Favorites', path: '/wishlist' },
    { icon: <Home className="h-4 w-4" />, label: 'Your Listings', path: '/provider/listings' },
    { icon: <UserCircle className="h-4 w-4" />, label: 'Profile', path: '/profile' },
    { icon: <Settings className="h-4 w-4" />, label: 'Account', path: '/account' },
  ];

  const handleLanguageSelect = (langCode) => {
    setCurrentLanguage(langCode);
    // Here you would typically implement language change functionality
  };

  return (
    <nav className="fixed w-full top-0 z-50 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-b-2xl shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 ml-2 sm:ml-4 md:ml-8">
          <Link to="/">
            <img src={logo} alt="Wau Logo" className="h-12" />
          </Link>
        </div>

        {/* Desktop & Tablet Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8 lg:ml-[410px] md:ml-auto">
          <Link 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              const isUserLoggedIn = localStorage.getItem('user') || false;
              if (isUserLoggedIn) {
                navigate('/provider/registration');
              } else {
                navigate('/signup?redirect=provider-registration');
              }
            }}
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            Register Accommodation
          </Link>
          <Link to="/camper-rental" className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap">
            Camper Rental
          </Link>
          <a 
            href="https://meet.brevo.com/waureisen" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-700 hover:text-gray-100 text-sm font-medium whitespace-nowrap"
          >
            Book an appointment
          </a>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4 md:mr-8">
          {/* Language Button */}
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-300 rounded-full"
              onClick={() => setIsLanguagePopupOpen(!isLanguagePopupOpen)}
            >
              <Globe className="h-6 w-6 text-gray-700" />
            </button>

            {isLanguagePopupOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLanguagePopupOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-md font-semibold">Language and region</h2>
                      <button 
                        onClick={() => setIsLanguagePopupOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <button
                        onClick={() => handleLanguageSelect('en')}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          currentLanguage === 'en' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageSelect('de')}
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          currentLanguage === 'de' ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        Deutsch
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Menu Button */}
          <div className="relative">
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

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-1 px-1 z-50">
                  {/* Mobile Navigation Links */}
                  <div className="md:hidden border-b border-gray-200 mb-1 pb-1">
                    <Link to="#" className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm">
                    Register Accommodation
                    </Link>
                    <Link to="/camper-rental" className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm">
                      Camper Rental
                    </Link>
                    <a 
                      href="https://meet.brevo.com/waureisen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Book an appointment
                    </a>
                  </div>
                  
                  {/* Menu Items */}
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2 text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button 
              className="p-2 rounded-full"
              style={{ backgroundColor: '#B4A481' }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <User className="h-6 w-6 text-white" />
            </button>

            {/* Profile Menu Popup */}
            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span>Log in</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Sign up</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      // Handle logout
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;