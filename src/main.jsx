import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/googlePlaces.css' // Import Google Places styles
import App from './App.jsx'
import { LanguageProvider } from './utils/LanguageContext'
import { isAuthenticated } from './utils/authService'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: '',
        style: {
          padding: '0',
          margin: '0',
        },
        success: {
          className: '!pl-4',
          icon: null,
        },
        error: {
          className: '!pl-4',
          icon: null,
        },
      }}
    />
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)