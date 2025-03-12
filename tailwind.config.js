/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 20s linear infinite',
        },
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
        },
        colors: {
          'brand': '#B4A481',
          'gray': {
            500: '#767676',
            // ... other gray values
          }
        }
      },
    },
    plugins: [],
    darkMode: 'media'
  }