import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, TrendingUp, Users, Calendar, Briefcase, DollarSign, Award, Eye, CreditCard, MessageSquare } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import i3 from '../../assets/magazine.jpg';
import { useLanguage } from '../../utils/LanguageContext';
import { 
  getProviderDashboardStats, 
  getProviderBookings,
  getProviderListings 
} from '../../utils/apiClient';

// StatCard Component
const StatCard = ({ icon: Icon, title, value, change, changeType }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-brand/10">
          <Icon className="w-6 h-6 text-brand" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-xs font-medium ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : changeType === 'negative' ? (
              <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
            ) : null}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{value}</h3>
      <p className="mt-1 text-sm text-gray-500">{title}</p>
    </div>
  );
};

// Chart component mock
const ChartComponent = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Chart visualization will appear here</p>
      </div>
    </div>
  );
};

// ImageGrid Component from listings page
const ImageGrid = ({ images, title, subtitle, link }) => (
  <div className="flex flex-col items-center w-full md:w-auto">
    <Link 
      to={link}
      className="w-full max-w-[300px] md:w-auto group" 
    >
      <div className="relative mb-4">
        <div className={`grid grid-cols-2 gap-1 p-2 bg-white rounded-xl shadow-md mx-auto ${
          images.length > 1 
            ? 'w-full md:w-[260px]' 
            : 'w-full md:w-[260px]'
        }`}>
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden ${
                images.length === 1 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className={`w-full object-cover scale-100 transition-transform duration-300 ${
                  images.length > 1 
                    ? 'h-[140px] md:h-[118px] rounded-lg group-hover:scale-110' 
                    : 'h-[280px] md:h-[240px] rounded-lg group-hover:scale-110'
                }`}
              />
            </div>
          ))}
        </div>
        <div className={`absolute inset-2 bg-gradient-to-b from-transparent to-black/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          images.length > 1 ? 'w-[244px]' : 'w-[244px]'
        }`} />
      </div>
      <div className="text-center md:text-left w-full">
        <h3 className="text-xl md:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </Link>
  </div>
);

// Recent Booking Row component
const BookingRow = ({ booking, onViewBooking }) => {
  const { t } = useLanguage();
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">#{booking.id}</div>
        <div className="text-xs text-gray-500">{booking.date}</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{booking.guest}</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{booking.property}</div>
        <div className="text-xs text-gray-500">{booking.duration} {t('nights')}</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-sm text-brand font-medium">{booking.amount} CHF</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <button 
          onClick={() => onViewBooking(booking.id)}
          className="text-brand hover:text-brand-dark font-medium text-sm"
        >
          {t('view_details')}
        </button>
      </td>
    </tr>
  );
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();
  
  // State for API data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [listings, setListings] = useState([]);
  
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard stats
        const stats = await getProviderDashboardStats(timeRange);
        setDashboardStats(stats);
        
        // Fetch recent bookings
        const bookingsData = await getProviderBookings('all', 5);
        
        // Transform booking data structure to match component expectations
        const formattedBookings = bookingsData.map(booking => ({
          id: booking.id || booking._id,
          date: new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          guest: booking.user?.username || booking.user?.firstName + ' ' + booking.user?.lastName,
          property: booking.listing?.title,
          duration: Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)),
          amount: booking.totalPrice
        }));
        
        setRecentBookings(formattedBookings);
        
        // Fetch listings count
        const listingsData = await getProviderListings();
        setListings(listingsData);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);
  
  // Mock data for listings grid (still using mock images until file upload integration)
  const yourListings = {
    images: [i1, i2, s1, s2],
    title: t('your_listings'),
    subtitle: listings.length > 0 ? `${listings.length} ${t('properties')}` : t('properties_count'),
    link: "/provider/your-listings"
  };

  const bookings = {
    images: [i3],
    title: t('bookings'),
    subtitle: t('view_all_bookings'),
    link: "/provider/bookings"
  };
  
  const handleViewBooking = (bookingId) => {
    navigate(`/provider/bookings?id=${bookingId}`);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">{t('provider_dashboard')}</h1>
            </div>
          </div>
          
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 ml-3 text-lg">{t('loading_dashboard')}</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">{t('provider_dashboard')}</h1>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('retry')}
            </button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Extract values from dashboardStats or use fallbacks
  const totalBookings = dashboardStats?.totalBookings?.current || '0';
  const bookingChange = dashboardStats?.totalBookings?.percentChange || 0;
  const totalRevenue = dashboardStats?.totalRevenue?.current 
    ? `${dashboardStats.totalRevenue.current} ${dashboardStats.totalRevenue.currency || 'CHF'}` 
    : '0 CHF';
  const revenueChange = dashboardStats?.totalRevenue?.percentChange || 0;
  const occupancyRate = dashboardStats?.occupancyRate?.current ? `${dashboardStats.occupancyRate.current}%` : '0%';
  const occupancyChange = dashboardStats?.occupancyRate?.percentChange || 0;
  const avgNights = dashboardStats?.avgStayLength?.current || '0';
  const nightsChange = dashboardStats?.avgStayLength?.percentChange || 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{t('provider_dashboard')}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
            >
              <option value="week">{t('last_7_days')}</option>
              <option value="month">{t('last_30_days')}</option>
              <option value="year">{t('last_12_months')}</option>
            </select>
          </div>
        </div>
        
        {/* Main Category Cards */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-8">
          <ImageGrid {...yourListings} />
          <ImageGrid {...bookings} />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={Briefcase}
            title={t('total_bookings')}
            value={totalBookings}
            change={bookingChange}
            changeType={bookingChange >= 0 ? "positive" : "negative"}
          />
          <StatCard
            icon={DollarSign}
            title={t('total_revenue')}
            value={totalRevenue}
            change={revenueChange}
            changeType={revenueChange >= 0 ? "positive" : "negative"}
          />
          <StatCard
            icon={Award}
            title={t('occupancy_rate')}
            value={occupancyRate}
            change={occupancyChange}
            changeType={occupancyChange >= 0 ? "positive" : "negative"}
          />
          <StatCard
            icon={Calendar}
            title={t('avg_length_stay')}
            value={avgNights}
            change={nightsChange}
            changeType={nightsChange >= 0 ? "positive" : "negative"}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartComponent 
            title={t('revenue_overview')}
            description={t('revenue_analysis')}
          />
          <ChartComponent 
            title={t('booking_trends')}
            description={t('booking_analysis')}
          />
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">{t('recent_bookings')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('booking_id')}
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('guest')}
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('property')}
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('amount')}
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <BookingRow 
                      key={booking.id} 
                      booking={booking} 
                      onViewBooking={handleViewBooking}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 text-center text-gray-500">
                      {t('no_bookings_yet')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate('/provider/bookings')}
              className="text-brand hover:text-brand-dark font-medium"
            >
              {t('view_all_bookings')} →
            </button>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('quick_actions')}</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/provider/create-listing')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('create_listing')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/your-listings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('view_listings')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/bookings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('manage_bookings')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/earnings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('view_earnings')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/analytics')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BarChart2 className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('analytics')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/calendar')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('calendar')}</span>
            </button>
            <button
              onClick={() => navigate('/provider/messages')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-brand" />
              <span className="text-gray-700">{t('messages')}</span>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderDashboard;