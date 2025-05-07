import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import DateRangePicker from "../../components/HomeComponents/DateRangePicker";
import GuestSelector from "../../components/HomeComponents/GuestSelector";
import { Check, ChevronDown, AlertTriangle, ArrowLeft } from "lucide-react";
import {
  Users,
  Home,
  DoorOpen,
  Bath,
  Dog,
  Utensils,
  Briefcase,
  Wind,
  Sparkles,
  Wifi,
  Waves,
  Tv,
} from "lucide-react";
import s1 from "../../assets/s1.png"; // Default image
import s2 from "../../assets/s2.png"; // Default image
import s3 from "../../assets/s3.png"; // Default image
import s4 from "../../assets/s4.png"; // Default image
import s5 from "../../assets/s5.png"; // Default image
import logo from "../../assets/logo.png";
import Footer from "../../components/Shared/Footer";
import ImageGalleryModal from "../../components/Shared/ImageGalleryModal";
import { useLanguage } from "../../utils/LanguageContext";
import { getListingById } from "../../api/listingAPI";
import {
  fetchInterhomePrices,
  fetchInterhomeAvailability,
} from "../../api/interhomeAPI"; // Import fetchInterhomeAvailability
import moment from "moment";
import AccommodationDetails from "../../components/AccommodationDetails";
import API from "../../api/config";
import toast from "react-hot-toast";
import { getBookingByListing } from "../../api/bookingApi";

