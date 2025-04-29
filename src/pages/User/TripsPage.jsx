import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Dog, Edit, X, AlertTriangle } from "lucide-react";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";
import DateRangePicker from "../../components/HomeComponents/DateRangePicker";
import GuestSelector from "../../components/HomeComponents/GuestSelector";
import i1 from "../../assets/i1.png";
import i2 from "../../assets/i2.png";
import i3 from "../../assets/i3.png";
import { useLanguage } from "../../utils/LanguageContext";
import { getMyBooking } from "../../api/bookingApi";
import moment from "moment";
import { refundPayment } from "../../api/paymentAPI";
import CancelBookingModal from "../../components/SearchComponents/CancelBookingModal";
import Pagination from "../../components/HomeComponents/Pagination";

// Edit Trip Modal Component
const EditTripModal = ({ isOpen, onClose, trip, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // Parse the trip dates to create a date range
  // Replace the current parseDates function with this more robust version
  const parseDates = (dateString) => {
    try {
      // First check if we have a proper date range with a hyphen
      if (!dateString.includes("-")) {
        return {
          start: new Date(),
          end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        };
      }

      const [startStr, endStr] = dateString.split("-").map((d) => d.trim());

      // Use a more robust date parsing approach
      const parseDate = (str) => {
        // Try to handle various formats
        if (!str) return new Date();

        // Try direct Date parsing first
        const directParse = new Date(str);
        if (!isNaN(directParse.getTime())) {
          return directParse;
        }

        // Try manual parsing as fallback
        const parts = str.replace(",", "").split(" ");
        if (parts.length < 3) return new Date();

        const monthMap = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        const month = monthMap[parts[0]];
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (isNaN(month) || isNaN(day) || isNaN(year)) {
          console.error("Failed to parse date parts:", parts);
          return new Date();
        }

        return new Date(year, month, parseInt(day));
      };

      return {
        start: parseDate(startStr),
        end: parseDate(endStr),
      };
    } catch (error) {
      console.error("Error parsing dates:", error, dateString);
      return {
        start: new Date(),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      };
    }
  };

  // Initial state from the trip
  const [dateRange, setDateRange] = useState(parseDates(trip.dates));
  const [guests, setGuests] = useState(() => {
    const [people, dogs] = trip.guests
      .split(",")
      .map((s) => parseInt(s.trim().split(" ")[0]));
    return { people, dogs };
  });

  // Format the date range for display
  const formatDateRange = (range) => {
    if (!range.start || !range.end) return "";

    const formatDate = (date) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    };

    return `${formatDate(range.start)}-${formatDate(range.end)}`;
  };

  // Handlers
  const handleSave = () => {
    onSave(trip.id, {
      dates: formatDateRange(dateRange),
      guests: `${guests.people} people, ${guests.dogs} ${
        guests.dogs === 1 ? "dog" : "dogs"
      }`,
    });
  };

  const handleCancel = () => {
    onCancel(trip.id);
    setShowCancelConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{t("edit_trip")}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Trip Location */}
          <div className="mb-6">
            <h3 className="font-medium text-lg">{trip.location}</h3>
            <p className="text-gray-600">{trip.address}</p>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("dates")}
            </label>
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:border-brand"
            >
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400 w-5 h-5" />
                <span>
                  {dateRange.start && dateRange.end
                    ? formatDateRange(dateRange)
                    : t("select_dates")}
                </span>
              </div>
            </button>
          </div>

          {/* Guests Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("guests")}
            </label>
            <button
              onClick={() => setIsGuestSelectorOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:border-brand"
            >
              <div className="flex items-center gap-2">
                <Dog className="text-gray-400 w-5 h-5" />
                <span>
                  {`${guests.people} ${
                    guests.people === 1 ? t("person") : t("people")
                  }, ${guests.dogs} ${
                    guests.dogs === 1 ? t("dog") : t("dogs")
                  }`}
                </span>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowCancelConfirmation(true)}
              className="py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
            >
              {t("cancel_booking")}
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 bg-brand text-white rounded-lg hover:bg-brand/90"
            >
              {t("save_changes")}
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setShowCancelConfirmation(false)}
          />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-[70] relative">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("cancel_confirmation")}
                </h3>
                <p className="text-gray-600 mb-2">{t("cancel_warning")}</p>
                <p className="text-red-500 font-medium">
                  {t("cancellation_fee_notice")}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t("go_back")}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t("confirm_cancellation")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker */}
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

      {/* Guest Selector */}
      <GuestSelector
        isOpen={isGuestSelectorOpen}
        onClose={() => setIsGuestSelectorOpen(false)}
        guests={guests}
        onGuestsChange={setGuests}
      />
    </>
  );
};

