# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview the production build locally

## Code Style Guidelines
- **Component Structure**: Use functional components with React hooks
- **Imports**: Group imports by type - React, libraries, components, assets
- **Naming**: PascalCase for components, camelCase for variables and functions
- **Styling**: Use Tailwind CSS for styling components
- **API Calls**: Use the API service files in src/api with try/catch error handling
- **Error Handling**: Log errors with console.error and throw for handling upstream
- **Environment Variables**: Access via import.meta.env.VITE_VARIABLE_NAME
- **State Management**: Use React hooks (useState, useEffect, useRef)
- **Conditional Rendering**: Use ternary operators or logical AND for simple conditionals
- **ESLint Rules**: Follow the configured rules in eslint.config.js

## Project Overview
Waureisen is a dog-friendly travel and accommodation booking platform. The application allows users to search for and book dog-friendly accommodations, providers to list and manage their properties, and administrators to oversee the entire platform.

## Tech Stack
- **Framework**: React 19
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Text Editor**: TipTap for rich text editing
- **Maps Integration**: Google Maps API

## Project Structure
- **src/main.jsx**: Application entry point
- **src/App.jsx**: Main router configuration
- **src/api/**: API service modules
- **src/components/**: Reusable UI components organized by section
- **src/pages/**: Page components organized by user role
- **src/assets/**: Images and static assets
- **src/utils/**: Helper functions and utilities
- **src/styles/**: Global CSS styles

## Key Features

### User Features
- Search for dog-friendly accommodations with filters
- View detailed accommodation listings
- Book accommodations
- User authentication (login/signup)
- User profile management
- Wishlist and favorites functionality
- Messaging system
- Booking management

### Provider Features
- Provider registration and dashboard
- Property listing creation and management
- Booking management
- Calendar management
- Analytics dashboard
- Earnings tracking
- Messaging with guests

### Admin Features
- Admin dashboard
- User and provider management
- Accommodation management
- Transaction monitoring
- Content management for travel magazine
- Filter management
- Voucher management

## Application Flow

1. **Home Page**: Displays hero section with search functionality, featured accommodations, site features, and traveler testimonials.

2. **Search Results**: Shows filtered accommodation listings with map view toggle and various filtering options.

3. **Accommodation Details**: Displays comprehensive information about a property including images, amenities, description, pricing, booking functionality, and host information.

4. **Authentication**: Supports user, provider, and admin login with different redirect flows.

5. **Provider Dashboard**: Complete provider management system with analytics, listing management, booking handling, and earnings tracking.

6. **Admin Dashboard**: Comprehensive admin tools for platform oversight and management.

## Component Organization
- **Shared Components**: Navbar, Footer, ImageGallery, etc.
- **HomeComponents**: Hero, Features, Recommendations, etc.
- **SearchComponents**: Filters, Map integration, etc.
- **Auth Components**: Login/Signup forms and modals
- **Admin Components**: Admin dashboard specific components
- **Provider Components**: Provider dashboard specific components

## Styling Approach
- Primary use of Tailwind CSS for styling
- Brand colors defined in tailwind.config.js (primary: #B4A481)
- Responsive design with mobile-first approach
- Consistent use of rounded corners, shadows, and spacing

## State Management
- Local component state with React hooks
- URL parameters for search and filter state
- Browser localStorage for authentication tokens

## API Integration
- Centralized API configuration with Axios
- Authentication token handling via interceptors
- API services organized by domain (auth, listings, etc.)
- Error handling with try/catch patterns

## Responsive Design
- Mobile-first approach with responsive breakpoints
- Different layouts for mobile, tablet, and desktop
- Conditional rendering for different screen sizes
- Mobile-specific UI elements (like the map toggle)

## Key Patterns
- Component composition for UI reusability
- Conditional rendering based on authentication state
- Form state management with controlled components
- Modal and popup implementations
- Google Maps integration for location search and display
- Handling image galleries and media