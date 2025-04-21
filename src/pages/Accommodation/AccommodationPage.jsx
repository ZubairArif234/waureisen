import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import DateRangePicker from '../../components/HomeComponents/DateRangePicker';
import GuestSelector from '../../components/HomeComponents/GuestSelector';
import { Check, ChevronDown, AlertTriangle } from 'lucide-react';
import { Users, Home, DoorOpen, Bath, Dog, Utensils, Briefcase, Wind, Sparkles, Wifi, Waves, Tv } from 'lucide-react';
import s1 from '../../assets/s1.png'; // Default image
import s2 from '../../assets/s2.png'; // Default image
import s3 from '../../assets/s3.png'; // Default image
import s4 from '../../assets/s4.png'; // Default image
import s5 from '../../assets/s5.png'; // Default image
import logo from '../../assets/logo.png';
import Footer from '../../components/Shared/Footer';
import ImageGalleryModal from '../../components/Shared/ImageGalleryModal';
import { useLanguage } from '../../utils/LanguageContext';
import { getListingById } from '../../api/listingAPI';
import { fetchInterhomePrices } from '../../api/interhomeAPI';

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

// Update ImageGrid to use dynamic images
const ImageGrid = ({ images = [s1, s2, s3, s4, s5] }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Use default images if no images are provided
  const displayImages = images.length > 0 ? images : [s1, s2, s3, s4, s5];

  return (
    <>
      <div className="flex md:flex-row flex-col gap-4 mb-10">
        {/* Main large image */}
        <div className="md:w-1/2 w-full">
          <img 
            src={displayImages[0]} 
            alt="Main accommodation view" 
            className="w-full md:h-[400px] h-[300px] object-cover rounded-lg cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          />
        </div>
        {/* Grid of smaller images */}
        <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
          <img 
            src={displayImages.length > 1 ? displayImages[1] : s2} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <img 
            src={displayImages.length > 2 ? displayImages[2] : s3} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <img 
            src={displayImages.length > 3 ? displayImages[3] : s4} 
            alt="Room view" 
            className="w-full md:h-[192px] h-[140px] object-cover rounded-lg cursor-pointer" 
            onClick={() => setIsGalleryOpen(true)}
          />
          <div className="relative">
            <img 
              src={displayImages.length > 4 ? displayImages[4] : s5} 
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
        images={displayImages}
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
  const { id } = useParams(); // Get the accommodation ID from URL
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({
    people: 1,
    dogs: 1
  });
  
  // Add maxGuests state to track the maximum allowed guests
  const [maxGuests, setMaxGuests] = useState(6); // Default to 6 if not specified
  
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add function to fetch price for new dates
  const fetchPriceForDates = async (startDate) => {
    if (!accommodation?.Code || !startDate) return;

    try {
      setIsPriceLoading(true);
      const formattedDate = startDate.toISOString().split('T')[0];
      
      const priceData = await fetchInterhomePrices({
        accommodationCode: accommodation.Code,
        checkInDate: formattedDate,
        los: true
      });

      if (priceData?.priceList?.prices?.price?.length > 0) {
        const duration7Options = priceData.priceList.prices.price.filter(option => 
          option.duration === 7
        );

        if (duration7Options.length > 0) {
          duration7Options.sort((a, b) => a.paxUpTo - b.paxUpTo);
          const selectedOption = duration7Options[0];
          const calculatedPricePerNight = Math.round(selectedOption.price / 7);

          setAccommodation(prev => ({
            ...prev,
            pricePerNight: {
              price: calculatedPricePerNight,
              currency: priceData.priceList.currency || 'CHF',
              totalPrice: selectedOption.price,
              duration: 7,
              paxUpTo: selectedOption.paxUpTo
            }
          }));
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch updated prices: ${error.message}`);
    } finally {
      setIsPriceLoading(false);
    }
  };

  // Add effect to watch date changes
  useEffect(() => {
    if (dateRange.start) {
      fetchPriceForDates(dateRange.start);
    }
  }, [dateRange.start]);

  // Fetch accommodation data when component mounts
  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        
        // Get search parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchDateParam = urlParams.get('checkInDate');
        
        // Check if we have price data in the location state (passed from search results)
        const searchState = window.history.state?.usr || {};
        const priceFromSearch = searchState.pricePerNight;
        const dateFromSearch = searchState.checkInDate || searchDateParam;
        
        console.log('Search state:', searchState);
        console.log('Date from search:', dateFromSearch);
        
        const data = await getListingById(id);
        
        // If we have price data from search results, use it
        if (priceFromSearch) {
          console.log('Using price data from search results:', priceFromSearch);
          data.pricePerNight = priceFromSearch;
        } 
        // Otherwise, fetch price data if needed
        else if (data.provider === 'Interhome' && data.Code && (!data.pricePerNight || !data.pricePerNight.price)) {
          try {
            // Use the date from search if available, otherwise use today's date
            let checkInDate;
            if (dateFromSearch) {
              checkInDate = dateFromSearch;
            } else {
              const today = new Date();
              checkInDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            }
            
            console.log('Using check-in date for price calculation:', checkInDate);
            
            const priceData = await fetchInterhomePrices({
              accommodationCode: data.Code,
              checkInDate: checkInDate,
              los: true
            });
            
            if (priceData && priceData.priceList && priceData.priceList.prices && 
                priceData.priceList.prices.price && priceData.priceList.prices.price.length > 0) {
              
            // Filter for duration 7 options
            const duration7Options = priceData.priceList.prices.price.filter(option => 
              option.duration === 7
            );
            
            if (duration7Options.length > 0) {
              // Sort by paxUpTo (ascending)
              duration7Options.sort((a, b) => a.paxUpTo - b.paxUpTo);
              
              // Use the option with lowest paxUpTo
              const selectedOption = duration7Options[0];
              
              // Calculate price per night
              const calculatedPricePerNight = Math.round(selectedOption.price / 7);
              
              // Update the accommodation data with price information
              data.pricePerNight = {
                price: calculatedPricePerNight,
                currency: priceData.priceList.currency || 'CHF',
                totalPrice: selectedOption.price,
                duration: 7,
                paxUpTo: selectedOption.paxUpTo
              };
              
              console.log('Fetched new price data:', data.pricePerNight);
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch Interhome prices for ${data.Code}:`, error);
        }
      }
      
      setAccommodation(data);
      
      // Update date range if we have a date from search
      if (dateFromSearch) {
        const startDate = new Date(dateFromSearch);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // Default to 7-day stay
        
        setDateRange({
          start: startDate,
          end: endDate
        });
      }
      
    } catch (err) {
      console.error('Error fetching accommodation:', err);
      setError('Failed to load accommodation details');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchAccommodation();
  }
}, [id]);

  // Default place offers (will be overridden with actual data if available)
  const placeOffers = [
    { icon: Users, text: t('people'), value: accommodation?.maxGuests?.toString() || '6 (default)' },
    { icon: Dog, text: t('dog'), value: accommodation?.maxDogs?.toString() || '1 (default)' },
    { icon: Home, text: t('bedrooms'), value: accommodation?.bedrooms?.toString() || '2 (default)' },
    { icon: DoorOpen, text: t('rooms'), value: accommodation?.rooms?.toString() || '2 (default)' },
    { icon: Bath, text: t('washroom'), value: accommodation?.bathrooms?.toString() || '1 (default)' }
  ];

  // Map amenities from backend to frontend icons
  const getAmenityIcon = (amenityName) => {
    const iconMap = {
      'kitchen': Utensils,
      'dogs_allowed': Dog,
      'workspace': Briefcase,
      'air_conditioning': Wind,
      'firework_free': Sparkles,
      'wifi': Wifi,
      'swimming_pool': Waves,
      'tv': Tv
    };
    
    return iconMap[amenityName] || Sparkles; // Default to Sparkles if no match
  };

  // Generate details from amenities in backend data
  const details = accommodation?.amenities 
    ? accommodation.amenities.map(amenity => ({
        icon: getAmenityIcon(amenity.type),
        text: amenity.name || amenity.type || 'Amenity'
      }))
    : [
        { icon: Utensils, text: t('kitchen') + ' (default)' },
        { icon: Dog, text: t('dogs_allowed') + ' (default)' },
        { icon: Briefcase, text: t('dedicated_workspace') + ' (default)' },
        { icon: Wind, text: t('air_conditioning') + ' (default)' },
        { icon: Sparkles, text: t('firework_free_zone') + ' (default)' },
        { icon: Wifi, text: t('wifi') + ' (default)' },
        { icon: Waves, text: t('swimming_pool') + ' (default)' },
        { icon: Tv, text: t('tv') + ' (default)' }
      ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Accommodation</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        {/* Title with Code */}
        <h1 className="text-[#4D484D] md:text-2xl text-xl font-semibold mb-6">
          {accommodation?.title || "Modern and Luxury 1BHK Studio/Self Check-in/Eiffle (default)"}
          {accommodation?.Code && (
            <span className="text-gray-500 text-base ml-2">
              ({accommodation.Code})
            </span>
          )}
        </h1>

        <ImageGrid images={accommodation?.images || []} />

        <div className="flex md:flex-row flex-col md:gap-8 gap-6">
          {/* Left Column */}
          <div className="md:flex-[0.9] w-full">
            {/* What this place offers */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-6">
                {t('what_this_place_offers')}
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
                {t('dog_filters')}
              </h2>
              <div className="flex md:flex-row flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Check className="text-brand" />
                  <span className="text-sm">
                    {accommodation?.dogFilters?.includes('firework_free') 
                      ? 'Firework Free Zone' 
                      : 'Firework Free Zone (default)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-brand" />
                  <span className="text-sm">
                    {accommodation?.dogFilters?.includes('restaurants_nearby') 
                      ? 'Dog-friendly restaurants nearby' 
                      : 'Dog-friendly restaurants nearby (default)'}
                  </span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t('description')}
              </h2>
              <p className="text-gray-600 whitespace-pre-line text-sm">
                {accommodation?.description || 
                  "Innenbereich20 m2. Weitere Angaben des Anbieters: Wir bieten grosszügige Rabatte schon ab 3 Tagen. Langzeitaufenthalte möglich. Perfekte Lage: Unsere Unterkunft bietet eine unschlagbare zentrale Lage. Lebensmittelgeschäfte, Bushaltestellen, erstklassige Restaurants, Bars und Shoppingmöglichkeiten – alles ist nur einen kurzen Spaziergang entfernt. (default)"}
              </p>
            </section>

            {/* Details */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-6">
                {t('details')}
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
                {t('location')}
              </h2>
              <div className="h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2725.3184333890953!2d${accommodation?.location?.coordinates?.[0] || 7.331389315715455}!3d${accommodation?.location?.coordinates?.[1] || 46.961722279147}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39c0d740c237%3A0x3a64c7675e48da95!2s${encodeURIComponent(accommodation?.location?.address || 'Vaz/Obervaz, Switzerland')}!5e0!3m2!1sen!2sus!4v1647850761619!5m2!1sen!2sus`}
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
                {t('cancellation_policy')}
              </h2>
              <p className="text-gray-600 text-sm">
                {accommodation?.cancellationPolicy || "Je nach Reisezeitraum 90% Rückerstattung bis 0% Rückerstattung. (default)"}
              </p>
            </section>

            {/* Reviews */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t('reviews')}
              </h2>
              {/* Reviews would be implemented here */}
            </section>

            {/* About the Listing Provider */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t('about_listing_provider')}
              </h2>
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={accommodation?.provider?.profilePicture || logo} 
                    alt={accommodation?.provider?.name || "Waureisen"} 
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full object-cover" 
                  />
                  <div>
                    <h3 className="font-semibold md:text-base text-sm">
                      Hello, I'm {accommodation?.provider?.name || "Waureisen (default)"}.
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {accommodation?.provider?.description || "Dies ist eine Unterkunft eines unserer geschätzten Kooperationspartner. (default)"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-brand hover:underline text-sm">{t('view_profile')}</button>
                  <span className="text-gray-400">•</span>
                  <button className="text-brand hover:underline text-sm">{t('contact')}</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:w-[360px] w-full md:flex-shrink-0 md:ml-auto">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl shadow-md p-6">
              {/* Price Display */}
              <div className="flex items-baseline mb-6">
                <span className="text-2xl font-semibold">
                  {isPriceLoading ? (
                    <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `${accommodation?.pricePerNight?.price || 0} ${accommodation?.pricePerNight?.currency || 'CHF'}`
                  )}
                </span>
                <span className="text-gray-600 ml-1">/ night</span>
              </div>

              {/* Date Picker */}
              <div className="mb-4 relative">
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 text-left"
                >
                  <span className="text-sm">
                    {dateRange.start && dateRange.end
                      ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                      : t('select_dates')}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute z-10 mt-2 w-full">
                    <DateRangePicker
                      selectedRange={dateRange}
                      onRangeChange={setDateRange}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* Guest Selector */}
              <div className="mb-6 relative">
                <button
                  onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 text-left"
                >
                  <span className="text-sm">
                    {guests.people} {guests.people === 1 ? t('guest') : t('guests')}, {guests.dogs} {guests.dogs === 1 ? t('dog') : t('dogs')}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                {isGuestSelectorOpen && (
                  <div className="absolute z-10 mt-2 w-full">
                    <GuestSelector
                      guests={guests}
                      onChange={setGuests}
                      onClose={() => setIsGuestSelectorOpen(false)}
                      maxGuests={accommodation?.maxGuests || maxGuests} // Use the maxGuests state
                      maxDogs={accommodation?.maxDogs || 2}
                    />
                  </div>
                )}
              </div>

              {/* ... rest of the booking card ... */}
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