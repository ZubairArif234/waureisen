import React, { createContext, useContext, useState } from 'react';

const PriceFilterContext = createContext();

export const PriceFilterProvider = ({ children }) => {
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000
  });

  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);

  const applyPriceFilter = (listings) => {
    if (!isPriceFilterActive) return listings;

    return listings.filter(listing => {
      const price = Number(listing.pricePerNight?.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });
  };

  return (
    <PriceFilterContext.Provider value={{
      priceRange,
      setPriceRange,
      isPriceFilterActive,
      setIsPriceFilterActive,
      applyPriceFilter
    }}>
      {children}
    </PriceFilterContext.Provider>
  );
};

export const usePriceFilter = () => {
  const context = useContext(PriceFilterContext);
  if (!context) {
    throw new Error('usePriceFilter must be used within a PriceFilterProvider');
  }
  return context;
}; 