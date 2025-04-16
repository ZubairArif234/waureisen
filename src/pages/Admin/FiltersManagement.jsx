import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash, AlertTriangle, Calendar, FileImage, ListFilter, Check, Edit } from 'lucide-react';
import { getActiveFilters, createSubsection, updateSubsection, deleteSubsection, createFilter, updateFilter, deleteFilter } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

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
    required: editingFilter?.required || false,
    fileTypes: editingFilter?.fileTypes || 'image/*'
  });

  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (editingFilter) {
      setFormData({
        name: editingFilter.name || '',
        type: editingFilter.type || 'text',
        options: editingFilter.options || [],
        required: editingFilter.required || false,
        fileTypes: editingFilter.fileTypes || 'image/*'
      });
    } else {
      setFormData({
        name: '',
        type: 'text',
        options: [],
        required: false,
        fileTypes: 'image/*'
      });
    }
  }, [editingFilter]);

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

  // Filter type icons
  const typeIcons = {
    text: <ListFilter className="w-4 h-4" />,
    number: <ListFilter className="w-4 h-4" />,
    checkbox: <Check className="w-4 h-4" />,
    select: <ListFilter className="w-4 h-4" />,
    radio: <ListFilter className="w-4 h-4" />,
    file: <FileImage className="w-4 h-4" />,
    date: <Calendar className="w-4 h-4" />
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md overflow-y-auto max-h-[90vh]">
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
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand appearance-none pr-10"
                >
                  <option value="text">Text Input</option>
                  <option value="number">Number Input</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="select">Dropdown Select</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="file">File Upload</option>
                  <option value="date">Date Picker</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {typeIcons[formData.type]}
                </div>
              </div>
            </div>

            {formData.type === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Types
                </label>
                <input
                  type="text"
                  value={formData.fileTypes}
                  onChange={(e) => setFormData({ ...formData, fileTypes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="e.g., image/*, .pdf, .doc"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter allowed file types (e.g., image/*, .pdf, .docx)
                </p>
              </div>
            )}

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
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.options.length > 0 ? (
                      formData.options.map((option, index) => (
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
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-2 text-center">
                        No options added yet
                      </p>
                    )}
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

// Filter type icons for the filter cards
const FilterTypeIcon = ({ type }) => {
  switch (type) {
    case 'text':
      return <ListFilter className="w-4 h-4 text-gray-500" />;
    case 'number':
      return <ListFilter className="w-4 h-4 text-gray-500" />;
    case 'checkbox':
      return <Check className="w-4 h-4 text-gray-500" />;
    case 'select':
      return <ListFilter className="w-4 h-4 text-gray-500" />;
    case 'radio':
      return <ListFilter className="w-4 h-4 text-gray-500" />;
    case 'file':
      return <FileImage className="w-4 h-4 text-gray-500" />;
    case 'date':
      return <Calendar className="w-4 h-4 text-gray-500" />;
    default:
      return <ListFilter className="w-4 h-4 text-gray-500" />;
  }
};

const FiltersManagement = () => {
  // State for active filter document and UI state
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubsections, setExpandedSubsections] = useState({});
  
  // Modal states
  const [subsectionModal, setSubsectionModal] = useState({ isOpen: false, editingSubsection: null });
  const [filterModal, setFilterModal] = useState({ 
    isOpen: false, 
    editingFilter: null, 
    subsectionId: null 
  });
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    item: null, 
    type: null,
    subsectionId: null
  });

  // Fetch active filters on component mount
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const data = await getActiveFilters();
      setActiveFilter(data);
      
      // Set Basic Info expanded by default
      if (data && data.subsections && data.subsections.length) {
        const expanded = {};
        data.subsections.forEach((sub) => {
          if (sub.name === 'Basic Info') {
            expanded[sub._id] = true;
          }
        });
        setExpandedSubsections(expanded);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
      setError('Failed to load filters. Please try again.');
      toast.error('Failed to load filters');
    } finally {
      setLoading(false);
    }
  };

  // Toggle subsection expansion
  const toggleSubsection = (id) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add or update subsection
  const handleSaveSubsection = async (formData) => {
    try {
      if (subsectionModal.editingSubsection) {
        // Update existing subsection
        await updateSubsection(
          activeFilter._id,
          subsectionModal.editingSubsection._id,
          formData
        );
        toast.success('Subsection updated successfully');
      } else {
        // Add new subsection
        await createSubsection(activeFilter._id, formData);
        toast.success('Subsection added successfully');
      }
      
      // Refresh filters
      fetchFilters();
    } catch (err) {
      console.error('Error saving subsection:', err);
      toast.error('Failed to save subsection');
    } finally {
      setSubsectionModal({ isOpen: false, editingSubsection: null });
    }
  };

  // Add or update filter
  const handleSaveFilter = async (formData) => {
    try {
      const { subsectionId, ...filterData } = formData;
      
      if (filterModal.editingFilter) {
        // Update existing filter
        await updateFilter(
          activeFilter._id,
          subsectionId,
          filterModal.editingFilter._id,
          filterData
        );
        toast.success('Filter updated successfully');
      } else {
        // Add new filter
        await createFilter(activeFilter._id, subsectionId, filterData);
        toast.success('Filter added successfully');
      }
      
      // Refresh filters
      fetchFilters();
    } catch (err) {
      console.error('Error saving filter:', err);
      toast.error('Failed to save filter');
    } finally {
      setFilterModal({ isOpen: false, editingFilter: null, subsectionId: null });
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      if (deleteModal.type === 'subsection') {
        // Delete subsection
        await deleteSubsection(activeFilter._id, deleteModal.item._id);
        toast.success('Subsection deleted successfully');
      } else if (deleteModal.type === 'filter') {
        // Delete filter
        await deleteFilter(
          activeFilter._id,
          deleteModal.subsectionId,
          deleteModal.item._id
        );
        toast.success('Filter deleted successfully');
      }
      
      // Refresh filters
      fetchFilters();
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Failed to delete item');
    } finally {
      setDeleteModal({ isOpen: false, item: null, type: null, subsectionId: null });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading filters...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Filters</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFilters}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        {activeFilter && activeFilter.subsections && activeFilter.subsections.length > 0 ? (
          activeFilter.subsections.map(subsection => (
            <div key={subsection._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Subsection Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSubsection(subsection._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSubsections[subsection._id] ? (
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
                    title="Edit subsection"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setFilterModal({
                      isOpen: true,
                      editingFilter: null,
                      subsectionId: subsection._id
                    })}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Add filter"
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
                    title="Delete subsection"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filters List */}
              {expandedSubsections[subsection._id] && (
                <div className="p-6 space-y-4">
                  {subsection.filters && subsection.filters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subsection.filters.map(filter => (
                        <div
                          key={filter._id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <FilterTypeIcon type={filter.type} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{filter.name}</h4>
                                <p className="text-sm text-gray-500 capitalize">{filter.type}</p>
                                
                                {/* Show options count for select/radio types */}
                                {['select', 'radio'].includes(filter.type) && filter.options && filter.options.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {filter.options.length} option{filter.options.length !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setFilterModal({
                                  isOpen: true,
                                  editingFilter: filter,
                                  subsectionId: subsection._id
                                })}
                                className="text-gray-500 hover:text-gray-700"
                                title="Edit filter"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteModal({
                                  isOpen: true,
                                  item: filter,
                                  type: 'filter',
                                  subsectionId: subsection._id
                                })}
                                className="text-red-500 hover:text-red-700"
                                title="Delete filter"
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
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      No filters added yet.{' '}
                      <button
                        onClick={() => setFilterModal({
                          isOpen: true,
                          editingFilter: null,
                          subsectionId: subsection._id
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
                        subsectionId: subsection._id
                      })}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
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
      </div>

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
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: null, subsectionId: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.item?.name}
        itemType={deleteModal.type === 'subsection' ? 'Subsection' : 'Filter'}
      />
    </div>
  );
};

export default FiltersManagement;