const TripCard = ({ trip, onEdit }) => {
  const [activeModal, setActiveModal] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const start = moment(trip?.checkInDate);
  const end = moment(trip?.checkOutDate);

  const formattedDate = `${start.format("MMM D")}-${end.format("D, YYYY")}`;

  const handleCancelBooking = async () => {
    const res = await refundPayment(trip?._id);
    console.log(res);
  };

  const handleOpenModal = () => {
    setActiveModal(true);
  };
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      // onClick={() => navigate(`/accommodation/${trip?.listing?._id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 h-48 md:h-auto relative">
          <img
            src={trip?.listing?.images[0]}
            alt={trip?.title}
            className="w-full h-full object-cover"
          />
          {trip.status === "canceled" && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              {t("cancelled")}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 flex-1">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {trip?.listing?.title}
                </h3>
                {trip?.status === "pending" && (
                  <button
                    onClick={handleOpenModal}
                    className="px-4 z-20 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Edit Button - Stop propagation to prevent navigation */}
              {trip.status === "upcoming" && (
                <button
                  className="p-2 text-gray-500 hover:text-brand hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(trip);
                  }}
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-3 mb-4 flex-grow">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{trip?.listing?.location?.address}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Dog className="w-5 h-5" />
                <span>{trip?.listing?.provider}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              <div className="text-gray-600">
                {t("host")}{" "}
                <span className="font-medium">{trip.listing?.provider}</span>
              </div>
              <div className="text-brand font-medium">
                {trip.status === "pending"
                  ? t("upcoming")
                  : trip.status === "confirmed"
                  ? t("completed")
                  : t("cancelled")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CancelBookingModal
        isOpen={activeModal}
        onClose={() => setActiveModal(false)}
        title={t("cancel_booking")}
        onConfirm={handleCancelBooking}
      >
        <p className="text-center">
          Are you sure , you want to cancel your booking? This action can't be
          undone!
        </p>
      </CancelBookingModal>
    </div>
  );
};

const NoTrips = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {t("no_trips_booked")}
      </h2>
      <p className="text-gray-600 mb-8">{t("plan_adventure")}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
      >
        {t("start_searching")}
      </button>
    </div>
  );
};

// Success message component
const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg border border-green-200 flex items-center justify-between max-w-md">
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-800"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const TripsPage = () => {
  const { t } = useLanguage();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [trips, setTrips] = useState();

  const handleGetMyBooking = async () => {
    const res = await getMyBooking();

    setTrips(res);
  };

  useEffect(() => {
    handleGetMyBooking();
  }, []);

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setEditModalOpen(true);
  };

  const handleSaveChanges = (tripId, updates) => {
    setTrips(
      trips.map((trip) => (trip.id === tripId ? { ...trip, ...updates } : trip))
    );
    setEditModalOpen(false);
    setSuccessMessage(t("trip_updated_success"));
  };

  const handleCancelTrip = (tripId) => {
    setTrips(
      trips.map((trip) =>
        trip.id === tripId ? { ...trip, status: "cancelled" } : trip
      )
    );
    setEditModalOpen(false);
    setSuccessMessage(t("trip_cancelled_success"));
  };

  // const upcomingTrips = trips?.filter((trip) => trip.status === "pending");
  // const pastTrips = trips?.filter((trip) => trip.status === "confirmed");
  // const cancelledTrips = trips?.filter((trip) => trip.status === "canceled");

  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [cancelledTrips, setCancelledTrips] = useState([]);
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
  const [currentCanceledPage, setCurrentCanceledPage] = useState(1);
  const [currentConfirmedPage, setCurrentConfirmedPage] = useState(1);
  const totalUpcomingPages = 5;
  const itemPerPage = 5;
  const totalConfirmedPages = 5;

  const handlePageChange = (page, type) => {
    if (type == "upcoming") {
      setCurrentUpcomingPage(page);
    } else if (type == "canceled") {
      setCurrentCanceledPage(page);
    } else {
      setCurrentConfirmedPage(page);
    }
    // fetch data for new page here
  };

  useEffect(() => {
    const startUpcoming = (currentUpcomingPage - 1) * itemPerPage;
    const endUpcoming = startUpcoming + itemPerPage;
    setUpcomingTrips(
      trips
        ?.filter((trip) => trip.status === "pending")
        ?.slice(startUpcoming, endUpcoming)
    );

    const startConfirmed = (currentConfirmedPage - 1) * itemPerPage;
    const endConfirmed = startConfirmed + itemPerPage;
    setPastTrips(
      trips
        ?.filter((trip) => trip.status === "confirmed")
        ?.slice(startConfirmed, endConfirmed)
    );

    const startCanceled = (currentCanceledPage - 1) * itemPerPage;
    const endCanceled = startCanceled + itemPerPage;
    setCancelledTrips(
      trips
        ?.filter((trip) => trip.status === "canceled")
        ?.slice(startCanceled, endCanceled)
    );
  }, [currentCanceledPage, currentConfirmedPage, currentUpcomingPage, trips]);

  return (
    <div className="min-h-screen bg-[#FEFCF5]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {t("your_trips")}
          </h1>
          <div className="space-y-3">
            <p className="text-gray-600">{t("manage_trips")}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <span>{t("cant_find_reservation")}</span>
              <a
                href="mailto:hallo@waureisen.com"
                className="text-[#B4A481] hover:underline font-medium"
              >
                {t("contact_us_email")}
              </a>
            </div>
          </div>
        </div>

        {trips?.length === 0 ? (
          <NoTrips />
        ) : (
          <div className="space-y-12">
            {/* Upcoming Trips */}
            {upcomingTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("upcoming_trips")}
                </h2>
                <div className="space-y-4">
                  {upcomingTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onEdit={handleEditTrip}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Pagination
                    type="upcoming"
                    currentPage={currentUpcomingPage}
                    totalPages={Math.ceil(
                      trips?.filter((trip) => trip.status === "pending")
                        ?.length / itemPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}

            {/* Cancelled Trips */}
            {cancelledTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("cancelled_trips")}
                </h2>
                <div className="space-y-4">
                  {cancelledTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onEdit={handleEditTrip}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Pagination
                    type="cancelled"
                    currentPage={currentCanceledPage}
                    totalPages={Math.ceil(
                      trips?.filter((trip) => trip.status === "canceled")
                        ?.length / itemPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}

            {/* Past Trips */}
            {pastTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("past_trips")}
                </h2>
                <div className="space-y-4">
                  {pastTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onEdit={handleEditTrip}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Pagination
                    type="confirmed"
                    currentPage={currentConfirmedPage}
                    totalPages={Math.ceil(
                      trips?.filter((trip) => trip.status === "confirmed")
                        ?.length / itemPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Center Link */}
        <div className="mt-8 text-gray-600">
          {t("cant_find_reservation")}{" "}
          <button className="text-brand hover:underline">
            {t("help_center")}
          </button>
        </div>
      </main>

      {/* Edit Trip Modal */}
      {selectedTrip && (
        <EditTripModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          trip={selectedTrip}
          onSave={handleSaveChanges}
          onCancel={handleCancelTrip}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default TripsPage;
