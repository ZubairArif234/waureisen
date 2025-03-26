import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash, AlertTriangle } from 'lucide-react';

// Modal for adding/editing a subsection
const SubsectionModal = ({ isOpen, onClose, onSave, editingSubsection = null }) => {
  const [formData, setFormData] = useState({
    name: editingSubsection?.name || '',
    description: editingSubsection?.description || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingSubsection ? 'Edit Subsection' : 'Add New Subsection'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subsection Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
              >
                {editingSubsection ? 'Update' : 'Add'} Subsection
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Modal for adding/editing a filter
const FilterModal = ({ isOpen, onClose, onSave, editingFilter = null, subsectionId }) => {
  const [formData, setFormData] = useState({
    name: editingFilter?.name || '',
    type: editingFilter?.type || 'text',
    options: editingFilter?.options || [],
    required: editingFilter?.required || false
  });

  const [newOption, setNewOption] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, subsectionId });
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingFilter ? 'Edit Filter' : 'Add New Filter'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Dropdown</option>
                <option value="radio">Radio</option>
              </select>
            </div>

            {['select', 'radio'].includes(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      placeholder="Add option"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span>{option}</span>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <label htmlFor="required" className="text-sm text-gray-700">
                Required field
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
              >
                {editingFilter ? 'Update' : 'Add'} Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Delete confirmation modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">Delete {itemType}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const FiltersManagement = () => {
  // State for subsections and filters
  const [subsections, setSubsections] = useState([
    {
      id: 1,
      name: 'Basic Info',
      description: 'Essential details about the accommodation',
      expanded: true,
      filters: [
        { id: 1, name: 'People', type: 'number', required: true },
        { id: 2, name: 'Dogs', type: 'number', required: true },
        { id: 3, name: 'Bedrooms', type: 'number', required: true },
        { id: 4, name: 'Rooms', type: 'number', required: true },
        { id: 5, name: 'Washrooms', type: 'number', required: true }
      ]
    },
    {
      id: 2,
      name: 'Amenities',
      description: 'Available features and facilities',
      expanded: false,
      filters: [
        { id: 6, name: 'Kitchen', type: 'checkbox', required: false },
        { id: 7, name: 'Air Conditioning', type: 'checkbox', required: false },
        { id: 8, name: 'Parking', type: 'checkbox', required: false },
        { id: 9, name: 'WiFi', type: 'checkbox', required: false }
      ]
    }
  ]);
  const [subsectionModal, setSubsectionModal] = useState({ isOpen: false, editingSubsection: null });
  const [filterModal, setFilterModal] = useState({ isOpen: false, editingFilter: null, subsectionId: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: null });

  // Toggle subsection expansion
  const toggleSubsection = (id) => {
    setSubsections(prev => prev.map(sub => 
      sub.id === id ? { ...sub, expanded: !sub.expanded } : sub
    ));
  };

  // Add or update subsection
  const handleSaveSubsection = (formData) => {
    if (subsectionModal.editingSubsection) {
      setSubsections(prev => prev.map(sub =>
        sub.id === subsectionModal.editingSubsection.id
          ? { ...sub, ...formData }
          : sub
      ));
    } else {
      const newSubsection = {
        id: Math.max(0, ...subsections.map(s => s.id)) + 1,
        ...formData,
        expanded: false,
        filters: []
      };
      setSubsections(prev => [...prev, newSubsection]);
    }
    setSubsectionModal({ isOpen: false, editingSubsection: null });
  };

  // Add or update filter
  const handleSaveFilter = (formData) => {
    const { subsectionId, ...filterData } = formData;
    
    setSubsections(prev => prev.map(sub => {
      if (sub.id === subsectionId) {
        if (filterModal.editingFilter) {
          const updatedFilters = sub.filters.map(f =>
            f.id === filterModal.editingFilter.id ? { ...f, ...filterData } : f
          );
          return { ...sub, filters: updatedFilters };
        } else {
          const newFilter = {
            id: Math.max(0, ...sub.filters.map(f => f.id)) + 1,
            ...filterData
          };
          return { ...sub, filters: [...sub.filters, newFilter] };
        }
      }
      return sub;
    }));
    
    setFilterModal({ isOpen: false, editingFilter: null, subsectionId: null });
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (deleteModal.type === 'subsection') {
      setSubsections(prev => prev.filter(sub => sub.id !== deleteModal.item.id));
    } else if (deleteModal.type === 'filter') {
      setSubsections(prev => prev.map(sub => ({
        ...sub,
        filters: sub.filters.filter(f => f.id !== deleteModal.item.id)
      })));
    }
    setDeleteModal({ isOpen: false, item: null, type: null });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Filters Management
          </h1>
          <p className="text-gray-600">
            Manage filter subsections and their fields for accommodations
          </p>
        </div>
        
        <button 
          onClick={() => setSubsectionModal({ isOpen: true, editingSubsection: null })}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Subsection
        </button>
      </div>

      {/* Subsections List */}
      <div className="space-y-6">
        {subsections.map(subsection => (
          <div key={subsection.id} className="border rounded-lg overflow-hidden">
            {/* Subsection Header */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleSubsection(subsection.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {subsection.expanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {subsection.name}
                    </h3>
                    {subsection.description && (
                      <p className="text-sm text-gray-500">{subsection.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSubsectionModal({ 
                    isOpen: true, 
                    editingSubsection: subsection 
                  })}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteModal({ 
                    isOpen: true, 
                    item: subsection,
                    type: 'subsection'
                  })}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters List */}
            {subsection.expanded && (
              <div className="p-6 space-y-4">
                {subsection.filters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subsection.filters.map(filter => (
                      <div
                        key={filter.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{filter.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{filter.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setFilterModal({
                                isOpen: true,
                                editingFilter: filter,
                                subsectionId: subsection.id
                              })}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                item: filter,
                                type: 'filter'
                              })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {filter.required && (
                          <span className="mt-2 inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            Required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No filters added yet.{' '}
                    <button
                      onClick={() => setFilterModal({
                        isOpen: true,
                        editingFilter: null,
                        subsectionId: subsection.id
                      })}
                      className="text-brand hover:underline"
                    >
                      Add one now
                    </button>
                  </div>
                )}
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setFilterModal({
                      isOpen: true,
                      editingFilter: null,
                      subsectionId: subsection.id
                    })}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subsections.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No subsections added yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first filter subsection
          </p>
          <button
            onClick={() => setSubsectionModal({ isOpen: true, editingSubsection: null })}
            className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add First Subsection
          </button>
        </div>
      )}

      {/* Modals */}
      <SubsectionModal
        isOpen={subsectionModal.isOpen}
        onClose={() => setSubsectionModal({ isOpen: false, editingSubsection: null })}
        onSave={handleSaveSubsection}
        editingSubsection={subsectionModal.editingSubsection}
      />

      <FilterModal
        isOpen={filterModal.isOpen}
        onClose={() => setFilterModal({ isOpen: false, editingFilter: null, subsectionId: null })}
        onSave={handleSaveFilter}
        editingFilter={filterModal.editingFilter}
        subsectionId={filterModal.subsectionId}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.item?.name}
        itemType={deleteModal.type === 'subsection' ? 'Subsection' : 'Filter'}
      />
    </div>
  );
};

export default FiltersManagement;