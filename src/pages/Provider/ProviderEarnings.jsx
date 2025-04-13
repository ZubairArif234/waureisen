import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Calendar, CreditCard, DollarSign, Building2, ChevronsUpDown } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';

// EarningsSummaryCard Component
const EarningsSummaryCard = ({ title, amount, subtitle, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${color || 'bg-brand/10'}`}>
          <Icon className={`w-6 h-6 ${color ? 'text-white' : 'text-brand'}`} />
        </div>
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-900">{amount}</h3>
      <p className="mt-1 text-sm text-gray-500">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};

// Transactions table component
const TransactionsTable = ({ transactions, onDownloadInvoice }) => {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedTransactions = () => {
    const sortableTransactions = [...transactions];
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  };

  const sortedTransactions = getSortedTransactions();

  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('date')}
            >
              <div className="flex items-center gap-1">
              {t('date')}
                {sortConfig.key === 'date' && (
                  <ChevronsUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('description')}
            >
              <div className="flex items-center gap-1">
              {t('description')}
                {sortConfig.key === 'description' && (
                  <ChevronsUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('booking')}
            >
              <div className="flex items-center gap-1">
              {t('booking')}
                {sortConfig.key === 'booking' && (
                  <ChevronsUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('amount')}
            >
              <div className="flex items-center gap-1">
              {t('amount')}
                {sortConfig.key === 'amount' && (
                  <ChevronsUpDown className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                )}
              </div>
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.date}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaction.description}</div>
                <div className="text-xs text-gray-500">{transaction.type}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">#{transaction.booking}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${
                  transaction.type === 'payout' ? 'text-green-600' : 'text-brand'
                }`}>
                  {transaction.type === 'payout' ? '-' : '+'}{transaction.amount} CHF
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                {transaction.hasInvoice && (
                  <button
                    onClick={() => onDownloadInvoice(transaction.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('invoice')}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
          
          {transactions.length === 0 && (
          <tr>
            <td colSpan="5" className="px-4 py-12 text-center">
              <p className="text-gray-500 text-lg mb-2">{t('no_transactions_found')}</p>
              <p className="text-gray-400 text-sm">
                {t('transactions_will_appear')}
              </p>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

// Payment Method Card
const PaymentMethodCard = ({ paymentMethod, isDefault, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          {paymentMethod.type === 'bank' ? (
            <Building2 className="w-8 h-8 text-gray-700" />
          ) : (
            <CreditCard className="w-8 h-8 text-gray-700" />
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {paymentMethod.name}
            </h3>
            <p className="text-sm text-gray-500">
              {paymentMethod.type === 'bank' 
                ? `IBAN: ${paymentMethod.details.iban.replace(/(.{4})/g, '$1 ').trim()}` 
                : `Card ending in ${paymentMethod.details.lastFour}`}
            </p>
            {isDefault && (
              <span className="mt-1 inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                {t('default_payment_method')}
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
                <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor" />
                <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor" />
              </svg>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white rounded-md shadow-lg z-50 w-32 py-1 border border-gray-200">
              {!isDefault && (
                <button
                  onClick={() => onSetDefault(paymentMethod.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('set_as_default')}
                </button>
              )}
              <button
                onClick={() => onEdit(paymentMethod.id)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                 {t('edit')}
              </button>
              <button
                onClick={() => onDelete(paymentMethod.id)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderEarnings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Mock data
  const earningsSummary = {
    totalEarnings: '9,230 CHF',
    pendingPayouts: '1,540 CHF',
    nextPayout: '1,540 CHF',
    nextPayoutDate: 'Apr 15, 2025'
  };
  
  const [transactions, setTransactions] = useState([
    { 
      id: 'T1001', 
      date: 'Apr 1, 2025', 
      description: 'Booking payment - Modern Studio', 
      booking: 'B1001', 
      amount: '480',
      type: 'earning',
      hasInvoice: true
    },
    { 
      id: 'T1002', 
      date: 'Mar 28, 2025', 
      description: 'Monthly payout', 
      booking: '-', 
      amount: '2,340',
      type: 'payout',
      hasInvoice: true
    },
    { 
      id: 'T1003', 
      date: 'Mar 25, 2025', 
      description: 'Booking payment - Mountain View Chalet', 
      booking: 'B1002', 
      amount: '690',
      type: 'earning',
      hasInvoice: true
    },
    { 
      id: 'T1004', 
      date: 'Mar 20, 2025', 
      description: 'Booking payment - Lakeside Apartment', 
      booking: 'B1003', 
      amount: '570',
      type: 'earning',
      hasInvoice: true
    },
    { 
      id: 'T1005', 
      date: 'Mar 15, 2025', 
      description: 'Booking payment - Cozy Cottage', 
      booking: 'B1004', 
      amount: '450',
      type: 'earning',
      hasInvoice: true
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'PM001',
      name: 'Bank Account',
      type: 'bank',
      details: {
        iban: 'CH9300762011623852957',
        bankName: 'Swiss National Bank'
      },
      isDefault: true
    },
    {
      id: 'PM002',
      name: 'Credit Card',
      type: 'card',
      details: {
        lastFour: '4567',
        expiry: '05/27',
        brand: 'Visa'
      },
      isDefault: false
    }
  ]);
  
  // Filter transactions based on time range and type
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = transactionType === 'all' ? true : transaction.type === transactionType;
    // For simplicity, we're not actually filtering by time here since it's mock data
    return typeMatch;
  });
  
  const handleDownloadInvoice = (transactionId) => {
    // In a real implementation, this would trigger a download
    console.log(`Downloading invoice for transaction ${transactionId}`);
  };
  
  const handleEditPaymentMethod = (paymentMethodId) => {
    // In a real implementation, this would navigate to edit page or open modal
    console.log(`Editing payment method ${paymentMethodId}`);
  };
  
  const handleDeletePaymentMethod = (paymentMethodId) => {
    // In a real implementation, this would prompt for confirmation
    console.log(`Deleting payment method ${paymentMethodId}`);
  };
  
  const handleSetDefaultPaymentMethod = (paymentMethodId) => {
    setPaymentMethods(prevMethods =>
      prevMethods.map(method => ({
        ...method,
        isDefault: method.id === paymentMethodId
      }))
    );
  };
  
  const handleAddPaymentMethod = () => {
    // In a real implementation, this would navigate to an add payment page or open modal
    console.log('Adding new payment method');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/provider/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">{t('earnings_payouts')}</h1>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <EarningsSummaryCard
        icon={DollarSign}
        title={t('total_earnings')}
        amount={earningsSummary.totalEarnings}
        subtitle={t('all_time')}
      />
      <EarningsSummaryCard
        icon={CreditCard}
        title={t('pending_balance')}
        amount={earningsSummary.pendingPayouts}
        subtitle={t('to_be_paid_out')}
      />
      <EarningsSummaryCard
        icon={Building2}
        title={t('next_payout')}
        amount={earningsSummary.nextPayout}
        subtitle={`${t('scheduled_for')} ${earningsSummary.nextPayoutDate}`}
        color="bg-brand text-white"
      />
        </div>
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'transactions'
                ? 'text-brand border-b-2 border-brand'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('transactions')}
          </button>
          <button
            onClick={() => setActiveTab('payment-methods')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'payment-methods'
                ? 'text-brand border-b-2 border-brand'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('payment_methods')}
          </button>
        </div>
        
        {activeTab === 'transactions' && (
          <>
            {/* Filters for Transactions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
              <option value="month">{t('last_30_days')}</option>
              <option value="quarter">{t('last_90_days')}</option>
              <option value="year">{t('last_12_months')}</option>
              <option value="all">{t('all_time')}</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
               <option value="all">{t('all_transactions')}</option>
              <option value="earning">{t('earnings_only')}</option>
              <option value="payout">{t('payouts_only')}</option>
                </select>
              </div>
            </div>
            
            {/* Transactions Table */}
            <TransactionsTable 
              transactions={filteredTransactions} 
              onDownloadInvoice={handleDownloadInvoice}
            />
          </>
        )}
        
        {activeTab === 'payment-methods' && (
          <>
            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {paymentMethods.map(method => (
                <PaymentMethodCard
                  key={method.id}
                  paymentMethod={method}
                  isDefault={method.isDefault}
                  onEdit={handleEditPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                  onSetDefault={handleSetDefaultPaymentMethod}
                />
              ))}
            </div>
            
            {/* Add Payment Method Button */}
            <button
              onClick={handleAddPaymentMethod}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            >
                {t('add_payment_method')}
            </button>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderEarnings;