import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const UnblockDatesModal = ({ isOpen, onClose, listings, selectedListing, unavailableDates, onUnblock }) => {
  const { t } = useLanguage();
  const [listingFilter, setListingFilter] = useState(selectedListing !== 'all' ? selectedListing : '');
  const [selectedDates, setSelectedDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Group unavailable dates by month for better organization
  const groupedDates = filteredDates.reduce((groups, date) => {
    const monthYear = new Date(date.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(date);
    return groups;
  }, {});

  // Update filtered dates when listing filter or unavailable dates change
  useEffect(() => {
    if (unavailableDates) {
      setFilteredDates(
        unavailableDates.filter(date => 
          !listingFilter || date.listingId === listingFilter
        ).sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    }
  }, [listingFilter, unavailableDates]);

  // Reset selected dates when listing filter changes
  useEffect(() => {
    setSelectedDates([]);
  }, [listingFilter]);

  // Initialize listing filter when modal opens
  useEffect(() => {
    if (isOpen && selectedListing !== 'all') {
      setListingFilter(selectedListing);
    }
  }, [isOpen, selectedListing]);

  const handleToggleDate = (date) => {
    setSelectedDates(prev => {
      if (prev.includes(date.date)) {
        return prev.filter(d => d !== date.date);
      } else {
        return [...prev, date.date];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDates.length === filteredDates.length) {
      setSelectedDates([]);
    } else {
      setSelectedDates(filteredDates.map(date => date.date));
    }
  };

  const handleUnblock = async () => {
    if (selectedDates.length === 0 || !listingFilter) return;
    
    setIsLoading(true);
    try {
      // Make sure we're passing the data in the format expected by the API
      await onUnblock({
        listingId: listingFilter,
        dates: selectedDates
      });
      onClose();
    } catch (error) {
      console.error('Error unblocking dates:', error);
      // Error handling would go here
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  const noBlockedDates = filteredDates.length === 0;
  const allSelected = selectedDates.length === filteredDates.length && filteredDates.length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-900">{t('unblock_dates')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('property')}
              </label>
              <select
                id="listing-filter"
                value={listingFilter}
                onChange={(e) => setListingFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              >
                <option value="" disabled>{t('select_property')}</option>
                {listings.map(listing => (
                  <option key={listing.id || listing._id} value={listing.id || listing._id}>
                    {listing.title}
                  </option>
                ))}
              </select>
            </div>
            
            {!listingFilter ? (
              <div className="text-center py-4 text-gray-500">
                {t('select_property_to_view_dates')}
              </div>
            ) : noBlockedDates ? (
              <div className="text-center py-4 text-gray-500">
                {t('no_blocked_dates_for_property')}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-700">
                    {filteredDates.length} {filteredDates.length === 1 ? t('blocked_date') : t('blocked_dates')}
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-brand hover:underline"
                  >
                    {allSelected ? t('deselect_all') : t('select_all')}
                  </button>
                </div>
                
                <div className="divide-y">
                  {Object.entries(groupedDates).map(([monthYear, dates]) => (
                    <div key={monthYear} className="pt-2 pb-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{monthYear}</h3>
                      <div className="space-y-2">
                        {dates.map(date => (
                          <div 
                            key={date.date}
                            className={`flex items-center p-2 rounded-md ${
                              selectedDates.includes(date.date) ? 'bg-brand/10 border border-brand/30' : 'hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={`date-${date.date}`}
                              checked={selectedDates.includes(date.date)}
                              onChange={() => handleToggleDate(date)}
                              className="h-4 w-4 text-brand rounded border-gray-300 focus:ring-brand"
                            />
                            <label htmlFor={`date-${date.date}`} className="ml-3 cursor-pointer flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {formatDate(date.date)}
                              </div>
                              {date.reason && (
                                <div className="text-xs text-gray-500">
                                  {t('reason')}: {date.reason}
                                </div>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleUnblock}
              disabled={selectedDates.length === 0 || !listingFilter || isLoading}
              className={`px-4 py-2 bg-brand text-white rounded-md text-sm font-medium ${
                selectedDates.length === 0 || !listingFilter || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-brand/90'
              }`}
            >
              {isLoading ? t('unblocking') : t('unblock_selected')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnblockDatesModal;