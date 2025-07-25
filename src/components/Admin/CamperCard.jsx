// src/components/Admin/CamperCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Image } from 'lucide-react';

const CamperCard = ({ camper, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState('bottom');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate menu position when showing
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // Position menu above if there's not enough space below
      if (spaceBelow < 100) {
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
      }
    }
  }, [showMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Get status style
  const getStatusStyle = (status) => {
    const styles = {
      'Available': 'bg-green-100 text-green-800',
      'Coming Soon': 'bg-yellow-100 text-yellow-800',
      'Unavailable': 'bg-red-100 text-red-800'
    };
    
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Get category style
  const getCategoryStyle = (category) => {
    const styles = {
      'Electricity': 'bg-blue-100 text-blue-800',
      'Driver cabin': 'bg-purple-100 text-purple-800',
      'Living area & kitchen': 'bg-yellow-100 text-yellow-800',
      'Bathroom': 'bg-green-100 text-green-800',
      'Dog facilities': 'bg-pink-100 text-pink-800',
      'Additional': 'bg-indigo-100 text-indigo-800',
      'Security deposit': 'bg-orange-100 text-orange-800',
      'Rules & requirements': 'bg-red-100 text-red-800'
    };
    
    return styles[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
      {/* Image Section */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {camper.featuredImage ? (
          <img 
            src={camper.featuredImage} 
            alt={camper.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Image className="w-8 h-8 mb-2" />
            <span className="text-sm">No image</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Category Tag */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(camper.status)}`}>
            {camper?.status}
          </span>
          {/* {Array.isArray(camper?.category) && camper.category.length > 0 ? (
  camper.category.map((item, i) => (
    <span
      key={i}
      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(item)}`}
    >
      {item}
    </span>
  ))
) : camper?.category ? (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(camper.category)}`}
  >
    {camper.category}
  </span>
) : null} */}

            
        </div>
        
        {/* Title and Menu */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2">{camper.title}</h3>
          <div className="relative" ref={menuRef}>
            <button 
              ref={buttonRef}
              className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Desktop Dropdown Menu */}
            {showMenu && window.innerWidth >= 768 && (
              <div 
                className="absolute right-0 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1" 
                style={{ 
                  ...(menuPosition === 'top' 
                    ? { bottom: '100%', marginBottom: '8px' } 
                    : { top: '100%', marginTop: '8px' })
                }}
              >
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
            
            {/* Mobile Dropdown Menu */}
            {showMenu && window.innerWidth < 768 && (
              <>
                {/* Backdrop for mobile */}
                <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMenu(false)} />
                
                {/* Menu fixed to bottom of screen */}
                <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg shadow-lg z-50 p-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full py-3 mt-2 text-sm font-medium text-gray-500 border-t border-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Description and Location */}
        <div className="space-y-2 mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {camper.description || camper.excerpt}
          </p>
          <p className="text-xs text-gray-500">
            Location: {camper.location}
          </p>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <span className="text-[#B4A481] font-medium">
            {camper.price} {camper.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CamperCard;