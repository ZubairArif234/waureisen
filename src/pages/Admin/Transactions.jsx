import React, { useState } from 'react';
import { Search, Eye, Filter, X, Download } from 'lucide-react';

const TransactionDetailModal = ({ transaction, isOpen, onClose, onCancel }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel(transaction.id);
    setShowCancelConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
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
              <span className="font-medium">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-brand">
                {transaction.amount} {transaction.currency}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span>{transaction.date}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer:</span>
              <span>{transaction.customer}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Number:</span>
              <span>{transaction.customerNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Listing:</span>
              <span>{transaction.listing}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Source:</span>
              <span>{transaction.source}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            {transaction.status === 'paid' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
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
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCancelConfirm(false)} />
          <div className="bg-white rounded-lg p-6 w-96 relative z-10">
            <h4 className="text-lg font-medium mb-4">Cancel Booking</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Booking
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
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {transaction.id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.customer}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        #{transaction.customerNumber}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.listing}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.date}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {transaction.amount} {transaction.currency}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.source}
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(transaction.status)}`}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: '#TRX-2023-001',
      customer: 'John Doe',
      customerNumber: '238491',
      listing: 'Mountain View Chalet',
      date: '2023-03-15',
      amount: '750',
      currency: 'CHF',
      source: 'Platform',
      status: 'paid'
    },
    {
      id: '#TRX-2023-002',
      customer: 'Jane Smith',
      customerNumber: '238492',
      listing: 'Beachfront Villa',
      date: '2023-03-18',
      amount: '580',
      currency: 'EUR',
      source: 'Platform',
      status: 'paid'
    },
    {
      id: '#TRX-2023-003',
      customer: 'Robert Brown',
      customerNumber: '238493',
      listing: 'Lake House',
      date: '2023-03-20',
      amount: '1750',
      currency: 'CHF',
      source: 'API',
      status: 'refunded'
    },
    {
      id: '#TRX-2023-004',
      customer: 'Emily Johnson',
      customerNumber: '238494',
      listing: 'Forest Cabin',
      date: '2023-03-22',
      amount: '480',
      currency: 'EUR',
      source: 'Platform',
      status: 'paid'
    },
    {
      id: '#TRX-2023-005',
      customer: 'Michael Wilson',
      customerNumber: '238495',
      listing: 'City Apartment',
      date: '2023-03-25',
      amount: '1380',
      currency: 'EUR',
      source: 'API',
      status: 'cancelled'
    }
  ]);

  const handleCancelBooking = (transactionId) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, status: 'cancelled' }
          : transaction
      )
    );
    
    setSelectedTransaction(prev => 
      prev?.id === transactionId
        ? { ...prev, status: 'cancelled' }
        : prev
    );
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customerNumber.includes(searchQuery)
  );

  // Export data to Excel
  const exportToExcel = () => {
    // Create data for export
    const exportData = filteredTransactions.map(transaction => ({
      TransactionID: transaction.id,
      Customer: transaction.customer,
      CustomerNumber: transaction.customerNumber,
      Listing: transaction.listing,
      Date: transaction.date,
      Amount: transaction.amount,
      Currency: transaction.currency,
      Source: transaction.source,
      Status: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
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
    link.setAttribute('download', 'transactions-export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Filter</span>
          </button>
          
          {/* Export Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
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
                  Listing
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
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
                    key={transaction.id} 
                    transaction={transaction} 
                    onViewDetails={(transaction) => {
                      setSelectedTransaction(transaction);
                      setDetailModalOpen(true);
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
          </div>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
      
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