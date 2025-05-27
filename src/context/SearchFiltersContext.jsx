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
  const [searchFilters, setSearchFilters] = useState({
    selected: {
      accommodation: [],
      kitchen: [],
      pool: [],
      wellness: [],
      kids: [],
      water: [],
      catering: [],
      parking: [],
      view: [],
      sport: [],
      smoking: [],
      accessibility: []
    },
    ranges: {
      people: { min: 1, max: 25 },
      dogs: { min: 0, max: 25 },
      rooms: { min: 1, max: 25 },
      bathrooms: { min: 1, max: 25 },
      price: { min: 0, max: 10000 }
    }
  });

  const updateFilters = (newFilters) => {
    console.log('SearchFiltersContext - Updating filters:', newFilters);
    setSearchFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,
        selected: {
          ...prevFilters.selected,
          ...(newFilters.selected || {})
        },
        ranges: {
          ...prevFilters.ranges,
          ...(newFilters.ranges || {})
        }
      };
      console.log('SearchFiltersContext - Updated filters:', updatedFilters);
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setSearchFilters({
      selected: {
        accommodation: [],
        kitchen: [],
        pool: [],
        wellness: [],
        kids: [],
        water: [],
        catering: [],
        parking: [],
        view: [],
        sport: [],
        smoking: [],
        accessibility: []
      },
      ranges: {
        people: { min: 1, max: 25 },
        dogs: { min: 0, max: 25 },
        rooms: { min: 1, max: 25 },
        bathrooms: { min: 1, max: 25 },
        price: { min: 0, max: 10000 }
      }
    });
  };

  return (
    <SearchFiltersContext.Provider value={{ searchFilters, updateFilters, clearFilters }}>
      {children}
    </SearchFiltersContext.Provider>
  );
};
