import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Main/Home'
import SearchResults from './pages/Search/SearchResults'
import AccommodationPage from './pages/Accommodation/AccommodationPage'

function App() {
  return (
    <Router>
      <div className="bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/accommodation/:id" element={<AccommodationPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App