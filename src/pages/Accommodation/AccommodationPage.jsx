import React, { useState } from 'react';
import Navbar from '../../components/Shared/Navbar';
import DateRangePicker from '../../components/HomeComponents/DateRangePicker';
import GuestSelector from '../../components/HomeComponents/GuestSelector';
import { Check, ChevronDown } from 'lucide-react';
import { Users, Home, DoorOpen, Bath, Dog, Utensils, Briefcase, Wind, Sparkles, Wifi, Waves, Tv } from 'lucide-react';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import s3 from '../../assets/s3.png';
import s4 from '../../assets/s4.png';
import s5 from '../../assets/s5.png';
import logo from '../../assets/logo.png';
import Footer from '../../components/Shared/Footer';
import ImageGalleryModal from '../../components/Shared/ImageGalleryModal';


const PlaceOffer = ({ icon: Icon, text, value }) => (
  <div className="flex-1 flex flex-col items-center text-center p-4 border-r border-[#767676] last:border-r-0 md:p-4 p-2">
    <Icon className="w-6 h-6 md:w-6 md:h-6 w-5 h-5 text-[#767676] mb-2" />
    <div className="text-[#767676] text-sm">
      <p className="font-medium md:text-sm text-xs">{text}</p>
      {value && <p className="md:text-sm text-xs">Up to {value}</p>}
    </div>
  </div>
);

const Detail = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-4 py-2">
    <Icon className="w-5 h-5 text-[#767676]" />
    <span className="text-[#767676] text-sm">{text}</span>
  </div>
);

const ImageGrid = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const images = [s1, s2, s3, s4, s5];

  return (
    <>
      <div className="flex md:flex-row flex-col gap-4 mb-10">
        {/* Main large image */}
        <div className="md:w-1/2 w-full">
          <img 
            src={s1} 
            alt="Main accommodation view" 
            className="w-full md:h-[400px] h-[300px] object-cover rounded-lg cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          />
        </div>
        {/* Grid of smaller images */}
        <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
          <img 
            src={s2} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <img 
            src={s3} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <img 
            src={s4} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <div className="relative">
            <img 
              src={s5} 
              alt="Room view" 
              className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
              onClick={() => setIsGalleryOpen(true)}
            />
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-md hover:bg-gray-50 transition-colors"
            >
              View all
            </button>
          </div>
        </div>
      </div>

      <ImageGalleryModal 
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
};

const Amenity = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg">
    {icon}
    <span className="text-gray-700 text-sm">{text}</span>
  </div>
);

