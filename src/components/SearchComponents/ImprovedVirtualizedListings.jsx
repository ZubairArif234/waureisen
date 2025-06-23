// src/components/SearchComponents/ImprovedVirtualizedListings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useListings } from '../../context/ListingContext';
import AccommodationCard from './AccommodationCardWrapper'; 
import SkeletonCard from './SkeletonCard';
import { WifiOff, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';

/**
 * Improved listings component with pagination
 * Uses the same AccommodationCard component as the home page
 */
const ImprovedVirtualizedListings = ({listings}) => {
  const { t } = useLanguage();
  const { 
    // listings, 
    isLoading, 
    isInitialLoad,
    hasMore, 
    fetchInitialListings,
    error,
    searchParams,
    isDraggingMap,
    totalAccommodationsInRadius,
    fetchListingsPage,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages
  } = useListings();
  
  const containerRef = useRef(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  // Calculate total number of pages
  const pagesCount = totalPages || Math.ceil(totalAccommodationsInRadius / itemsPerPage) || 1;
  
  // Check if the error is a connection error
  const isConnectionError = error && (
    error.includes('connect') || 
    error.includes('network') || 
    error.includes('refused')
  );
  
  // Handle retry for connection errors
  const handleRetry = () => {
    fetchInitialListings();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    // Validate page limits
    if (newPage < 1 || newPage > pagesCount) return;
    
    setCurrentPage(newPage);
    fetchListingsPage(newPage);
    
    // Scroll to top of container
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
window.scrollTo(0,0)
  };
  
  // Check if we should show empty state after a delay
  useEffect(() => {
    let timer;
    
    if (isInitialLoad || isDraggingMap) {
      // Reset the empty state when loading starts or when dragging
      setShowEmptyState(false);
    } else if (!isLoading && listings.length === 0 && !isConnectionError) {
      // If not loading and we have no listings (and it's not a connection error), 
      // show empty state after a short delay
      timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 2000); // 2 second delay
    } else if (listings.length > 0) {
      // If we have listings, make sure empty state is hidden
      setShowEmptyState(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isInitialLoad, isLoading, listings, isConnectionError, isDraggingMap]);
  
  // Connection error state
  if (isConnectionError) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg shadow-inner p-8 max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <WifiOff className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">{t('connection_error')}</h3>
        <p className="text-gray-600 mb-6">
          {t('connection_error_description')}
        </p>
        <ul className="text-left text-gray-600 mb-6 pl-8 list-disc">
          <li>{t('internet_connection')}</li>
          <li>{t('server_not_running')}</li>
          <li>{t('server_different_port')}</li>
        </ul>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 inline-flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('try_again')}
        </button>
      </div>
    );
  }
  
  // Map dragging state - improved message
  if (isDraggingMap) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">
          {t('finding_accommodations')}
        </p>
      </div>
    );
  }
  
  // Initial loading state - show skeleton cards
  if (isInitialLoad && !showEmptyState) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  
  // Empty state
  if ((showEmptyState || (!isLoading && listings.length === 0)) && !isInitialLoad) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          {t('no_accommodations_found')}
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
        >
          {t('modify_search')}
        </button>
      </div>
    );
  }
  
  console.log(listings , "is page me listings hain");
  
  // Show listings with pagination
  return (
    <div ref={containerRef}>
      {/* Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {listings?.map((listing) => {
          // Handle possible object properties properly to avoid React rendering errors
          let sourceDisplay = t('unknown');
          if (listing.source) {
            // Check if source is an object with a name property
            if (typeof listing.source === 'object' && listing.source.name) {
              sourceDisplay = listing.source.name;
            } else if (typeof listing.source === 'string') {
              sourceDisplay = listing.source;
            }
          }
          
          // Handle location properly
          let locationDisplay = t('accommodation');
          if (listing.title) {
            locationDisplay = listing.title;
          } else if (listing.location) {
            if (typeof listing.location === 'object' && listing.location.address) {
              locationDisplay = listing.location.address;
            } else if (typeof listing.location === 'string') {
              locationDisplay = listing.location;
            }
          }
          
          // Handle distance info properly
          let distanceDisplay =  listing.distanceInfo;
          if (listing.distanceInfo) {
            if (typeof listing.distanceInfo === 'object' && listing.distanceInfo.distanceText) {
              distanceDisplay = listing.distanceInfo.distanceText;
            } else if (typeof listing.distanceInfo === 'string') {
              distanceDisplay = listing.distanceInfo;
            }else{
              distanceDisplay = listing.distanceInfo + " Km away";

            }
          }
          
          return (
           <AccommodationCard
  key={listing._id}
  id={listing._id}
  Code={listing.Code} // ✅ Add this line
  images={listing.images || []}
  price={(listing.pricePerNight?.isDiscountActivate && listing.pricePerNight?.discount) || listing.pricePerNight?.price || 0}
  location={locationDisplay}
  provider={listing.provider || listing.ownerType || t('unknown')}
  listingSource={sourceDisplay}
  pricePerNight={listing.pricePerNight}
  distance={(listing.distanceInfo / 1000).toFixed(2) + " km away"}

/>

          );
        })}
      </div>
      
      
      {/* Pagination Controls */}
      {totalAccommodationsInRadius > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentPage === 1 || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('previous')}
          </button>
          
          {/* Page Indicators */}
          <div className="hidden sm:flex space-x-1">
            {Array.from({ length: Math.min(5, pagesCount) }).map((_, index) => {
              // Calculate which page numbers to show
              let pageNum;
              if (pagesCount <= 5) {
                // If 5 or fewer pages, show all
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                // If near the beginning
                pageNum = index + 1;
              } else if (currentPage >= pagesCount - 2) {
                // If near the end
                pageNum = pagesCount - 4 + index;
              } else {
                // If in the middle, center around current page
                pageNum = currentPage - 2 + index;
              }
              
              // Ensure page numbers are within valid range
              if (pageNum < 1 || pageNum > pagesCount) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    isLoading ? 'opacity-50 cursor-not-allowed ' : ''
                  }${
                    currentPage === pageNum
                      ? 'bg-brand text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {/* Show ellipsis and last page if many pages */}
            {pagesCount > 5 && currentPage < pagesCount - 2 && (
              <>
                <span className="w-8 h-8 flex items-center justify-center">...</span>
                <button
                  onClick={() => handlePageChange(pagesCount)}
                  disabled={isLoading}
                  className={`w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {pagesCount}
                </button>
              </>
            )}
          </div>
          
          {/* Mobile Page Indicator */}
          <span className="sm:hidden text-gray-600">
            {t('page')} {currentPage} {t('of')} {pagesCount}
          </span>
          
          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagesCount || !hasMore || isLoading}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentPage === pagesCount || !hasMore || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('next')}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
        </div>
      )}
    </div>
  );
};

export default ImprovedVirtualizedListings;