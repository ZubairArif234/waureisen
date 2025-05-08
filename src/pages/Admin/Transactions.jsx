import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Filter,
  X,
  Download,
  AlertTriangle,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
} from "lucide-react";
import { getAllTransactions, updateTransaction } from "../../api/adminAPI";
import { exportToExcel } from "../../utils/exportUtils";

// Skeleton loader for transactions table
const SkeletonTable = () => {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[...Array(9)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const TransactionDetailModal = ({ transaction, isOpen, onClose, onCancel }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(transaction._id);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Error cancelling transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "canceled":
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format user name from transaction
  const getUserName = () => {
    if (!transaction.user) return "Unknown User";
    if (typeof transaction.user === "object") {
      return (
        `${transaction.user.firstName || ""} ${
          transaction.user.lastName || ""
        }`.trim() ||
        transaction.user.username ||
        "Unknown User"
      );
    }
    return "Unknown User";
  };

  // Format transaction amount
  const getAmount = () => {
    if (!transaction.amount) return "N/A";
    
    if (transaction.amount.chf && transaction.amount.chf > 0) {
      return `${transaction.amount.chf} CHF`;
    } else if (transaction.amount.eur && transaction.amount.eur > 0) {
      return `${transaction.amount.eur} EUR`;
    }
    
    return "N/A";
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50" 
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Transaction Details
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">
                {transaction.transactionId || transaction._id}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-brand">{getAmount()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer:</span>
              <span>{getUserName()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Number:</span>
              <span>{transaction.user?.customerNumber || "N/A"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method:</span>
              <span>{transaction.method || "N/A"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Details:</span>
              <span>{transaction.details || "N/A"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status
                  ? transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            {transaction.status === "paid" && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cancel Booking"}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCancelConfirm(false)}
          />
          <div className="bg-white rounded-lg p-6 w-96 relative z-10">
            <h4 className="text-lg font-medium mb-4">Cancel Booking</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={isLoading}
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TransactionRow = ({ transaction, onViewDetails }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "canceled":
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format user name from transaction
  const getUserName = () => {
    if (!transaction.user) return "Unknown User";
    if (typeof transaction.user === "object") {
      return (
        `${transaction.user.firstName || ""} ${
          transaction.user.lastName || ""
        }`.trim() ||
        transaction.user.username ||
        "Unknown User"
      );
    }
    return "Unknown User";
  };
  
  // Format customer number
  const getCustomerNumber = () => {
    if (!transaction.user) return "N/A";
    return transaction.user.customerNumber
      ? `#${transaction.user.customerNumber}`
      : "N/A";
  };

  // Format transaction amount
  const getAmount = () => {
    if (!transaction.amount) return "N/A";
    
    if (transaction.amount.chf && transaction.amount.chf > 0) {
      return `${transaction.amount.chf} CHF`;
    } else if (transaction.amount.eur && transaction.amount.eur > 0) {
      return `${transaction.amount.eur} EUR`;
    }
    
    return "N/A";
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {transaction.transactionId || transaction._id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">{getUserName()}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{getCustomerNumber()}</td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.details || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.date
          ? new Date(transaction.date).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {getAmount()}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.method || "N/A"}
      </td>
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            transaction.status
          )}`}
        >
          {transaction.status
            ? transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)
            : "Unknown"}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        <button 
          onClick={() => onViewDetails(transaction)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (transactionId) => {
    try {
      // Update the transaction status to 'canceled'
      await updateTransaction(transactionId, { status: "canceled" });
      
      // Update the local state
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, status: "canceled" }
            : transaction
        )
      );
      
      // Also update the selected transaction if it's open in the modal
      if (selectedTransaction && selectedTransaction._id === transactionId) {
        setSelectedTransaction((prev) => ({ ...prev, status: "canceled" }));
      }
      
      return true;
    } catch (error) {
      console.error("Error canceling booking:", error);
      setError("Failed to cancel booking. Please try again.");
      return false;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionId = transaction.transactionId || transaction._id || "";
    const customer =
      typeof transaction.user === "object"
        ? `${transaction.user.firstName || ""} ${
            transaction.user.lastName || ""
          } ${transaction.user.username || ""}`
        : "";
    const customerNumber = transaction.user?.customerNumber || "";
    const details = transaction.details || "";
    
    const searchTerms = [transactionId, customer, customerNumber, details]
      .join(" ")
      .toLowerCase();
    
    return searchTerms.includes(searchQuery.toLowerCase());
  });

  // Handle export to CSV/Excel
  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredTransactions.map((transaction) => {
      const userName =
        typeof transaction.user === "object"
          ? `${transaction.user.firstName || ""} ${
              transaction.user.lastName || ""
            }`.trim() || transaction.user.username
          : "Unknown User";
      
      const customerNumber = transaction.user?.customerNumber || "N/A";
      
      let amount = "N/A";
      let currency = "";
      if (transaction.amount) {
        if (transaction.amount.chf && transaction.amount.chf > 0) {
          amount = transaction.amount.chf;
          currency = "CHF";
        } else if (transaction.amount.eur && transaction.amount.eur > 0) {
          amount = transaction.amount.eur;
          currency = "EUR";
        }
      }
      
      return {
        "Transaction ID": transaction.transactionId || transaction._id,
        Customer: userName,
        "Customer Number": customerNumber,
        Details: transaction.details || "N/A",
        Date: transaction.date
          ? new Date(transaction.date).toLocaleDateString()
          : "N/A",
        Amount: amount,
        Currency: currency,
        Method: transaction.method || "N/A",
        Status: transaction.status
          ? transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1)
          : "Unknown",
      };
    });
    
    exportToExcel(exportData, "transactions-export");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Transactions & Payments
        </h1>
        <p className="text-gray-600">
          View and manage all transactions on the platform
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Filter</span>
          </button> */}
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading || filteredTransactions.length === 0}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <SkeletonTable />}

      {/* Transactions Table */}
      {!loading && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionRow 
                      key={transaction._id} 
                      transaction={transaction} 
                      onViewDetails={(transaction) => {
                        setSelectedTransaction(transaction);
                        setDetailModalOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                of <span className="font-medium">{transactions.length}</span>{" "}
                transactions
              </div>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default Transactions;
