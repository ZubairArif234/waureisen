import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Dog } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import i1 from '../../assets/i1.png';
import i2 from '../../assets/i2.png';
import i3 from '../../assets/i3.png';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/accommodation/${trip.id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 h-48 md:h-auto relative">
          <img 
            src={trip.image} 
            alt={trip.location}
            className="w-full h-full object-cover"
          />
          {trip.status === 'cancelled' && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Cancelled
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 flex-1">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {trip.location}
            </h3>
            
            <div className="space-y-3 mb-4 flex-grow">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{trip.dates}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{trip.address}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Dog className="w-5 h-5" />
                <span>{trip.guests}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              <div className="text-gray-600">
                Host: <span className="font-medium">{trip.host}</span>
              </div>
              <div className="text-brand font-medium">
                {trip.status === 'upcoming' ? 'Upcoming' : 
                 trip.status === 'completed' ? 'Completed' : 
                 'Cancelled'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoTrips = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
      No trips booked...yet!
    </h2>
    <p className="text-gray-600 mb-8">
      Time to dust off your bags and start planning your next adventure.
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
    >
      Start searching
    </button>
  </div>
);

const TripsPage = () => {
  // Dummy data - in real app this would come from an API
  const [trips] = useState([
    {
      id: '1',
      image: i1,
      location: 'Cozy Cabin in Swiss Alps',
      dates: 'Mar 25-30, 2025',
      address: 'Grindelwald, Switzerland',
      guests: '2 people, 1 dog',
      host: 'Waureisen',
      status: 'upcoming'
    },
    {
      id: '2',
      image: i2,
      location: 'Beachfront Villa',
      dates: 'Apr 15-20, 2025',
      address: 'Costa Brava, Spain',
      guests: '4 people, 2 dogs',
      host: 'Interhome',
      status: 'upcoming'
    },
    {
      id: '3',
      image: i3,
      location: 'Mountain View Chalet',
      dates: 'Feb 10-15, 2025',
      address: 'Zermatt, Switzerland',
      guests: '2 people, 1 dog',
      host: 'Waureisen',
      status: 'completed'
    }
  ]);

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const pastTrips = trips.filter(trip => trip.status === 'completed');

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-12 mt-20">
      <div className="mb-8">
  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
    Your trips
  </h1>
  <div className="space-y-3">
    <p className="text-gray-600">
      View and manage your upcoming and past trips
    </p>
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <span>Can't find your reservation here?</span>
      <a 
        href="mailto:hallo@waureisen.com"
        className="text-[#B4A481] hover:underline font-medium"
      >
        Contact us via email hallo@waureisen.com
      </a>
    </div>
  </div>
</div>

        {trips.length === 0 ? (
          <NoTrips />
        ) : (
          <div className="space-y-12">
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upcoming trips
                </h2>
                <div className="space-y-4">
                  {upcomingTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Past trips
                </h2>
                <div className="space-y-4">
                  {pastTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Center Link */}
        <div className="mt-8 text-gray-600">
          Can't find your reservation here?{' '}
          <button className="text-brand hover:underline">
            Visit the Help Center
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripsPage;