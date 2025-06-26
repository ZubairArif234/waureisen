import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Dog,
  Edit,
  X,
  AlertTriangle,
  ArrowLeft,
  UsersRound,
} from "lucide-react";
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
import toast from "react-hot-toast";
import { changeMetaData } from "../../utils/extra";

// Edit Trip Modal Component
const EditTripModal = ({ isOpen, onClose, trip, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // Parse the trip dates to create a date range
  const parseDates = (dateString) => {
    try {
      if (!dateString.includes("-")) {
        return {
          start: new Date(),
          end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        };
      }

      const [startStr, endStr] = dateString.split("-").map((d) => d.trim());

      const parseDate = (str) => {
        if (!str) return new Date();

        const directParse = new Date(str);
        if (!isNaN(directParse.getTime())) {
          return directParse;
        }

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

  const [dateRange, setDateRange] = useState(parseDates(trip.dates));
  const [guests, setGuests] = useState(() => {
    const [people, dogs] = trip.guests
      .split(",")
      .map((s) => parseInt(s.trim().split(" ")[0]));
    return { people, dogs };
  });

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
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{t("edit_trip")}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-lg">{trip.location}</h3>
            <p className="text-gray-600">{trip.address}</p>
          </div>

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

      <GuestSelector
        isOpen={isGuestSelectorOpen}
        onClose={() => setIsGuestSelectorOpen(false)}
        guests={guests}
        onGuestsChange={setGuests}
      />
    </>
  );
};

// TripCard Component
const TripCard = ({ trip, onEdit, handleGetMyBooking }) => {
  const [activeModal, setActiveModal] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const start = moment(trip?.checkInDate);
  const end = moment(trip?.checkOutDate);
  const currentDate = moment().startOf("day");
  const checkInDate = moment(trip?.checkInDate).startOf("day");
  const checkOutDate = moment(trip?.checkOutDate).startOf("day");

  const formattedDate = `${start.format("MMM D")}-${end.format("D, YYYY")}`;

  const canBeCanceled = () => {
    if (trip.status === "canceled") return false;
    const daysUntilCheckIn = checkInDate.diff(currentDate, "days");
    const isInProgress =
      checkInDate.isSameOrBefore(currentDate) &&
      checkOutDate.isAfter(currentDate);
    return daysUntilCheckIn >= 1 && !isInProgress;
  };

  const getDisplayStatus = () => {
    if (trip.status === "canceled") {
      return t("cancelled");
    }

    if (trip.status === "pending") {
      return t("awaiting_confirmation") || "Awaiting Provider Confirmation";
    }

    if (trip.status === "confirmed") {
      if (checkOutDate.isBefore(currentDate)) {
        return t("completed");
      }

      if (
        checkInDate.isSameOrBefore(currentDate) &&
        checkOutDate.isAfter(currentDate)
      ) {
        return t("in_progress") || "In Progress";
      }

      return t("confirmed_by_provider") || "Confirmed by Provider";
    }

    return t("upcoming");
  };

  const getStatusColorClass = () => {
    if (trip.status === "canceled") return "text-red-500";
    if (trip.status === "pending") return "text-yellow-600";

    if (trip.status === "confirmed") {
      if (checkOutDate.isBefore(currentDate)) return "text-green-500";
      if (
        checkInDate.isSameOrBefore(currentDate) &&
        checkOutDate.isAfter(currentDate)
      )
        return "text-blue-500";
      return "text-green-600";
    }

    return "text-brand";
  };

  const handleCancelBooking = async () => {
    try {
      const res = await refundPayment(trip?._id);
      console.log(res);
      if (res?.success) handleGetMyBooking();
      toast.success(t("cancel_success"));
    } catch (err) {
      console.log(err);

      toast.error(t("cancel_failed"));
    }
  };

  const handleOpenModal = () => {
    setActiveModal(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
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

                {canBeCanceled() && (
                  <button
                    onClick={handleOpenModal}
                    className="px-4 z-20 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
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

              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center gap-2 text-gray-600">
                  <UsersRound className="w-5 h-5" />
                  <span className="capitalize">
                    {trip?.capacity?.people} {t("guests")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Dog className="w-5 h-5" />
                  <span className="capitalize">
                    {trip?.capacity?.dogs} {t("dogs")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              <div className="text-gray-600">
                {t("host")}{" "}
                <span className="font-medium">{trip.listing?.provider}</span>
              </div>
              <div className={`font-medium ${getStatusColorClass()}`}>
                {getDisplayStatus()}
              </div>
            </div>

            {trip.status === "pending" && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-700">
                    {t("waiting_provider_response") ||
                      "Waiting for provider response"}
                  </span>
                </div>
              </div>
            )}

            {trip.status === "confirmed" &&
              checkInDate.isAfter(currentDate) && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700">
                      {t("booking_confirmed") ||
                        "Booking confirmed by provider"}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <CancelBookingModal
        isOpen={activeModal}
        onClose={() => setActiveModal(false)}
        title={t("cancel_booking")}
        onConfirm={handleCancelBooking}
      >
        <p className="text-center">{t("are_you_sure")}</p>
      </CancelBookingModal>
    </div>
  );
};

// NoTrips Component
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

// Success Message Component
const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

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

const SuccessBooking = ({ message, onClose }) => {
  const { t } = useLanguage();
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onClose();
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg border border-green-200 flex items-center justify-between max-w-md">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600"
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
        <p>
          <p className="text-lg font-semibold text-center">
            {t("booking_created")}
          </p>
          <p className="text-slate-600 text-center">
            {t("booking_created_msg")}
          </p>
        </p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 ml-4 text-gray-500 hover:text-gray-800"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

// Main TripsPage Component
const TripsPage = () => {
  const { t } = useLanguage();
  const [isBookingModal, seIsBookingModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [trips, setTrips] = useState();
  const [tripsLoading, setTripsLoading] = useState();

  // State variables for trip categorization
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [inProgressTrips, setInProgressTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [cancelledTrips, setCancelledTrips] = useState([]);

  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
  const [currentInProgressPage, setCurrentInProgressPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [currentCanceledPage, setCurrentCanceledPage] = useState(1);

  const itemPerPage = 5;

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  const booking = params.get("booking");
  console.log(booking);

  useEffect(() => {
    if (booking == "true") {
      seIsBookingModal(true);
    }
  }, [booking]);

  useEffect(() => {
    changeMetaData("Trips - Waureisen");
  }, []);

  const handleGetMyBooking = async () => {
    setTripsLoading(true);
    const res = await getMyBooking();
    setTrips(res);
    setTripsLoading(false);
  };

  useEffect(() => {
    handleGetMyBooking();
  }, []);

  const handlePageChange = (page, type) => {
    if (type === "upcoming") {
      setCurrentUpcomingPage(page);
    } else if (type === "inprogress") {
      setCurrentInProgressPage(page);
    } else if (type === "completed") {
      setCurrentCompletedPage(page);
    } else if (type === "canceled") {
      setCurrentCanceledPage(page);
    }
  };

  // Trip categorization useEffect
  useEffect(() => {
    const startUpcoming = (currentUpcomingPage - 1) * itemPerPage;
    const endUpcoming = startUpcoming + itemPerPage;

    const startInProgress = (currentInProgressPage - 1) * itemPerPage;
    const endInProgress = startInProgress + itemPerPage;

    const startCompleted = (currentCompletedPage - 1) * itemPerPage;
    const endCompleted = startCompleted + itemPerPage;

    const startCanceled = (currentCanceledPage - 1) * itemPerPage;
    const endCanceled = startCanceled + itemPerPage;

    if (trips) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Upcoming: check-in date is in the future
      const upcomingTripsFiltered = trips.filter((trip) => {
        const checkInDate = new Date(trip.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
        return trip.status !== "canceled" && checkInDate > currentDate;
      });

      // In Progress: check-in date has passed, but check-out date hasn't
      const inProgressTripsFiltered = trips.filter((trip) => {
        const checkInDate = new Date(trip.checkInDate);
        const checkOutDate = new Date(trip.checkOutDate);
        checkInDate.setHours(0, 0, 0, 0);
        checkOutDate.setHours(23, 59, 59, 999);

        return (
          trip.status !== "canceled" &&
          checkInDate <= currentDate &&
          checkOutDate >= currentDate
        );
      });

      // Completed: check-out date has passed
      const completedTripsFiltered = trips.filter((trip) => {
        const checkOutDate = new Date(trip.checkOutDate);
        checkOutDate.setHours(23, 59, 59, 999);
        return trip.status !== "canceled" && checkOutDate < currentDate;
      });

      // Canceled: status is canceled
      const canceledTripsFiltered = trips.filter((trip) => {
        return trip.status === "canceled";
      });

      // Apply pagination
      setUpcomingTrips(upcomingTripsFiltered.slice(startUpcoming, endUpcoming));
      setInProgressTrips(
        inProgressTripsFiltered.slice(startInProgress, endInProgress)
      );
      setCompletedTrips(
        completedTripsFiltered.slice(startCompleted, endCompleted)
      );
      setCancelledTrips(
        canceledTripsFiltered.slice(startCanceled, endCanceled)
      );
    }
  }, [
    currentUpcomingPage,
    currentInProgressPage,
    currentCompletedPage,
    currentCanceledPage,
    trips,
  ]);

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

  // Render loading state
  if (tripsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
          <div className="flex justify-center items-center mt-20 py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-brand rounded-full animate-spin mb-4"></div>
          </div>
        </main>
      </div>
    );
  }

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
            {trips?.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <span>{t("cant_find_reservation")}</span>
                <a
                  href="mailto:hallo@waureisen.com"
                  className="text-[rgb(180,164,129)] hover:underline font-medium"
                >
                  {t("contact_us_email")}
                </a>
              </div>
            )}
          </div>
        </div>

        {trips?.length === 0 ? (
          <NoTrips />
        ) : (
          <div className="space-y-12">
            {/* In Progress Trips */}
            {inProgressTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("in_progress_trips") || "In Progress Trips"}
                </h2>
                <div className="space-y-4">
                  {inProgressTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onEdit={handleEditTrip}
                      handleGetMyBooking={handleGetMyBooking}
                    />
                  ))}
                </div>
                {/* <div className="flex justify-end">
      <Pagination
        type="inprogress"
        currentPage={currentInProgressPage}
        totalPages={Math.ceil(
          trips?.filter(trip => {
            const checkInDate = new Date(trip.checkInDate);
            const checkOutDate = new Date(trip.checkOutDate);
            const currentDate = new Date();
            checkInDate.setHours(0, 0, 0, 0);
            checkOutDate.setHours(23, 59, 59, 999);
            currentDate.setHours(0, 0, 0, 0);
            return trip.status !== "canceled" && 
                   checkInDate <= currentDate && 
                   checkOutDate >= currentDate;
          })?.length / itemPerPage
        )}
        onPageChange={handlePageChange}
      />
    </div> */}
              </div>
            )}
            {/* Upcoming Trips */}
            {upcomingTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("upcoming_trips")}
                </h2>
                <div className="space-y-4">
                  {upcomingTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onEdit={handleEditTrip}
                      handleGetMyBooking={handleGetMyBooking}
                    />
                  ))}
                </div>
                {/* <div className="flex justify-end">
                  <Pagination
                    type="upcoming"
                    currentPage={currentUpcomingPage}
                    totalPages={Math.ceil(
                      trips?.filter(trip => {
                        const checkOutDate = new Date(trip.checkOutDate);
                        const currentDate = new Date();
                        checkOutDate.setHours(23, 59, 59, 999);
                        currentDate.setHours(0, 0, 0, 0);
                        return trip.status !== "canceled" && checkOutDate < currentDate;
                      })?.length / itemPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                </div> */}
              </div>
            )}

            {/* Completed Trips */}
            {completedTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("completed_trips") || "Completed Trips"}
                </h2>
                <div className="space-y-4">
                  {completedTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onEdit={handleEditTrip}
                      handleGetMyBooking={handleGetMyBooking}
                    />
                  ))}
                </div>
                {/* <div className="flex justify-end">
     <Pagination
       type="completed"
       currentPage={currentCompletedPage}
       totalPages={Math.ceil(
         trips?.filter(trip => {
           const checkOutDate = new Date(trip.checkOutDate);
           const currentDate = new Date();
           checkOutDate.setHours(23, 59, 59, 999);
           currentDate.setHours(0, 0, 0, 0);
           return trip.status !== "canceled" && checkOutDate < currentDate;
         })?.length / itemPerPage
       )}
       onPageChange={handlePageChange}
     />
   </div> */}
              </div>
            )}

            {/* Cancelled Trips */}
            {cancelledTrips?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("cancelled_trips")}
                </h2>
                <div className="space-y-4">
                  {cancelledTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onEdit={handleEditTrip}
                      handleGetMyBooking={handleGetMyBooking}
                    />
                  ))}
                </div>
                {/* <div className="flex justify-end">
                  <Pagination
                    type="canceled"
                    currentPage={currentCanceledPage}
                    totalPages={Math.ceil(
                      trips?.filter(trip => trip.status === "canceled")?.length / itemPerPage
                    )}
                    onPageChange={handlePageChange}
                  />
                </div> */}
              </div>
            )}
          </div>
        )}
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
      {/* Success Booking */}
      {isBookingModal && (
        <SuccessBooking
          message={""}
          onClose={() => {
            seIsBookingModal(false);
            location.replace("/trips");
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default TripsPage;
