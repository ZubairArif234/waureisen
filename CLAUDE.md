# Waureisen Frontend Documentation

## Project Overview
Waureisen is a vacation rental platform focused on dog-friendly accommodations. The application provides interfaces for three user types:
- **Customers**: Book accommodations with their dogs
- **Providers**: List and manage properties
- **Admins**: Oversee the platform and manage listings

## Tech Stack
- **Framework**: React (with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Rich Text Editing**: Tiptap
- **UI Components**: Custom components, Lucide icons
- **Maps Integration**: Google Maps (Places API)

## Key Features
1. **Multi-language Support**
   - English and German languages
   - Context-based translation system
   - Persistent language selection via localStorage

2. **Authentication System**
   - Separate flows for users, providers, and admins
   - JWT token-based authentication
   - Secure routes and API endpoints

3. **Accommodation Listings**
   - Comprehensive property information
   - Dog-specific amenities and features
   - Photo galleries
   - Location mapping via Google Maps
   - Detailed property policies

4. **Search System**
   - Location-based search with Google Places
   - Date range selection
   - Guest count (people and dogs)
   - Extensive filtering options
   - Map-based search results

5. **Booking System**
   - Date selection
   - Guest count configuration
   - Pricing display
   - Booking management for providers

6. **Provider Dashboard**
   - Listing creation and management
   - Booking oversight
   - Analytics and earnings tracking
   - Calendar management

7. **Admin Portal**
   - User management
   - Listing oversight
   - Content management
   - Transaction tracking

## Project Structure

### Core Directories
- **/src/api/** - API services for backend communication
- **/src/components/** - UI components grouped by function
- **/src/pages/** - Page components organized by user type
- **/src/utils/** - Utility functions and context providers
- **/src/assets/** - Static assets (images, etc.)

### Component Organization
- **/components/Admin/** - Admin-specific components
- **/components/Auth/** - Authentication components
- **/components/Footer/** - Footer-related page components
- **/components/HomeComponents/** - Home page components
- **/components/SearchComponents/** - Search functionality
- **/components/Shared/** - Shared UI elements
- **/components/UserComponents/** - User profile components

### Page Structure
- **/pages/Accommodation/** - Individual listing pages
- **/pages/Admin/** - Admin portal pages
- **/pages/Auth/** - Login/signup pages
- **/pages/Main/** - Main entry pages
- **/pages/Provider/** - Provider portal pages
- **/pages/Search/** - Search results pages
- **/pages/User/** - User profile and account pages

## API Structure
- **authAPI.js** - Authentication endpoints
- **listingAPI.js** - Listing and booking management
- **config.js** - API configuration with Axios

## Styling
- Tailwind CSS for utility-based styling
- Custom colors defined in tailwind.config.js
- Custom CSS files for specialized styling

## Important Development Notes
- The project uses environment variables for API configuration
- Provider and Admin dashboards share component architecture
- Google Maps integration requires API key configuration
- Multi-language support is managed through context API