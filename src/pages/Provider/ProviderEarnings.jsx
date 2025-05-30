import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Calendar, CreditCard, DollarSign, Building2, ChevronsUpDown } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { useLanguage } from '../../utils/LanguageContext';
import { getProviderEarnings, getProviderTransactions } from '../../api/providerAPI';
import { getMyProviderBooking } from '../../api/bookingApi';
import moment from 'moment';
import { changeMetaData } from '../../utils/extra';

// Helper function to calculate net amount after deductions
const calculateNetAmount = (grossAmount) => {
  // Deduct 2.9% first
  const afterFirstDeduction = grossAmount * (1 - 0.029);
  // Then deduct 10% from the remaining amount
  const finalAmount = afterFirstDeduction * (1 - 0.10);
  return finalAmount;
};

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
const TransactionsTable = ({booking, transactions, onDownloadInvoice, onGenerateProviderInvoice }) => {
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
          {booking?.map((transaction,i) => {
            // Calculate net amount after deductions
            const netAmount = calculateNetAmount(transaction?.totalPrice || 0);
            
            // Check if booking is cleared (check-in date has passed or is today)
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const checkInDate = new Date(transaction?.checkInDate);
            checkInDate.setHours(0, 0, 0, 0);
            const isCleared = checkInDate <= currentDate;
            
            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {moment(transaction?.createdAt).format("MMM DD , YY")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction?.listing?.title}</div>
                  <div className="text-xs text-gray-500">
                    {isCleared ? 'Cleared' : 'Pending'}
                    {isCleared && (
                      <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">#{transaction.bookingId}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    isCleared ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {isCleared ? '+' : '~'}{netAmount.toFixed(0)} {transaction?.currency}
                  </div>
                  <div className="text-xs text-gray-400">
                    Gross: {transaction?.totalPrice} {transaction?.currency}
                  </div>
                  <div className="text-xs text-gray-500">
                    Fees: -{(transaction?.totalPrice * 0.029).toFixed(0)} (2.9%) + -{((transaction?.totalPrice * (1 - 0.029)) * 0.10).toFixed(0)} (10%)
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {isCleared ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => onGenerateProviderInvoice(transaction)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>{t('provider_invoice')}</span>
                      </button>
                      
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">{t('invoice_available_after_checkin')}</span>
                  )}
                </td>
              </tr>
            );
          })}
          
          {booking?.length === 0 && (
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
  const { t } = useLanguage();
  
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
    useEffect(() => {
        changeMetaData(`Earning - Provider`);
    }, []);
    
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [billings, setBillings] = useState([]);
  const [billingsLoading, setBillingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [earningsSummary, setEarningsSummary] = useState({
    totalEarnings: '0 CHF',
    pendingPayouts: '0 CHF',
    nextPayout: '0 CHF',
    nextPayoutDate: 'N/A'
  });
  
  // Mock data
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

  const handleGetMyBookings = async () => {
    setBillingsLoading(true);
    const res = await getMyProviderBooking();
    console.log(res, "kuch hai");
    setBillings(res);
    setBillingsLoading(false);
  };

  const handleGenerateProviderInvoice = async (transaction) => {
    try {
      // Calculate the breakdown for the invoice
      const grossAmount = transaction?.totalPrice || 0;
      const firstDeduction = grossAmount * 0.029; // 2.9%
      const afterFirstDeduction = grossAmount - firstDeduction;
      const secondDeduction = afterFirstDeduction * 0.10; // 10%
      const netAmount = afterFirstDeduction - secondDeduction;

      // Create invoice data for the provider
      const invoiceData = {
        bookingId: transaction.bookingId,
        providerId: transaction.providerId,
        listingTitle: transaction?.listing?.title,
        checkInDate: transaction?.checkInDate,
        checkOutDate: transaction?.checkOutDate,
        customerName: transaction?.customerName || 'Customer',
        grossAmount: grossAmount,
        platformFee: firstDeduction,
        serviceFee: secondDeduction,
        netAmount: netAmount,
        currency: transaction?.currency,
        invoiceDate: new Date().toISOString(),
        invoiceNumber: `INV-${transaction.bookingId}-${Date.now()}`
      };

      // Generate and download the invoice
      generateAndDownloadInvoice(invoiceData);
      
    } catch (error) {
      console.error('Error generating provider invoice:', error);
      alert('Error generating invoice. Please try again.');
    }
  };

  const generateAndDownloadInvoice = (invoiceData) => {
    // Create a new window with the invoice content
    const invoiceWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!invoiceWindow) {
      alert('Please allow popups to download the invoice');
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Provider Invoice - ${invoiceData.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: white;
          }
          .invoice-header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #b4a481;
            padding-bottom: 20px;
          }
          .invoice-header h1 { 
            color: #b4a481; 
            font-size: 28px; 
            margin-bottom: 10px; 
          }
          .invoice-number { 
            font-size: 16px; 
            color: #666; 
            font-weight: bold;
          }
          .invoice-details { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 30px; 
            margin-bottom: 30px; 
          }
          .detail-section h3 { 
            color: #b4a481; 
            margin-bottom: 15px; 
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .detail-item { 
            margin-bottom: 8px; 
            display: flex;
            justify-content: space-between;
          }
          .detail-label { 
            font-weight: bold; 
            color: #555; 
          }
          .detail-value { 
            color: #333; 
          }
          .breakdown-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .breakdown-table th { 
            background: #b4a481; 
            color: white; 
            padding: 15px; 
            text-align: left; 
            font-weight: bold;
          }
          .breakdown-table td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #eee; 
          }
          .breakdown-table tr:nth-child(even) { 
            background: #f8f9fa; 
          }
          .breakdown-table tr.total-row { 
            background: #e3f2fd; 
            font-weight: bold; 
            font-size: 16px;
          }
          .breakdown-table tr.total-row td { 
            border-top: 2px solid #b4a481;
          }
          .positive-amount { color: #28a745; }
          .negative-amount { color: #dc3545; }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .print-button {
            background: #b4a481;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px 0;
          }
          .print-button:hover {
            background: #0056b3;
          }
          @media print {
            .print-button { display: none; }
            body { margin: 0; padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>Provider Payment Invoice</h1>
          <div class="invoice-number">Invoice #: ${invoiceData.invoiceNumber}</div>
        </div>
        
        <div class="invoice-details">
          <div class="detail-section">
            <h3>Booking Information</h3>
            <div class="detail-item">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">#${invoiceData.bookingId}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Property:</span>
              <span class="detail-value">${invoiceData.listingTitle}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Check-in:</span>
              <span class="detail-value">${new Date(invoiceData.checkInDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Check-out:</span>
              <span class="detail-value">${new Date(invoiceData.checkOutDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Invoice Details</h3>
            <div class="detail-item">
              <span class="detail-label">Invoice Date:</span>
              <span class="detail-value">${new Date(invoiceData.invoiceDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Currency:</span>
              <span class="detail-value">${invoiceData.currency}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span class="detail-value">Paid</span>
            </div>
          </div>
        </div>

        <table class="breakdown-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Booking Amount</td>
              <td style="text-align: right;" class="positive-amount">
                ${invoiceData.grossAmount.toFixed(0)} ${invoiceData.currency}
              </td>
            </tr>
            <tr>
              <td>Platform Fee (2.9%)</td>
              <td style="text-align: right;" class="negative-amount">
                -${invoiceData.platformFee.toFixed(0)} ${invoiceData.currency}
              </td>
            </tr>
            <tr>
              <td>Service Fee (10% of remaining)</td>
              <td style="text-align: right;" class="negative-amount">
                -${invoiceData.serviceFee.toFixed(0)} ${invoiceData.currency}
              </td>
            </tr>
            <tr class="total-row">
              <td><strong>Net Amount Payable to Provider</strong></td>
              <td style="text-align: right;" class="positive-amount">
                <strong>${invoiceData.netAmount.toFixed(0)} ${invoiceData.currency}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: center;">
          <button class="print-button" onclick="window.print()">Print Invoice</button>
          <button class="print-button" onclick="window.close()" style="background: #6c757d;">Close</button>
        </div>

        <div class="footer">
          <p>This invoice represents the net amount payable to the provider after platform fees.</p>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;

    // Write the content to the new window
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    
    // Focus the new window
    invoiceWindow.focus();
  };

  useEffect(() => {
    handleGetMyBookings();
  }, []);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        // Only fetch if the API functions exist and are working
        if (typeof getProviderEarnings === 'function') {
          const earningsData = await getProviderEarnings(timeRange);
          setEarningsSummary(earningsData);
        }
        
        if (typeof getProviderTransactions === 'function') {
          const transactionsData = await getProviderTransactions({ 
            type: transactionType !== 'all' ? transactionType : undefined
          });
          setTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        // Don't break the component if API calls fail
      }
    };
    
    fetchEarningsData();
  }, [timeRange, transactionType]);
  
  // Calculate total earnings by currency (for bookings that have started or are current)
  const calculateTotalEarningsByCurrency = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const completedBookings = billings?.filter(item => {
      const checkInDate = new Date(item?.checkInDate);
      checkInDate.setHours(0, 0, 0, 0);
      // Include bookings where check-in date has passed or is today
      return checkInDate <= currentDate;
    }) || [];
    
    const earningsByCurrency = {};
    
    completedBookings.forEach(item => {
      const currency = item?.currency || 'USD';
      const grossAmount = item?.totalPrice || 0;
      const netAmount = calculateNetAmount(grossAmount);
      
      if (earningsByCurrency[currency]) {
        earningsByCurrency[currency] += netAmount;
      } else {
        earningsByCurrency[currency] = netAmount;
      }
    });
    
    return earningsByCurrency;
  };

  // Calculate pending balance by currency (for future bookings only)
  const calculatePendingBalanceByCurrency = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const futureBookings = billings?.filter(item => {
      const checkInDate = new Date(item?.checkInDate);
      checkInDate.setHours(0, 0, 0, 0);
      // Only include bookings where check-in date is in the future
      return checkInDate > currentDate;
    }) || [];
    
    const pendingByCurrency = {};
    
    futureBookings.forEach(item => {
      const currency = item?.currency || 'USD';
      const grossAmount = item?.totalPrice || 0;
      const netAmount = calculateNetAmount(grossAmount);
      
      if (pendingByCurrency[currency]) {
        pendingByCurrency[currency] += netAmount;
      } else {
        pendingByCurrency[currency] = netAmount;
      }
    });
    
    return pendingByCurrency;
  };

  // Format currency amounts for display
  const formatCurrencyAmounts = (currencyAmounts) => {
    const currencies = Object.keys(currencyAmounts);
    if (currencies.length === 0) return '0.00';
    
    return currencies
      .map(currency => `${currencyAmounts[currency].toFixed(0)} ${currency}`)
      .join(' + ');
  };
  
  // Filter transactions based on time range and type
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = transactionType === 'all' ? true : transaction.type === transactionType;
    return typeMatch;
  });
  
  const handleDownloadInvoice = (transactionId) => {
    console.log(`Downloading invoice for transaction ${transactionId}`);
  };
  
  const handleEditPaymentMethod = (paymentMethodId) => {
    console.log(`Editing payment method ${paymentMethodId}`);
  };
  
  const handleDeletePaymentMethod = (paymentMethodId) => {
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
            amount={formatCurrencyAmounts(calculateTotalEarningsByCurrency())}
            subtitle={t('all_time')}
          />
          <EarningsSummaryCard
            icon={CreditCard}
            title={t('pending_balance')}
            amount={formatCurrencyAmounts(calculatePendingBalanceByCurrency())}
            subtitle={t('to_be_paid_out')}
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
        </div>
        
        {activeTab === 'transactions' && (
          <>
            <TransactionsTable 
              booking={billings}
              transactions={filteredTransactions} 
              onDownloadInvoice={handleDownloadInvoice}
              onGenerateProviderInvoice={handleGenerateProviderInvoice}
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
    </div>
  );
};

export default ProviderEarnings;

