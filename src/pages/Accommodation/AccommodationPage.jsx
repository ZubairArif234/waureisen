import React, { useState } from 'react';
import Navbar from '../../components/HomeComponents/Navbar';
import DateRangePicker from '../../components/HomeComponents/DateRangePicker';
import GuestSelector from '../../components/HomeComponents/GuestSelector';
import { Check, ChevronDown } from 'lucide-react';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import s3 from '../../assets/s3.png';
import s4 from '../../assets/s4.png';
import s5 from '../../assets/s5.png';
import logo from '../../assets/logo.png';

const ImageGrid = () => (
  <div className="flex gap-4 mb-10">
    {/* Main large image */}
    <div className="w-1/2">
      <img 
        src={s1} 
        alt="Main accommodation view" 
        className="w-full h-[400px] object-cover rounded-lg"
      />
    </div>
    {/* Grid of smaller images */}
    <div className="w-1/2 grid grid-cols-2 gap-4">
      <img src={s2} alt="Room view" className="w-full h-[196px] object-cover rounded-lg" />
      <img src={s3} alt="Room view" className="w-full h-[196px] object-cover rounded-lg" />
      <img src={s4} alt="Room view" className="w-full h-[196px] object-cover rounded-lg" />
      <img src={s5} alt="Room view" className="w-full h-[196px] object-cover rounded-lg" />
    </div>
  </div>
);

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
    { text: 'Upto 1 Dog', value: '1' },
    { text: '2 Bedrooms', value: '2' },
    { text: '2 rooms', value: '2' },
    { text: 'Upto 6 People', value: '6' },
    { text: '1 Washroom', value: '1' }
  ];

  const details = [
    { icon: '🍳', text: 'Kitchen' },
    { icon: '🐕', text: 'Dogs Allowed' },
    { icon: '💼', text: 'Dedicated workspace' },
    { icon: '❄️', text: 'Air Conditioning' },
    { icon: '🎆', text: 'Firework Free Zone' },
    { icon: '📶', text: 'Wifi' },
    { icon: '🏊‍♂️', text: 'Swimming Pool' },
    { icon: '📺', text: 'TV' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        {/* Title */}
        <h1 className="text-[#4D484D] text-2xl font-semibold mb-6">
          Modern and Luxury 1BHK Studio/Self Check-in/Eiffle
        </h1>

        {/* Image Grid */}
        <ImageGrid />

        <div className="flex gap-8">
          {/* Left Column */}
          <div className="flex-1">
            {/* What this place offers */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {placeOffers.map((offer, index) => (
                  <div key={index} className="bg-white rounded-lg border p-3 text-center">
                    <p className="text-gray-600 text-sm">{offer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dog Filters */}
            <section className="mb-10">
  <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
    Dog Filters
  </h2>
  <div className="flex gap-6"> {/* Changed from space-y-2 to flex and gap-6 */}
    <div className="flex items-center gap-2">
      <Check className="text-brand" />
      <span>Firework Free Zone</span>
    </div>
    <div className="flex items-center gap-2">
      <Check className="text-brand" />
      <span>Dog-friendly restaurants nearby</span>
    </div>
  </div>
</section>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
              Innenbereich20 m2. Weitere Angaben des Anbieters: Wir bieten grosszügige Rabatte schon ab 3 Tagen.<br />
               Langzeitaufenthalte möglich. Perfekte Lage: Unsere Unterkunft bietet eine unschlagbare zentrale Lage.<br />
                Lebensmittelgeschäfte, Bushaltestellen, erstklassige Restaurants, Bars und Shoppingmöglichkeiten – alles ist<br />
                 nur einen kurzen Spaziergang entfernt. Stilvolle Einrichtung: Erleben Sie stillen Luxus und höchste Funktionalität.<br />
                  Unsere Einrichtung umfasst ein Top-Bett, hochwertigste Bettwäsche und Seifen, schnellen WLAN-Zugang,<br />
                   einen Flachbild-TV und eine Musikanlage. Top-Qualität und Sauberkeit: Wir garantieren Ihnen Top-Qualität<br />
                    und makellose Sauberkeit. Sie finden alles in perfektem Zustand vor, sodass Sie sich sofort wohlfühlen können.<br />
                     Eigener Garagenplatz: Für zusätzlichen Komfort steht Ihnen ein eigener Garagenplatz zur Verfügung. So haben<br />
                      Sie jederzeit einen sicheren Stellplatz für Ihr Fahrzeug. Ruhige Umgebung: Trotz der zentralen Lage ist die<br />
                       Umgebung unserer Unterkunft sehr ruhig, sodass Sie jederzeit entspannen und zur Ruhe kommen können.<br />
                        Unser Studio zeichnet sich durch qualitativ hochstehende, stilvolle
                {/* Rest of the description */}
              </p>
            </section>

            {/* Details */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {details.map((detail, index) => (
                  <Amenity key={index} icon={detail.icon} text={detail.text} />
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                Location
              </h2>
              <div className="h-[300px] rounded-lg overflow-hidden">
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
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                Cancellation Policy
              </h2>
              <p className="text-gray-600">
                Je nach Reisezeitraum 90% Rückerstattung bis 0% Rückerstattung.
              </p>
            </section>

            {/* Reviews */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                Review (0)
              </h2>
            </section>

            {/* About the Listing Provider */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] text-xl font-semibold mb-4">
                About the Listing Provider
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img src={logo} alt="Waureisen" className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="font-semibold">Hello, I'm Waureisen.</h3>
                    <p className="text-gray-600">
                      Dies ist eine Unterkunft eines unserer geschätzten Kooperationspartner.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-brand hover:underline">View profile</button>
                  <span className="text-gray-400">•</span>
                  <button className="text-brand hover:underline">Contact</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="w-72">
            <div className="sticky top-24 bg-white rounded-lg border p-4">
              <div className="mb-3">
                <span className="text-xl font-semibold">
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
                    <p>{dateRange.start ? dateRange.start.toLocaleDateString() : '13/03/2024'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check out</p>
                    <p>{dateRange.end ? dateRange.end.toLocaleDateString() : '14/03/2024'}</p>
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
                  <p>{`${guests.people} people, ${guests.dogs} dog`}</p>
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
    </div>
  );
};

export default AccommodationPage;