const AccommodationPage = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({
    people: 1,
    dogs: 1
  });

 
  const placeOffers = [
    { icon: Dog, text: 'Dog', value: '1' },
    { icon: Home, text: 'Bedrooms', value: '2' },
    { icon: DoorOpen, text: 'Rooms', value: '2' },
    { icon: Users, text: 'People', value: '6' },
    { icon: Bath, text: 'Washroom', value: '1' }
  ];

  const details = [
    { icon: Utensils, text: 'Kitchen' },
    { icon: Dog, text: 'Dogs Allowed' },
    { icon: Briefcase, text: 'Dedicated workspace' },
    { icon: Wind, text: 'Air Conditioning' },
    { icon: Sparkles, text: 'Firework Free Zone' },
    { icon: Wifi, text: 'Wifi' },
    { icon: Waves, text: 'Swimming Pool' },
    { icon: Tv, text: 'TV' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        {/* Title */}
        <h1 className="text-[#4D484D] md:text-2xl text-xl font-semibold mb-6">
          Modern and Luxury 1BHK Studio/Self Check-in/Eiffle
        </h1>

        <ImageGrid />

        <div className="flex md:flex-row flex-col md:gap-8 gap-6">
          {/* Left Column */}
          <div className="md:flex-[0.9] w-full">
            {/* What this place offers */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-6">
                What this place offers
              </h2>
              <div className="border border-[#767676] rounded-lg overflow-x-auto">
                <div className="flex min-w-[600px] md:min-w-0">
                  {placeOffers.map((offer, index) => (
                    <PlaceOffer
                      key={index}
                      icon={offer.icon}
                      text={offer.text}
                      value={offer.value}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Dog Filters */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                Dog Filters
              </h2>
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Check className="text-brand" />
                  <span className="text-sm">Firework Free Zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-brand" />
                  <span className="text-sm">Dog-friendly restaurants nearby</span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line text-sm">
              Innenbereich20 m2. Weitere Angaben des Anbieters: Wir bieten grosszügige Rabatte schon ab 3 Tagen.
               Langzeitaufenthalte möglich. Perfekte Lage: Unsere Unterkunft bietet eine unschlagbare zentrale Lage.
                Lebensmittelgeschäfte, Bushaltestellen, erstklassige Restaurants, Bars und Shoppingmöglichkeiten – alles ist
                 nur einen kurzen Spaziergang entfernt. Stilvolle Einrichtung: Erleben Sie stillen Luxus und höchste Funktionalität.
                  Unsere Einrichtung umfasst ein Top-Bett, hochwertigste Bettwäsche und Seifen, schnellen WLAN-Zugang,
                   einen Flachbild-TV und eine Musikanlage. Top-Qualität und Sauberkeit: Wir garantieren Ihnen Top-Qualität
                    und makellose Sauberkeit. Sie finden alles in perfektem Zustand vor, sodass Sie sich sofort wohlfühlen können.
                     Eigener Garagenplatz: Für zusätzlichen Komfort steht Ihnen ein eigener Garagenplatz zur Verfügung. So haben
                      Sie jederzeit einen sicheren Stellplatz für Ihr Fahrzeug. Ruhige Umgebung: Trotz der zentralen Lage ist die
                       Umgebung unserer Unterkunft sehr ruhig, sodass Sie jederzeit entspannen und zur Ruhe kommen können.
                        Unser Studio zeichnet sich durch qualitativ hochstehende, stilvolle
              </p>
            </section>

             {/* Details */}
             <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-6">
                Details
              </h2>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {details.map((detail, index) => (
                  <Detail
                    key={index}
                    icon={detail.icon}
                    text={detail.text}
                  />
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                Location
              </h2>
              <div className="h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2725.3184333890953!2d7.331389315715455!3d46.961722279147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39c0d740c237%3A0x3a64c7675e48da95!2sVaz%2FObervaz%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1647850761619!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                Cancellation Policy
              </h2>
              <p className="text-gray-600 text-sm">
                Je nach Reisezeitraum 90% Rückerstattung bis 0% Rückerstattung.
              </p>
            </section>

            {/* Reviews */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                Review (0)
              </h2>
            </section>

            {/* About the Listing Provider */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                About the Listing Provider
              </h2>
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img src={logo} alt="Waureisen" className="w-12 md:w-16 h-12 md:h-16 rounded-full" />
                  <div>
                    <h3 className="font-semibold md:text-base text-sm">Hello, I'm Waureisen.</h3>
                    <p className="text-gray-600 text-sm">
                      Dies ist eine Unterkunft eines unserer geschätzten Kooperationspartner.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-brand hover:underline text-sm">View profile</button>
                  <span className="text-gray-400">•</span>
                  <button className="text-brand hover:underline text-sm">Contact</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:w-[360px] w-full md:flex-shrink-0 md:ml-auto"> 
          <div className="md:sticky md:top-24 bg-white rounded-lg border p-4">
              <div className="mb-3">
                <span className="md:text-2xl text-xl font-semibold">
                  <span className="line-through text-gray-400 mr-2">360 CHF</span>
                  240 CHF
                </span>
                <p className="text-gray-500 text-sm">Cost per Night</p>
              </div>

              {/* Date Picker */}
              <div 
                className="border rounded-lg p-3 mb-4 cursor-pointer"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Check in</p>
                    <p className="text-sm">{dateRange.start ? dateRange.start.toLocaleDateString() : '13/03/2024'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check out</p>
                    <p className="text-sm">{dateRange.end ? dateRange.end.toLocaleDateString() : '14/03/2024'}</p>
                  </div>
                </div>
              </div>

              {/* Guest Selector */}
              <div 
                className="border rounded-lg p-3 mb-4 cursor-pointer flex justify-between items-center"
                onClick={() => setIsGuestSelectorOpen(true)}
              >
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="text-sm">{`${guests.people} people, ${guests.dogs} dog`}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>

              <button className="w-full bg-brand text-white py-3 rounded-lg hover:bg-brand/90 transition-colors">
                Reserve
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedRange={dateRange}
        onRangeSelect={(range) => {
          setDateRange(range);
          if (range.start && range.end) {
            setIsDatePickerOpen(false);
          }
        }}
      />

      {/* Guest Selector Modal */}
      <GuestSelector
        isOpen={isGuestSelectorOpen}
        onClose={() => setIsGuestSelectorOpen(false)}
        guests={guests}
        onGuestsChange={setGuests}
      />
      <Footer />
    </div>
  );
};

export default AccommodationPage;