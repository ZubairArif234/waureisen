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
        <div className="text-xs text-gray-500">{booking.duration} nights</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="text-sm text-brand font-medium">{booking.amount} CHF</div>
      </td>
      <td className="px-3 py-3 whitespace-nowrap">
        <button 
          onClick={() => onViewBooking(booking.id)}
          className="text-brand hover:text-brand-dark font-medium text-sm"
        >
          View details
        </button>
      </td>
    </tr>
  );
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [timeRange]);
  
  // Mock data for listings grid
  const yourListings = {
    images: [i1, i2, s1, s2],
    title: "Your Listings",
    subtitle: "4 properties",
    link: "/provider/your-listings"
  };

  const bookings = {
    images: [i3],
    title: "Bookings",
    subtitle: "View all bookings",
    link: "/provider/bookings"
  };
  
  // Mock data for stats
  const stats = {
    totalBookings: '47',
    bookingChange: 12,
    totalRevenue: '9,230 CHF',
    revenueChange: 8,
    occupancyRate: '78%',
    occupancyChange: -3,
    avgNights: '4.2',
    nightsChange: 5
  };
  
  const recentBookings = [
    { id: 'B1005', date: 'Apr 10, 2025', guest: 'Michael Brown', property: 'Mountain View Chalet', duration: 3, amount: '690' },
    { id: 'B1004', date: 'Apr 8, 2025', guest: 'Emma Wilson', property: 'Cozy Cottage', duration: 5, amount: '750' },
    { id: 'B1003', date: 'Apr 5, 2025', guest: 'Robert Smith', property: 'Lakeside Apartment', duration: 2, amount: '380' },
    { id: 'B1002', date: 'Apr 3, 2025', guest: 'Alice Johnson', property: 'Mountain View Chalet', duration: 3, amount: '690' },
    { id: 'B1001', date: 'Apr 1, 2025', guest: 'John Doe', property: 'Modern Studio', duration: 4, amount: '480' }
  ];
  
  const handleViewBooking = (bookingId) => {
    navigate(`/provider/bookings?id=${bookingId}`);
  };
  
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
            <h1 className="text-3xl font-semibold text-gray-900">Provider Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
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
            title="Total Bookings"
            value={stats.totalBookings}
            change={stats.bookingChange}
            changeType="positive"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            changeType="positive"
          />
          <StatCard
            icon={Award}
            title="Occupancy Rate"
            value={stats.occupancyRate}
            change={stats.occupancyChange}
            changeType="negative"
          />
          <StatCard
            icon={Calendar}
            title="Avg. Length of Stay"
            value={stats.avgNights}
            change={stats.nightsChange}
            changeType="positive"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartComponent 
            title="Revenue Overview"
            description="Revenue analysis based on your timeframe"
          />
          <ChartComponent 
            title="Booking Trends"
            description="Booking trends analysis over time"
          />
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <BookingRow 
                    key={booking.id} 
                    booking={booking} 
                    onViewBooking={handleViewBooking}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate('/provider/bookings')}
              className="text-brand hover:text-brand-dark font-medium"
            >
              View all bookings →
            </button>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/provider/create-listing')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-brand" />
              <span className="text-gray-700">Create Listing</span>
            </button>
            <button
              onClick={() => navigate('/provider/your-listings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5 text-brand" />
              <span className="text-gray-700">View Listings</span>
            </button>
            <button
              onClick={() => navigate('/provider/bookings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-brand" />
              <span className="text-gray-700">Manage Bookings</span>
            </button>
            <button
              onClick={() => navigate('/provider/earnings')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="w-5 h-5 text-brand" />
              <span className="text-gray-700">View Earnings</span>
            </button>
            <button
              onClick={() => navigate('/provider/analytics')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BarChart2 className="w-5 h-5 text-brand" />
              <span className="text-gray-700">Analytics</span>
            </button>
            <button
              onClick={() => navigate('/provider/calendar')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-brand" />
              <span className="text-gray-700">Calendar</span>
            </button>
            <button
              onClick={() => navigate('/provider/messages')}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-brand" />
              <span className="text-gray-700">Messages</span>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderDashboard;