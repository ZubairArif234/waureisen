import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import AccommodationCard from '../../components/HomeComponents/AccommodationCard';
import i3 from '../../assets/i3.png';
import i2 from '../../assets/i2.png';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';

const RecentlyViewed = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from an API/state
  const viewedListings = [
    {
      date: 'March 17, 2025',
      items: [
        {
          id: '1',
          image: i3,
          price: 230.00,
          location: "Room in Rio de Janeiro, Brazil",
          provider: "Waureisen",
          beds: 2,
          rating: 4.83
        },
        {
          id: '2',
          image: i2,
          price: 180.00,
          location: "Villa in Bali, Indonesia",
          provider: "Waureisen",
          beds: 3,
          rating: 4.95
        }
      ]
    },
    {
      date: 'March 16, 2025',
      items: [
        {
          id: '3',
          image: s1,
          price: 150.00,
          location: "Apartment in Paris, France",
          provider: "Interhome",
          beds: 1,
          rating: 4.75
        },
        {
          id: '4',
          image: s2,
          price: 320.00,
          location: "Chalet in Swiss Alps",
          provider: "Waureisen",
          beds: 4,
          rating: 5.0
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/wishlist')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">Recently viewed</h1>
        </div>

        {/* Listings by Date */}
        <div className="space-y-12">
          {viewedListings.map((dateGroup, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">
                {dateGroup.date}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dateGroup.items.map((listing) => (
                  <AccommodationCard
                    key={listing.id}
                    id={listing.id}
                    image={listing.image}
                    price={listing.price}
                    location={listing.location}
                    provider={listing.provider}
                    beds={listing.beds}
                    rating={listing.rating}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecentlyViewed;