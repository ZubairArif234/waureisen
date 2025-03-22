import React, { useState } from 'react';
import { Search, Eye, Filter, Sliders, Download, X } from 'lucide-react';

const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
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
              <span className="font-medium text-brand">{transaction.amount} CHF</span>
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
              <span className="text-gray-600">Listing:</span>
              <span>{transaction.listing}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Source:</span>
              <span>{transaction.source}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Confirmed
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const TransactionRow = ({ transaction, onViewDetails }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {transaction.id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.customer}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.listing}
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.date}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">
        {transaction.amount} CHF
      </td>
      <td className="px-4 py-4 text-sm text-gray-700">
        {transaction.source}
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
      listing: 'Mountain View Chalet',
      date: '2023-03-15',
      amount: '750',
      source: 'Platform'
    },
    {
      id: '#TRX-2023-002',
      customer: 'Jane Smith',
      listing: 'Beachfront Villa',
      date: '2023-03-18',
      amount: '1,050',
      source: 'Platform'
    },
    {
      id: '#TRX-2023-003',
      customer: 'Robert Brown',
      listing: 'Lake House',
      date: '2023-03-20',
      amount: '1,200',
      source: 'API'
    },
    {
      id: '#TRX-2023-004',
      customer: 'Emily Johnson',
      listing: 'Forest Cabin',
      date: '2023-03-22',
      amount: '850',
      source: 'Platform'
    },
    {
      id: '#TRX-2023-005',
      customer: 'Michael Wilson',
      listing: 'City Apartment',
      date: '2023-03-25',
      amount: '550',
      source: 'API'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.listing.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Filter</span>
          </button>
          
          {/* <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Export</span>
          </button> */}
        </div>
      </div>

      {/* Transactions Table (Desktop) */}
      <div className="hidden md:block bg-white border rounded-lg shadow-sm overflow-hidden">
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <TransactionRow 
                    key={index} 
                    transaction={transaction} 
                    onViewDetails={(transaction) => {
                      setSelectedTransaction(transaction);
                      setDetailModalOpen(true);
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile Transaction Cards */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.id}</h3>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="font-medium text-brand">
                  {transaction.amount} CHF
                </div>
              </div>
              
              <div className="space-y-2 pb-3 border-b mb-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Customer:</span>
                  <span className="text-sm text-gray-900">{transaction.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Listing:</span>
                  <span className="text-sm text-gray-900">{transaction.listing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Source:</span>
                  <span className="text-sm text-gray-900">{transaction.source}</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setDetailModalOpen(true);
                  }}
                  className="text-brand hover:text-brand/80 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
            No transactions found
          </div>
        )}
        
        {/* Mobile Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length}
            </div>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border rounded text-xs text-gray-400 bg-gray-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
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
      
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Transactions;