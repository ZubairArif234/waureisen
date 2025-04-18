// src/pages/Admin/Campers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import CamperCard from '../../components/Admin/CamperCard';
import { getAllCampers, deleteCamper } from '../../api/camperAPI';
import toast from 'react-hot-toast';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, camperTitle }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete Camper</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{camperTitle}</span>"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Campers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch campers on component mount
  useEffect(() => {
    fetchCampers();
  }, []);

  // Fetch campers from API
  const fetchCampers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      
      const campersData = await getAllCampers(filters);
      setCampers(campersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching campers:', err);
      setError('Failed to load campers');
      toast.error('Error loading campers');
    } finally {
      setLoading(false);
    }
  };
  
  // Refetch campers when category changes
  useEffect(() => {
    if (!loading) {
      fetchCampers();
    }
  }, [selectedCategory]);

  // Handler for editing a camper
  const handleEdit = (camper) => {
    navigate(`/admin/campers/edit/${camper._id}`);
  };

  // Handler for deleting a camper
  const handleDelete = (id) => {
    const camper = campers.find(camper => camper._id === id);
    setDeleteModal({ 
      isOpen: true, 
      id, 
      title: camper?.title || 'this camper' 
    });
  };

  // Handler for adding a new camper
  const handleAdd = () => {
    navigate('/admin/campers/new');
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteCamper(deleteModal.id);
      
      // Update local state
      setCampers(prevCampers => prevCampers.filter(camper => camper._id !== deleteModal.id));
      
      toast.success('Camper deleted successfully');
    } catch (error) {
      console.error('Error deleting camper:', error);
      toast.error('Failed to delete camper');
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: '' });
    }
  };

  // Filter campers based on search query
  const filteredCampers = campers.filter(camper => 
    (camper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     camper.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     camper.location.toLowerCase().includes(searchQuery.toLowerCase()))
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
            Manage your dog-friendly camper fleet
          </p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Camper
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 mb-4 md:mb-0">
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

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Driver cabin">Driver cabin</option>
            <option value="Living area & kitchen">Living area & kitchen</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Dog facilities">Dog facilities</option>
            <option value="Additional">Additional</option>
            <option value="Security deposit">Security deposit</option>
            <option value="Rules & requirements">Rules & requirements</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </p>
          <button 
            onClick={fetchCampers}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Campers Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampers.map(camper => (
              <CamperCard 
                key={camper._id} 
                camper={{
                  id: camper._id,
                  title: camper.title,
                  description: camper.description,
                  excerpt: camper.excerpt,
                  category: camper.category,
                  featuredImage: camper.featuredImage,
                  status: camper.status,
                  price: camper.price,
                  currency: camper.currency,
                  location: camper.location
                }}
                onEdit={() => handleEdit(camper)}
                onDelete={() => handleDelete(camper._id)}
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
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        camperTitle={deleteModal.title}
      />
    </div>
  );
};

export default Campers;