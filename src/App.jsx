import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./utils/SocketContext";
import Home from "./pages/Main/Home";
import SearchResults from "./pages/Search/SearchResults";
import AccommodationPage from "./pages/Accommodation/AccommodationPage";
import CamperRental from "./pages/Main/CamperRental";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Messages from "./pages/User/Messages";
import Profile from "./pages/User/Profile";
import WishlistHome from "./pages/User/WishlistHome";
import RecentlyViewed from "./pages/User/RecentlyViewed";
import YourFavorites from "./pages/User/YourFavorites";
import AccountPage from "./pages/User/AccountPage";
import LoginSecurityPage from "./pages/User/LoginSecurityPage";
import PaymentMethodsPage from "./pages/User/PaymentMethodsPage";
import TripsPage from "./pages/User/TripsPage";
import AdminLayout from "./pages/Main/Admin";
import FAQ from "./components/Footer/FAQ";
import ScrollToTop from "./components/Shared/ScrollToTop";
import AboutUs from "./components/Footer/AboutUs";
import Partners from "./components/Footer/Partners";
import Imprint from "./components/Footer/Imprint";
import StarMembership from "./components/Footer/StarMembership";
import HostRegistration from "./components/Footer/HostRegistration";
import TravelMagazine from "./components/Footer/TravelMagazine";
import ProviderLayout from "./pages/Main/Provider";
import TravelShop from "./components/Footer/TravelShop";
import TravelMagazineDetail from "./components/Footer/TravelMagazineDetail";
import CamperDetail from "./pages/Main/CamperDetail";
import Payment from "./pages/Stripe/Payment";
import ProtectedRoute from "./components/Shared/ProtectedRoute";

function App() {
  return (
    <Router>
      <SocketProvider>
        <ScrollToTop />
        <div className="bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/accommodation/:id" element={<AccommodationPage />} />
            <Route path="/camper-rental" element={<CamperRental />} />
            <Route path="/camper/:id" element={<CamperDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Payment requires authentication */}
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            {/* User Routes - Protected */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute allowedRoles={["user", "provider", "admin"]}>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "provider", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <WishlistHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist/recently-viewed"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <RecentlyViewed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist/favorites"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <YourFavorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/security"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <LoginSecurityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/payments"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <PaymentMethodsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <TripsPage />
                </ProtectedRoute>
              }
            />

            {/* Footer Routes */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/imprint" element={<Imprint />} />
            <Route path="/star-membership" element={<StarMembership />} />
            <Route path="/host" element={<HostRegistration />} />
            <Route path="/publicmagazine" element={<TravelMagazine />} />
            <Route path="/travelshop" element={<TravelShop />} />
            <Route path="/magazine/:id" element={<TravelMagazineDetail />} />

            {/* Admin Routes - Already protected in the AdminLayout component */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Provider Routes - Already protected in the ProviderLayout component */}
            <Route path="/provider/*" element={<ProviderLayout />} />
          </Routes>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App;
