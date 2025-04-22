// src/components/Shared/Pagination.jsx
import React from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const Pagination = ({ currentPage, totalPages, onPageChange, showText = true }) => {
  const { t } = useLanguage();
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    pages.push(1);
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const leftOffset = Math.floor(maxPagesToShow / 2);
      const rightOffset = Math.ceil(maxPagesToShow / 2) - 1;
      
      if (currentPage <= leftOffset + 1) {
        // Near start
        for (let i = 2; i <= maxPagesToShow - 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - rightOffset) {
        // Near end
        pages.push('...');
        for (let i = totalPages - maxPagesToShow + 2; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < totalPages) {
            pages.push(i);
          }
        }
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="flex justify-between items-center py-4 px-2">
      {showText && (
  <div className="text-sm text-gray-600">
    {t('showing_page', { 
      page: currentPage,
      total: totalPages 
    })}
  </div>
)}
      
      <div className={`flex space-x-1 ${!showText ? 'mx-auto' : ''}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('previous')}
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            className={`w-8 h-8 rounded flex items-center justify-center ${
              page === currentPage
                ? 'bg-brand text-white'
                : page === '...'
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
};

export default Pagination;