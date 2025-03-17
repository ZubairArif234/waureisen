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


function App() {
  return (
    <Router>
      <div className="bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/accommodation/:id" element={<AccommodationPage />} />
          <Route path="/camper-rental" element={<CamperRental />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishlistHome />} />
          <Route path="/wishlist/recently-viewed" element={<RecentlyViewed />} />
          <Route path="/wishlist/favorites" element={<YourFavorites />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App