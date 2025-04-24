import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash, Download } from "lucide-react";
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../api/adminAPI";
import { exportToExcel } from "../../utils/exportUtils";

// Skeleton for loading state
const SkeletonTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(6)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Simple modal component for adding/editing vouchers
const VoucherModal = ({ isOpen, onClose, onSave, editVoucher = null }) => {
  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    discountType: "CHF",
    validUntil: "",
    status: "active",
    voucherBy: "admin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens or editVoucher changes
  useEffect(() => {
    if (isOpen) {
      if (editVoucher) {
        // When editing existing voucher
        let discountValue = "";
        let discountType = "CHF";

        // Determine discount type and value
        if (editVoucher.discountPercentage > 0) {
          discountValue = editVoucher.discountPercentage;
          discountType = "%";
        } else if (
          editVoucher.discountMoney &&
          editVoucher.discountMoney.chf > 0
        ) {
          discountValue = editVoucher.discountMoney.chf;
          discountType = "CHF";
        } else if (
          editVoucher.discountMoney &&
          editVoucher.discountMoney.eur > 0
        ) {
          discountValue = editVoucher.discountMoney.eur;
          discountType = "EUR";
        }

        // Format date for input field
        const formattedDate = editVoucher.validUntil
          ? new Date(editVoucher.validUntil).toISOString().split("T")[0]
          : "";

        setFormData({
          code: editVoucher.code || "",
          discountValue,
          discountType,
          validUntil: formattedDate,
          status: editVoucher.status || "active",
          voucherBy: editVoucher.voucherBy || "admin",
        });
      } else {
        // When creating new voucher
        setFormData({
          code: "",
          discountValue: "",
          discountType: "CHF",
          validUntil: "",
          status: "active",
          voucherBy: "admin",
        });
      }
      setError("");
    }
  }, [isOpen, editVoucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.code || !formData.discountValue || !formData.validUntil) {
        throw new Error("Please fill all required fields");
      }

      // Prepare the submission data
      const submissionData = {
        code: formData.code,
        status: formData.status,
        validUntil: new Date(formData.validUntil),
        voucherBy: formData.voucherBy,
      };

      // Set either discountPercentage or discountMoney based on discountType
      if (formData.discountType === "%") {
        submissionData.discountPercentage = parseFloat(formData.discountValue);
        submissionData.discountMoney = { chf: 0, eur: 0 };
      } else {
        submissionData.discountPercentage = 0;
        submissionData.discountMoney = {
          chf:
            formData.discountType === "CHF"
              ? parseFloat(formData.discountValue)
              : 0,
          eur:
            formData.discountType === "EUR"
              ? parseFloat(formData.discountValue)
              : 0,
        };
      }

      await onSave(submissionData, editVoucher?._id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save voucher. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editVoucher ? "Edit Voucher" : "Create Voucher"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Code*
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
              Discount*
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
                step={formData.discountType === "%" ? "0.1" : "1"}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until*
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <select
              name="voucherBy"
              value={formData.voucherBy}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : editVoucher ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Delete confirmation modal
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  voucherCode,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-w-[90%]">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Delete Voucher</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete voucher code "{voucherCode}"? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const DiscountVouchers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    voucher: null,
  });
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch vouchers on component mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getAllVouchers();
      setVouchers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      setError("Failed to load vouchers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVoucher = async (voucherData, voucherId = null) => {
    try {
      if (voucherId) {
        // Update existing voucher
        const updatedVoucher = await updateVoucher(voucherId, voucherData);

        // Update vouchers list
        setVouchers((prevVouchers) =>
          prevVouchers.map((v) => (v._id === voucherId ? updatedVoucher : v))
        );
      } else {
        // Create new voucher
        const newVoucher = await createVoucher(voucherData);

        // Add new voucher to list
        setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
      }

      return true;
    } catch (error) {
      console.error("Error saving voucher:", error);
      throw new Error("Failed to save voucher. Please try again.");
    }
  };

  const handleDeleteVoucher = async () => {
    if (!deleteModal.voucher) return;

    setIsDeleting(true);
    try {
      await deleteVoucher(deleteModal.voucher._id);

      // Remove voucher from state
      setVouchers(vouchers.filter((v) => v._id !== deleteModal.voucher._id));

      // Close modal
      setDeleteModal({ isOpen: false, voucher: null });
    } catch (error) {
      console.error("Error deleting voucher:", error);
      setError("Failed to delete voucher. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format display of discount (percentage or money)
  const formatDiscount = (voucher) => {
    if (!voucher) return "N/A";

    if (voucher.discountPercentage && voucher.discountPercentage > 0) {
      return `${voucher.discountPercentage}%`;
    }

    if (voucher.discountMoney) {
      if (voucher.discountMoney.chf && voucher.discountMoney.chf > 0) {
        return `${voucher.discountMoney.chf} CHF`;
      }
      if (voucher.discountMoney.eur && voucher.discountMoney.eur > 0) {
        return `${voucher.discountMoney.eur} EUR`;
      }
    }

    return "N/A";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle export to CSV/Excel
  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredVouchers.map((voucher) => ({
      Code: voucher.code,
      Discount: formatDiscount(voucher),
      "Valid Until": formatDate(voucher.validUntil),
      Status: voucher.status
        ? voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)
        : "Unknown",
      "Created By": voucher.voucherBy === "admin" ? "Admin" : "Provider",
      "Created At": formatDate(voucher.createdAt),
    }));

    exportToExcel(exportData, "vouchers-export");
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
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading || filteredVouchers.length === 0}
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

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vouchers by code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && <SkeletonTable />}

      {/* Vouchers Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valid Until
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created By
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {voucher.code}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-brand font-medium">
                        {formatDiscount(voucher)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(voucher.validUntil)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            voucher.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {voucher.status
                            ? voucher.status.charAt(0).toUpperCase() +
                              voucher.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {voucher.voucherBy === "admin" ? "Admin" : "Provider"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditVoucher(voucher);
                              setIsModalOpen(true);
                            }}
                            className="text-gray-600 hover:text-brand"
                            title="Edit voucher"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, voucher })
                            }
                            className="text-gray-600 hover:text-red-600"
                            title="Delete voucher"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No vouchers found. Create your first voucher by clicking
                      the "Add Voucher" button.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DiscountVouchers;
