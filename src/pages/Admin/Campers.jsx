import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, AlertTriangle } from 'lucide-react';
import cr1 from '../../assets/cr1.png';
import cr2 from '../../assets/cr2.png';



const CamperCard = ({ camper, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative">
        <img 
          src={camper.image} 
          alt={camper.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
          {camper.status}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{camper.title}</h3>
            <p className="text-sm text-gray-500">{camper.location}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border">
                <button
                  onClick={() => {
                    onAction('edit', camper);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onAction('delete', camper);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            camper.status === 'Available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {camper.status}
          </div>
          <div className="text-brand font-medium">
            {camper.price} CHF/day
          </div>
        </div>
      </div>
    </div>
  );
};

const Campers = () => {
      // Add this line at the top
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [campers] = useState([
      {
        id: 1,
        title: 'Willy - Adventure Camper',
        location: 'Swiss Alps',
        price: 150,
        status: 'Available',
        image: cr1
      },
      {
        id: 2,
        title: 'Walter - Luxury Camper',
        location: 'Zurich',
        price: 180,
        status: 'Coming Soon',
        image: cr2
      }
    ]);
  
    const handleAction = (action, camper) => {
      if (action === 'edit') {
        navigate(`/admin/campers/edit/${camper.id}`);
      } else if (action === 'delete') {
        // Handle delete
        console.log('Delete camper:', camper);
      } else if (action === 'new') {
        navigate('/admin/campers/new');
      }
    };

  const filteredCampers = campers.filter(camper =>
    camper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camper.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Camper Management
          </h1>
          <p className="text-gray-600">
            Add and manage your camper fleet
          </p>
        </div>
        
        <button 
          onClick={() => handleAction('new')}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Camper
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">Filter</span>
        </button>
      </div>

      {/* Campers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampers.map(camper => (
          <CamperCard 
            key={camper.id} 
            camper={camper}
            onAction={handleAction}
          />
        ))}
      </div>
      
      {/* No results message */}
      {filteredCampers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No campers found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Campers;