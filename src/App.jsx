import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Main/Home'
import SearchResults from './pages/Search/SearchResults'
import AccommodationPage from './pages/Accommodation/AccommodationPage'
import CamperRental from './pages/Main/CamperRental'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Messages from './pages/User/Messages'
import Profile from './pages/User/Profile'
import WishlistHome from './pages/User/WishlistHome'
import RecentlyViewed from './pages/User/RecentlyViewed'
import YourFavorites from './pages/User/YourFavorites'
import AccountPage from './pages/User/AccountPage'
import LoginSecurityPage from './pages/User/LoginSecurityPage'
import PaymentMethodsPage from './pages/User/PaymentMethodsPage'
import TripsPage from './pages/User/TripsPage'
import AdminLayout from './pages/Main/Admin'
import FAQ from './components/Footer/FAQ'
import ScrollToTop from './components/Shared/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/accommodation/:id" element={<AccommodationPage />} />
          <Route path="/camper-rental" element={<CamperRental />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishlistHome />} />
          <Route path="/wishlist/recently-viewed" element={<RecentlyViewed />} />
          <Route path="/wishlist/favorites" element={<YourFavorites />} />
          <Route path="/account" element={<AccountPage/>} />
          <Route path="/account/security" element={<LoginSecurityPage/>} />
          <Route path="/account/payments" element={<PaymentMethodsPage/>} />
          <Route path="/trips" element={<TripsPage/>} />


          {/* FAQ Route */}
          <Route path="/faq" element={<FAQ />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App