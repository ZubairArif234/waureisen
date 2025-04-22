import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Filter, Download, Eye, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import { getProviderDashboardStats, getProviderStats } from '../../api/providerAPI';
import { useLanguage } from '../../utils/LanguageContext';
import AnalyticsChart from '../../components/Provider/AnalyticsChart';


const emptyAnalyticsData = {
  performance: {
    totalBookings: { current: 0, previous: 0 },
    totalRevenue: { current: 0, previous: 0 },
    occupancyRate: { current: 0, previous: 0 },
    averageNightlyRate: { current: 0, previous: 0 }
  },
  charts: {
    labels: [],
    revenue: [],
    bookings: []
  },
  insights: [], 
  listings: []  
};


const ChartMock = ({ type, title, description, data }) => {
  // Sample data visualization (just a mockup)
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      <div className="h-64 w-full bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4">
        {/* Simplified chart visualization */}
        <div className="w-full h-48 relative mt-auto">
          <div className="w-full h-full flex items-end justify-between gap-1">
            {data.map((value, index) => {
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t ${type === 'revenue' ? 'bg-brand/80' : 'bg-blue-500/70'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
                </div>
              );
            })}
          </div>
          {/* Y-axis markers */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
            <span>{maxValue}</span>
            <span>{Math.round((maxValue + minValue) / 2)}</span>
            <span>{minValue}</span>
          </div>
        </div>
        
        <div className="w-full flex justify-between text-xs text-gray-400 mt-2">
          <span>Week 1</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
};

// Performance Card Component
const PerformanceCard = ({ title, current, previous, isPercentage, isCurrency }) => {
  const { t } = useLanguage();
  const changePercent = ((current - previous) / previous) * 100;
  const isPositive = current >= previous;
  
  const formatValue = (value) => {
    if (isPercentage) return `${value}%`;
    if (isCurrency) return `${value} CHF`;
    return value;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-500">{title}</h3>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span>{changePercent.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="text-2xl font-semibold text-gray-900">
          {formatValue(current)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {t('previous')}: {formatValue(previous)}
        </div>
      </div>
    </div>
  );
};

// Listing Performance Row
const ListingPerformanceRow = ({ listing, onViewDetails }) => {
  const { t } = useLanguage();
  const bookingTrend = listing.bookingChange > 0 ? 'positive' : listing.bookingChange < 0 ? 'negative' : 'neutral';
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{listing.title}</div>
            <div className="text-sm text-gray-500">{listing.location}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-brand">{listing.occupancyRate}%</div>
        <div className="text-xs text-gray-500">{listing.pricing} CHF/night</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{listing.bookings}</div>
        <div className={`flex items-center text-xs ${
          bookingTrend === 'positive' ? 'text-green-600' :
          bookingTrend === 'negative' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {bookingTrend === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
          {bookingTrend === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
          <span>{listing.bookingChange > 0 ? '+' : ''}{listing.bookingChange}%</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{listing.revenue} CHF</div>
        <div className="text-xs text-gray-500">Last 30 days</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <button
          onClick={() => onViewDetails(listing.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{t('details')}</span>
        </button>
      </td>
    </tr>
  );
};

const ProviderAnalytics = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(emptyAnalyticsData);
  const [selectedCompareMode, setSelectedCompareMode] = useState('previous');
  const [error, setError] = useState(null);
  
  
    useEffect(() => {
      const fetchAnalyticsData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const data = await getProviderStats(timeRange);
          setAnalyticsData(data);
        } catch (err) {
          console.error('Error fetching analytics data:', err);
          setError('Failed to load analytics data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAnalyticsData();
    }, [timeRange]);
  
  const handleViewListingDetails = (listingId) => {
    navigate(`/provider/analytics/listing/${listingId}`);
  };
  
  const handleExportData = () => {
    alert('Analytics data would be exported as CSV or PDF in a real implementation');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('analytics')}</h1>
          </div>
          
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">{t('loading_analytics')}</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('analytics')}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              >
                <option value="week">{t('last_7_days')}</option>
                <option value="month">{t('last_30_days')}</option>
                <option value="quarter">{t('last_90_days')}</option>
                <option value="year">{t('last_12_months')}</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCompareMode}
                onChange={(e) => setSelectedCompareMode(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
              >
          <option value="previous">{t('vs_previous_period')}</option>
          <option value="year">{t('vs_last_year')}</option>
              </select>
            </div>
            
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-500" />
              <span>{t('export')}</span>
            </button>
          </div>
        </div>
        
        {/* Performance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <PerformanceCard
            title={t('total_bookings')}
            current={analyticsData.performance.totalBookings.current}
            previous={analyticsData.performance.totalBookings.previous}
          />
          <PerformanceCard
            title={t('occupancy_rate')}
            current={analyticsData.performance.occupancyRate.current}
            previous={analyticsData.performance.occupancyRate.previous}
            isPercentage={true}
          />
          <PerformanceCard
            title={t('average_nightly_rate')}
            current={analyticsData.performance.averageNightlyRate.current}
            previous={analyticsData.performance.averageNightlyRate.previous}
            isCurrency={true}
          />
          <PerformanceCard
            title={t('total_revenue')}
            current={analyticsData.performance.totalRevenue.current}
            previous={analyticsData.performance.totalRevenue.previous}
            isCurrency={true}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart 
          data={analyticsData?.charts || { labels: [], revenue: [] }}
          title={t('revenue_trends')}
          dataKey="revenue"
          loading={isLoading}
            color="#10B981" /* Green color for revenue */
            tooltipFormatter={(value) => [`${Math.round(value)} CHF`, t('revenue')]}
          />
          <AnalyticsChart 
            data={analyticsData?.charts}
            title={t('booking_trends')}
            description={t('booking_analysis')}
            dataKey="bookings"
            loading={isLoading}
            color="#3B82F6" /* Blue color for bookings */
          />
        </div>
        
        {/* Insights */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">{t('insights_recommendations')}</h2>
          </div>
          <div className="p-6 space-y-4">
          {analyticsData?.insights?.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg flex items-start gap-3 ${
                insight.type === 'opportunity' 
                  ? 'bg-green-50 border border-green-100' 
                  : insight.type === 'warning'
                  ? 'bg-yellow-50 border border-yellow-100'
                  : 'bg-blue-50 border border-blue-100'
              }`}
              >
                <div className={`p-1.5 rounded-full ${
                  insight.type === 'opportunity' 
                    ? 'bg-green-100' 
                    : insight.type === 'warning'
                    ? 'bg-yellow-100'
                    : 'bg-blue-100'
                }`}>
                  {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  {insight.type === 'tip' && <Eye className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                <h3 className={`text-sm font-medium ${
                  insight.type === 'opportunity' 
                    ? 'text-green-800' 
                    : insight.type === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}>
                  {insight.type === 'opportunity' ? t('opportunity') : insight.type === 'warning' ? t('warning') : t('tip')}
                </h3>
                  <p className={`mt-1 text-sm ${
                    insight.type === 'opportunity' 
                      ? 'text-green-700' 
                      : insight.type === 'warning'
                      ? 'text-yellow-700'
                      : 'text-blue-700'
                  }`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Listing Performance */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">{t('listing_performance')}</h2>

          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('listing')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('occupancy')}

                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('bookings')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('revenue')}

                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData?.listings?.length > 0 ? (
                  analyticsData.listings.map((listing) => (
                    <ListingPerformanceRow 
                      key={listing.id} 
                      listing={listing} 
                      onViewDetails={handleViewListingDetails}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      {isLoading ? t('loading_data') : t('no_listings_found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderAnalytics;