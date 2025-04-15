import React, { useState } from 'react';
import { Search, Plus, Edit, Trash, Download } from 'lucide-react';

// Simple modal component for adding/editing vouchers
const VoucherModal = ({ isOpen, onClose, onSave, editVoucher = null }) => {
  const [formData, setFormData] = useState({
    code: editVoucher?.code || '',
    discountValue: editVoucher?.discount ? parseFloat(editVoucher.discount) : '',
    discountType: editVoucher?.discount ? 
      (editVoucher.discount.includes('%') ? '%' : 
       editVoucher.discount.includes('EUR') ? 'EUR' : 'CHF') : 'CHF',
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
    const combinedDiscount = `${formData.discountValue} ${formData.discountType}`;
    const submissionData = {
      ...formData,
      discount: combinedDiscount,
    };
    delete submissionData.discountValue;
    delete submissionData.discountType;
    onSave(submissionData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editVoucher ? 'Edit Voucher' : 'Create Voucher'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Discount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Enter value"
              min="0"
              step={formData.discountType === '%' ? '0.1' : '1'}
              required
            />
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="px-3 py-2 border rounded-lg bg-white"
            >
              <option value="CHF">CHF</option>
              <option value="EUR">EUR</option>
              <option value="%">%</option>
            </select>
          </div>
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
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              {editVoucher ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Delete confirmation modal stays the same
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, voucherCode }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Delete Voucher</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete voucher code "{voucherCode}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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

const DiscountVouchers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, voucher: null });
  
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: 'SUMMER2025',
      discount: '50 CHF',
      validFrom: '2025-06-01',
      validUntil: '2025-08-31',
      maxUses: 100,
      usedCount: 42,
      description: 'Summer promotion for all bookings'
    },
    {
      id: 2,
      code: 'WELCOME10',
      discount: '45 EUR',
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      maxUses: 500,
      usedCount: 187,
      description: 'Welcome discount for new customers'
    },
    {
      id: 3,
      code: 'SPRING2025',
      discount: '10%',
      validFrom: '2025-03-01',
      validUntil: '2025-05-31',
      maxUses: 200,
      usedCount: 15,
      description: 'Spring season discount'
    }
  ]);

  const handleSaveVoucher = (voucherData) => {
    if (editVoucher) {
      setVouchers(vouchers.map(v =>
        v.id === editVoucher.id
          ? { ...v, ...voucherData }
          : v
      ));
    } else {
      const newVoucher = {
        ...voucherData,
        id: Math.max(0, ...vouchers.map(v => v.id)) + 1,
        usedCount: 0
      };
      setVouchers([...vouchers, newVoucher]);
    }
    setIsModalOpen(false);
    setEditVoucher(null);
  };

  const handleDeleteVoucher = () => {
    if (deleteModal.voucher) {
      setVouchers(vouchers.filter(v => v.id !== deleteModal.voucher.id));
      setDeleteModal({ isOpen: false, voucher: null });
    }
  };

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export data to Excel
  const exportToExcel = () => {
    // Create data for export
    const exportData = filteredVouchers.map(voucher => ({
      Code: voucher.code,
      Discount: voucher.discount,
      ValidFrom: voucher.validFrom,
      ValidUntil: voucher.validUntil,
      MaxUses: voucher.maxUses,
      UsedCount: voucher.usedCount,
      Usage: `${voucher.usedCount}/${voucher.maxUses}`,
      Description: voucher.description
    }));

    // Convert data to CSV format
    const headers = Object.keys(exportData[0]);
    let csvContent = headers.join(',') + '\n';
    
    exportData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] != null ? row[header].toString() : '';
        // Escape values with commas, quotes or newlines
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'discount-vouchers-export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Discount Vouchers
          </h1>
          <p className="text-gray-600">
            Create and manage discount vouchers for your platform
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          
          <button 
            onClick={() => {
              setEditVoucher(null);
              setIsModalOpen(true);
            }}
            className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Voucher
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vouchers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{voucher.code}</div>
                      <div className="text-sm text-gray-500">{voucher.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand font-medium">{voucher.discount}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(voucher.validFrom).toLocaleDateString()} - {new Date(voucher.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {voucher.usedCount} / {voucher.maxUses}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditVoucher(voucher);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-brand"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, voucher })}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditVoucher(null);
        }}
        onSave={handleSaveVoucher}
        editVoucher={editVoucher}
      />

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