const PlaceOffer = ({ icon: Icon, text, value }) => (
  <div className="flex-1 flex flex-col items-center text-center p-4 border-r border-[#767676] last:border-r-0 md:p-4 p-2">
    <Icon className="w-6 h-6 md:w-6 md:h-6 w-5 h-5 text-[#767676] mb-2" />
    <div className="text-[#767676] text-sm">
      <p className="font-medium md:text-sm text-xs">{text}</p>
      {value && <p className="md:text-sm text-xs"> {value}</p>}
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
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the accommodation ID from URL
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState({
    people: 1,
    dogs: 1,
  });
// console.log(dateRange , "jkikkl");


const getAllDates = (startDate, endDate) => {
  const start = moment(startDate).startOf('day');
  const end = moment(endDate).startOf('day');
  const dates = [];

  while (start.isSameOrBefore(end)) {
    dates.push(start.format("YYYY-MM-DD"));
    start.add(1, 'day');
  }

  return dates;
};
console.log(bookedDates , "state dates");

const handleGetBooking = async() =>{
 const res = await getBookingByListing(id)

 res.map((item)=>{
  const result = getAllDates(item?.checkInDate, item?.checkOutDate);
  console.log(result , "result");
  
  setBookedDates(prev => {
    const combined = [...prev, ...result];
    const uniqueDates = Array.from(new Set(combined));
    return uniqueDates;
  });
  
 })
}

useEffect(()=>{
handleGetBooking()
},[])

  // Add maxGuests state to track the maximum allowed guests
  const [maxGuests, setMaxGuests] = useState(6); // Default to 6 if not specified

  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]); // Add state for available dates

  // Check if we came from admin panel
  const isFromAdmin = location.state?.from === 'admin' || location.pathname.includes('/admin/');

  // Add function to fetch price for new dates with optional pax parameter
  const fetchPriceForDates = async (startDate, paxValue = null) => {
    if (!accommodation?.Code || !startDate) return;

    try {
      setIsPriceLoading(true);
      const formattedDate = startDate.toISOString().split("T")[0];

      const priceData = await fetchInterhomePrices({
        accommodationCode: accommodation.Code,
        checkInDate: formattedDate,
        pax: paxValue, // Pass the pax parameter if provided
        los: true,
      });

      if (priceData?.priceList?.prices?.price?.length > 0) {
        const duration7Options = priceData.priceList.prices.price.filter(
          (option) => option.duration === 7
        );

        if (duration7Options.length > 0) {
          // If pax is specified, find the option that matches or is closest to the pax value
          let selectedOption;

          if (paxValue) {
            // Find options that can accommodate the requested number of guests
            const suitableOptions = duration7Options.filter(
              (option) => option.paxUpTo >= paxValue
            );

            if (suitableOptions.length > 0) {
              // Sort by paxUpTo to get the most appropriate option
              suitableOptions.sort((a, b) => a.paxUpTo - b.paxUpTo);
              selectedOption = suitableOptions[0]; // Get the option with the lowest suitable paxUpTo
            } else {
              // If no suitable options, sort by paxUpTo (ascending) and take the highest capacity
              duration7Options.sort((a, b) => b.paxUpTo - a.paxUpTo);
              selectedOption = duration7Options[0];
            }
          } else {
            // Default behavior when no pax specified - sort by paxUpTo (ascending)
            duration7Options.sort((a, b) => a.paxUpTo - b.paxUpTo);
            selectedOption = duration7Options[0];
          }

          const calculatedPricePerNight = (selectedOption.price / 7).toFixed(2);

          setAccommodation((prev) => ({
            ...prev,
            pricePerNight: {
              price: calculatedPricePerNight,
              currency: priceData.priceList.currency || "",
              totalPrice: selectedOption.price,
              duration: 7,
              paxUpTo: selectedOption.paxUpTo,
            },
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
        const searchDateParam = urlParams.get("checkInDate");

        // Check if we have price data in the location state (passed from search results)
        const searchState = window.history.state?.usr || {};
        const priceFromSearch = searchState.pricePerNight;
        const dateFromSearch = searchState.checkInDate || searchDateParam;

        console.log("Search state:", searchState);
        console.log("Date from search:", dateFromSearch);

        const data = await getListingById(id);

        // If we have price data from search results, use it
        if (priceFromSearch) {
          console.log("Using price data from search results:", priceFromSearch);
          data.pricePerNight = priceFromSearch;
        }
        // Otherwise, fetch price data if needed

        // Add to recently viewed if user is logged in
        const token = localStorage.getItem("token");
        if (token && id) {
          try {
            await API.post(`/users/recently-viewed/${id}`);
            console.log("Added to recently viewed:", id);
          } catch (err) {
            console.error("Error adding to recently viewed:", err);
          }
        }

        // Fetch availability data if it's an Interhome listing
        if (data.provider === "Interhome" && data.Code) {
          try {
            const availabilityData = await fetchInterhomeAvailability(
              data.Code
            );
            if (availabilityData && availabilityData.availableDates) {
              setAvailableDates(
                availabilityData.availableDates.map((d) => d.checkInDate)
              ); // Store only the dates

              // Find the maximum paxUpTo value from all available dates
              if (availabilityData.availableDates.length > 0) {
                const maxPaxUpTo = Math.max(
                  ...availabilityData.availableDates.map(
                    (date) => date.paxUpTo || 0
                  )
                );
                if (maxPaxUpTo > 0) {
                  //console.log(`Setting maximum guests to ${maxPaxUpTo} based on availability data`);
                  setMaxGuests(maxPaxUpTo);
                  // Also set it on the accommodation object for reference
                  data.maxGuests = maxPaxUpTo;
                }
              }
            }
          } catch (availabilityError) {
            console.warn(
              `Failed to fetch Interhome availability for ${data.Code}:`,
              availabilityError
            );
            // Optionally set an error state or handle this case
          }
        }

        // If we have price data from search results, use it
        if (priceFromSearch) {
          console.log("Using price data from search results:", priceFromSearch);
          data.pricePerNight = priceFromSearch;
        }
        // Otherwise, fetch price data if needed
        else if (
          data.provider === "Interhome" &&
          data.Code &&
          (!data.pricePerNight || !data.pricePerNight.price)
        ) {
          try {
            // Use the date from search if available, otherwise use today's date
            let checkInDate;
            if (dateFromSearch) {
              checkInDate = dateFromSearch;
            } else {
              const today = new Date();
              checkInDate = `${today.getFullYear()}-${String(
                today.getMonth() + 1
              ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            }

            console.log(
              "Using check-in date for price calculation:",
              checkInDate
            );

            const priceData = await fetchInterhomePrices({
              accommodationCode: data.Code,
              checkInDate: checkInDate,
              los: true,
            });

            if (
              priceData &&
              priceData.priceList &&
              priceData.priceList.prices &&
              priceData.priceList.prices.price &&
              priceData.priceList.prices.price.length > 0
            ) {
              // Filter for duration 7 options
              const duration7Options = priceData.priceList.prices.price.filter(
                (option) => option.duration === 7
              );

              if (duration7Options.length > 0) {
                // Sort by paxUpTo (ascending)
                duration7Options.sort((a, b) => a.paxUpTo - b.paxUpTo);

                // Use the option with lowest paxUpTo
                const selectedOption = duration7Options[0];

                // Calculate price per night
                const calculatedPricePerNight = Math.round(
                  selectedOption.price / 7
                );

                // Update the accommodation data with price information
                data.pricePerNight = {
                  price: calculatedPricePerNight,
                  currency: priceData.priceList.currency || "",
                  totalPrice: selectedOption.price,
                  duration: 7,
                  paxUpTo: selectedOption.paxUpTo,
                };

                console.log("Fetched new price data:", data.pricePerNight);
              }
            }
          } catch (error) {
            console.warn(
              `Failed to fetch Interhome prices for ${data.Code}:`,
              error
            );
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
            end: endDate,
          });
        }
      } catch (err) {
        console.error("Error fetching accommodation:", err);
        setError("Failed to load accommodation details");
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
    {
      icon: Users,
      text: t("people"),
      value:
        accommodation?.pricePerNight?.paxUpTo ||
        accommodation?.maxGuests?.toString() ||
        "6 ", // Default
    },
    {
      icon: Dog,
      text: t("dog"),
      value: accommodation?.maxDogs?.toString() || "1",
    },
    {
      icon: Home,
      text: t("bedrooms"),
      value: accommodation?.bedRooms?.toString() || "2 (default)",
    },
    {
      icon: DoorOpen,
      text: t("rooms"),
      value: accommodation?.rooms?.number?.toString() || "2 (default)",
    },
    {
      icon: Bath,
      text: t("washroom"),
      value: accommodation?.washrooms?.toString() || "1 (default)",
    },
  ];

  // Map amenities from backend to frontend icons
  const getAmenityIcon = (amenityName) => {
    const iconMap = {
      kitchen: Utensils,
      dogs_allowed: Dog,
      workspace: Briefcase,
      air_conditioning: Wind,
      firework_free: Sparkles,
      wifi: Wifi,
      swimming_pool: Waves,
      tv: Tv,
    };

    return iconMap[amenityName?.toLowerCase()] || Sparkles; // Default to Sparkles if no match
  };

  // Generate details from attributes in backend data
  const details =
    accommodation?.attributes && accommodation.attributes.length > 0
      ? accommodation.attributes.map((attr) => ({
          icon: getAmenityIcon(attr.name?.toLowerCase()),
          text: attr.name || "Amenity",
        }))
      : [
          { icon: Utensils, text: t("kitchen") + " (default)" },
          { icon: Dog, text: t("dogs_allowed") + " (default)" },
          { icon: Briefcase, text: t("dedicated_workspace") + " (default)" },
          { icon: Wind, text: t("air_conditioning") + " (default)" },
          { icon: Sparkles, text: t("firework_free_zone") + " (default)" },
          { icon: Wifi, text: t("wifi") + " (default)" },
          { icon: Waves, text: t("swimming_pool") + " (default)" },
          { icon: Tv, text: t("tv") + " (default)" },
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Accommodation
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getNoOfDays = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    const differenceInDays = end.diff(start, "days");
    return differenceInDays >= 0 ? differenceInDays : 0;
  };

  const handleReserved = () => {
    console.log("Reserved button clicked : ", accommodation?.provider);
    if (!dateRange?.start || !dateRange?.end) {
      // alert("Please select both check-in and check-out dates before reserving.");
    toast.error("Please select both check-in and check-out dates before reserving.")
      return;
    }
    if (accommodation?.provider === "Interhome") {
      const checkInDate = moment(dateRange.start).format("YYYY-MM-DD");
      const duration = moment(dateRange.end).diff(
        moment(dateRange.start),
        "days"
      );
      // console.log("Check-in Date:", checkInDate);
      // console.log("Duration:", duration);

      const partnerId = import.meta.env.VITE_INTERHOME_PARTNER_ID;
      const iframeUrl = `https://www.interhome.com/Forward.aspx?navigationid=12&aCode=${accommodation.Code}&dtCheckin=${checkInDate}&duration=${duration}&partnerid=${partnerId}&adrAdults=${guests.people}&iniframe=1`;
      window.location.href = iframeUrl;
    } else {
      console.log(dateRange.start, dateRange.end  , getNoOfDays(dateRange.start, dateRange.end));
      let  days = getNoOfDays(dateRange.start, dateRange.end);
      navigate("/payment", {
        state: {
          price: location.state,
          data: accommodation,
          details: {
            noOfDays: days,
            startDate: dateRange?.start,
            endDate: dateRange?.end,
            guests:guests
          },
        },
      });
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
        {/* Title section with back button */}
        <div className="flex flex-col gap-4 mb-6">
          {isFromAdmin && (
            <button
              onClick={() => navigate('/admin/accommodations')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Admin Panel</span>
            </button>
          )}
          <h1 className="text-[#4D484D] md:text-2xl text-xl font-semibold">
            {accommodation?.title ||
              "Modern and Luxury 1BHK Studio/Self Check-in/Eiffle (default)"}
            {accommodation?.Code && (
              <span className="text-gray-500 text-base ml-2">
                ({accommodation.Code})
              </span>
            )}
          </h1>
        </div>

        <ImageGrid images={accommodation?.images || []} />

        <div className="flex md:flex-row flex-col md:gap-8 gap-6">
          {/* Left Column */}
          <div className="md:flex-[0.9] w-full">
            {/* What this place offers */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-6">
                {t("what_this_place_offers")}
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

            {/* Dog Filters Hidden if nothing recevied */}
            {accommodation?.dogFilters &&
              accommodation.dogFilters.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                    {t("dog_filters")}
                  </h2>
                  <div className="flex md:flex-row flex-col gap-4">
                    {accommodation.dogFilters.includes("firework_free") && (
                      <div className="flex items-center gap-2">
                        <Check className="text-brand" />
                        <span className="text-sm">Firework Free Zone</span>
                      </div>
                    )}
                    {accommodation.dogFilters.includes(
                      "restaurants_nearby"
                    ) && (
                      <div className="flex items-center gap-2">
                        <Check className="text-brand" />
                        <span className="text-sm">
                          Dog-friendly restaurants nearby
                        </span>
                      </div>
                    )}
                    {/* Add more dog filters here as needed */}
                  </div>
                </section>
              )}

            {/* Accommodation Details */}
            <AccommodationDetails accommodation={accommodation} />

            {/* Location */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t("location")}
              </h2>
              <div className="h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2725.3184333890953!2d${
                    accommodation?.location?.coordinates?.[0] ||
                    7.331389315715455
                  }!3d${
                    accommodation?.location?.coordinates?.[1] || 46.961722279147
                  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39c0d740c237%3A0x3a64c7675e48da95!2s${encodeURIComponent(
                    accommodation?.location?.address ||
                      "Vaz/Obervaz, Switzerland"
                  )}!5e0!3m2!1sen!2sus!4v1647850761619!5m2!1sen!2sus`}
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
                {t("cancellation_policy")}
              </h2>
              <p className="text-gray-600 text-sm">
                {accommodation?.legal?.cancellationPolicy ||
                  "Je nach Reisezeitraum 90% Rückerstattung bis 0% Rückerstattung. (default)"}
              </p>

              {accommodation?.legal?.termsAndConditions && (
                <div className="mt-4">
                  <h3 className="text-[#4D484D] text-base font-medium mb-2">
                    {t("terms_and_conditions")}
                  </h3>
                  <Link to={"https://www.interhome.de/kundenservice/agb/"} className="text-gray-600 text-sm whitespace-pre-line">
                  https://www.interhome.de/kundenservice/agb/
                  </Link>
                </div>
              )}
            </section>

            {/* Reviews */}
            {/* <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t("reviews")}
              </h2>
            </section> */}

            {/* About the Listing Provider */}
            <section className="mb-10">
              <h2 className="text-[#4D484D] md:text-xl text-lg font-semibold mb-4">
                {t("about_listing_provider")}
              </h2>
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={accommodation?.owner?.profilePicture || logo}
                    alt={
                      accommodation?.owner?.displayName ||
                      accommodation?.listingSource ||
                      accommodation?.source?.name ||
                      "Provider"
                    }
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold md:text-base text-sm capitalize">
                      Hello, I'm{" "}
                      {accommodation?.owner?.displayName ||
                        accommodation?.owner?.username ||
                        accommodation?.listingSource ||
                        accommodation?.source?.name ||
                        "Provider"}
                      .
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {accommodation?.owner?.bio ||
                        "This is an accommodation from one of our valued partners."}
                    </p>
                  </div>
                </div>
                {accommodation?.provider !== "Interhome" &&
                <div className="flex gap-4">
                  <Link to={"/public-profile"}
                  // state={{ user: { name: "John", age: 30 } }}
                  state={{data:{...accommodation?.owner}}} 
                  className="text-brand hover:underline text-sm">
                    {t("view_profile")}
                  </Link>
                
                </div>
                  }
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:w-[360px] w-full md:flex-shrink-0 md:ml-auto">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl shadow-md p-6">
              {/* Price Display */}
              <div className="flex flex-col mb-6">
                <div className="flex items-baseline">
                  <span className="text-gray-600 mr-2 font-bold">
                    Total Price:
                  </span>
                  <span className="text-xl font-semibold">
                    {isPriceLoading ? (
                      <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      `${accommodation?.pricePerNight?.price || 0} X ${
                        getNoOfDays(dateRange?.start, dateRange?.end) || 1
                      } = ${
                        (accommodation?.pricePerNight?.price || 0) *
                        (getNoOfDays(dateRange?.start, dateRange?.end) || 1)
                      } ${accommodation?.pricePerNight?.currency || "CHF"}`
                    )}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {t("price_per_person_per_night")}:{" "}
                  {(accommodation?.pricePerNight?.price || 0) /
                    (guests?.people || 1)}{" "}
                  ${accommodation?.pricePerNight?.currency || "CHF"}
                </div>
              </div>
{console.log(availableDates , " available dates")
}
              {/* Date Picker */}
              <div className="mb-4 relative">
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-lg p-3 text-left"
                >
                  <span className="text-sm">
                    {dateRange.start && dateRange.end
                      ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                      : t("select_dates")}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute z-10 mt-2 w-full">
                    <DateRangePicker
                      selectedRange={dateRange}
                      onRangeChange={setDateRange}
                      onClose={() => setIsDatePickerOpen(false)}
                      availableDates={availableDates} // Pass available dates
                      bookedDates={bookedDates}
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
                    {guests.people}{" "}
                    {guests.people === 1 ? t("guest") : t("guests")},{" "}
                    {guests.dogs} {guests.dogs === 1 ? t("dog") : t("dogs")}
                    {accommodation?.maxGuests
                      ? ` (${t("max")} ${accommodation.maxGuests} ${t(
                          "guests"
                        )})`
                      : ""}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                {isGuestSelectorOpen && (
                  <div className="absolute z-10 mt-2 w-full">
                    <GuestSelector
                      guests={guests}
                      onChange={setGuests}
                      onClose={() => {
                        setIsGuestSelectorOpen(false);
                        // When Apply is clicked, update the price based on the selected number of guests
                        if (dateRange.start && accommodation?.Code) {
                          // Pass the total number of guests (people) as the pax parameter
                          fetchPriceForDates(dateRange.start, guests.people);
                        }
                      }}
                      maxGuests={accommodation?.maxGuests || maxGuests} // Use the maxGuests state
                      maxDogs={accommodation?.maxDogs || 2}
                    />
                  </div>
                )}
              </div>

              {/* Price Calculation */}

              {accommodation?.provider !== "Interhome" && (
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      {accommodation?.pricePerNight?.price || 0} x{" "}
                      {getNoOfDays(dateRange?.start, dateRange?.endDate) > 0
                        ? getNoOfDays(dateRange?.start, dateRange?.endDate)
                        : "1"}
                    </p>
                    {(() => {
                      const days =
                        getNoOfDays(dateRange?.start, dateRange?.end) || 0;
                      const unitPrice =
                        accommodation.pricePerNight.originalPrice ||
                        accommodation.pricePerNight.price;
                      const total = days > 0 ? unitPrice * days : unitPrice;

                      return <p className="text-sm text-gray-700">{total}</p>;
                    })()}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Service charge (2.9%)
                    </p>
                    <p className="text-sm text-gray-700">
                      {(() => {
                        const days =
                          getNoOfDays(dateRange?.start, dateRange?.end) || 0;
                        const unitPrice =
                          accommodation.pricePerNight.originalPrice ||
                          accommodation.pricePerNight.price;
                        const baseAmount = days * unitPrice;
                        const totalWithStripe = baseAmount * 0.029;

                        return totalWithStripe.toFixed(2); // rounded to 2 decimal places
                      })()}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between font-semibold">
                    <span>{t("total")}</span>
                    <span>
                      {(() => {
                        const days =
                          getNoOfDays(dateRange?.start, dateRange?.end) || 0;
                        const unitPrice =
                          accommodation.pricePerNight.originalPrice ||
                          accommodation.pricePerNight.price;
                        const baseAmount = days * unitPrice;
                        const totalWithStripe = baseAmount + baseAmount * 0.029;

                        return totalWithStripe.toFixed(2); // rounded to 2 decimal places
                      })()}
                    </span>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <button
                className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:bg-brand-dark transition-colors"
                onClick={() => {
                  handleReserved();
                  // Handle reservation logic here
                  // alert('Booking functionality will be implemented soon!');
                }}
              >
                {t("reserve")}
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
        bookedDates={bookedDates}
        availableDates={availableDates} // Pass available dates
      />

      {/* Remove the redundant date picker and guest selector modals */}
      <Footer />
    </div>
  );
};

export default AccommodationPage;
