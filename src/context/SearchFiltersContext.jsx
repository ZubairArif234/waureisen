import React, { createContext, useContext, useState } from 'react';

const SearchFiltersContext = createContext();

export const useSearchFilters = () => {
  const context = useContext(SearchFiltersContext);
  if (!context) {
    throw new Error('useSearchFilters must be used within a SearchFiltersProvider');
  }
  return context;
};

export const SearchFiltersProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState({});

  const updateFilters = (newFilters) => {
    setSearchFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  const clearFilters = () => {
    setSearchFilters({});
  };

  return (
    <SearchFiltersContext.Provider value={{ searchFilters, updateFilters, clearFilters }}>
      {children}
    </SearchFiltersContext.Provider>
  );
};
