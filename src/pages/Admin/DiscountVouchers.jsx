import React, { useState } from 'react';
import { Search, Plus, Edit, Trash } from 'lucide-react';

// Simple modal component for adding/editing vouchers
const VoucherModal = ({ isOpen, onClose, onSave, editVoucher = null }) => {
  const [formData, setFormData] = useState({
    code: editVoucher?.code || '',
    discountCHF: editVoucher?.discountCHF || '',
    discountEUR: editVoucher?.discountEUR || '',
    validFrom: editVoucher?.validFrom || '',
    validUntil: editVoucher?.validUntil || '',
    maxUses: editVoucher?.maxUses || '',
    description: editVoucher?.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editVoucher ? 'Edit Voucher' : 'Create Voucher'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voucher Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount (CHF)
              </label>
              <input
                type="number"
                name="discountCHF"
                value={formData.discountCHF}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount (EUR)
              </label>
              <input
                type="number"
                name="discountEUR"
                value={formData.discountEUR}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid From
                </label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses
              </label>
              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded-lg"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-lg"
            >
              {editVoucher ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Simple confirmation modal for deletion
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, voucherCode }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Voucher</h2>
        <p className="mb-6">Are you sure you want to delete voucher <strong>{voucherCode}</strong>? This action cannot be undone.</p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

const DiscountVouchers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: 'SUMMER2025',
      discountCHF: 50,
      discountEUR: 45,
      validFrom: '2025-06-01',
      validUntil: '2025-08-31',
      maxUses: 100,
      usedCount: 42,
      description: 'Summer promotion for all bookings'
    },
    {
      id: 2,
      code: 'WELCOME10',
      discountCHF: 25,
      discountEUR: 22,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      maxUses: 500,
      usedCount: 187,
      description: 'Welcome discount for new customers'
    },
    {
      id: 3,
      code: 'DOGFRIENDLY',
      discountCHF: 40,
      discountEUR: 35,
      validFrom: '2025-03-15',
      validUntil: '2025-09-15',
      maxUses: 200,
      usedCount: 68,
      description: 'Special discount for dog-friendly accommodations'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, voucher: null });

  // Filter vouchers based on search query
  const filteredVouchers = vouchers.filter(voucher =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle saving a voucher (create or update)
  const handleSaveVoucher = (voucherData) => {
    if (editVoucher) {
      // Update existing voucher
      setVouchers(vouchers.map(v =>
        v.id === editVoucher.id
          ? { ...v, ...voucherData, usedCount: v.usedCount }
          : v
      ));
    } else {
      // Create new voucher
      const newVoucher = {
        ...voucherData,
        id: Math.max(...vouchers.map(v => v.id)) + 1,
        usedCount: 0
      };
      setVouchers([...vouchers, newVoucher]);
    }
    setIsModalOpen(false);
    setEditVoucher(null);
  };

  // Handle deleting a voucher
  const handleDeleteVoucher = () => {
    if (deleteModal.voucher) {
      setVouchers(vouchers.filter(v => v.id !== deleteModal.voucher.id));
      setDeleteModal({ isOpen: false, voucher: null });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Discount Vouchers
        </h1>
        <p className="text-gray-600">
          Create and manage discount vouchers for your platform
        </p>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vouchers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={() => {
            setEditVoucher(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg"
        >
          <Plus size={16} />
          <span>Add Voucher</span>
        </button>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount CHF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount EUR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valid Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{voucher.code}</div>
                        <div className="text-xs text-gray-500">{voucher.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-brand">{voucher.discountCHF} CHF</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-brand">{voucher.discountEUR} EUR</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(voucher.validFrom)} - {formatDate(voucher.validUntil)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {voucher.usedCount} / {voucher.maxUses}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditVoucher(voucher);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-600 hover:text-brand"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, voucher })}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No vouchers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditVoucher(null);
        }}
        onSave={handleSaveVoucher}
        editVoucher={editVoucher}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, voucher: null })}
        onConfirm={handleDeleteVoucher}
        voucherCode={deleteModal.voucher?.code}
      />
    </div>
  );
};

export default DiscountVouchers;