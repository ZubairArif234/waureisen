import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const AccommodationCard = ({ accommodation }) => (
  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
    <div className="aspect-w-16 aspect-h-9">
      <img 
        src={accommodation.image} 
        alt={accommodation.title}
        className="w-full h-48 object-cover"
      />
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{accommodation.title}</h3>
          <p className="text-sm text-gray-500">{accommodation.location}</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="px-2 py-1 bg-gray-100 rounded text-sm">
          {accommodation.source}
        </div>
        <div className="text-brand font-medium">
          {accommodation.price} CHF/night
        </div>
      </div>
    </div>
  </div>
);

const Accommodations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');

  // Dummy data
  const accommodations = [
    {
      id: 1,
      title: 'Mountain View Chalet',
      location: 'Swiss Alps, Switzerland',
      price: 250,
      source: 'Admin',
      image: i1
    },
    {
      id: 2,
      title: 'Beachfront Villa',
      location: 'Costa Brava, Spain',
      price: 350,
      source: 'Provider',
      image: i2
    },
    {
      id: 3,
      title: 'Lake House',
      location: 'Lake Como, Italy',
      price: 400,
      source: 'Interhome',
      image: i3
    },
  ];

  const filteredAccommodations = accommodations.filter(acc => 
    (selectedSource === 'all' || acc.source === selectedSource) &&
    (acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     acc.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Accommodations
        </h1>
        <p className="text-gray-600">
          Manage and monitor all accommodation listings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search accommodations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            <option value="all">All Sources</option>
            <option value="Admin">Admin</option>
            <option value="Provider">Provider</option>
            <option value="Interhome">Interhome</option>
          </select>
        </div>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations.map(accommodation => (
          <AccommodationCard 
            key={accommodation.id} 
            accommodation={accommodation}
          />
        ))}
      </div>
    </div>
  );
};

export default Accommodations;