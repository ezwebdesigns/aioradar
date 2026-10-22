/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0A1931', // A deep blue/navy base color
        'secondary-blue': '#4a90e2', // Accent color for interactivity
        'background-start': '#0a1638', // Dark background start
        'background-end': '#1c2b57',   // Dark background end
        'text-light': '#E0E0FF',       // Light text color
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(to bottom right, #0a1638, #1c2b57)', // Custom gradient class
      },
      borderRadius: {
        'pill': '9999px', // For the pill shapes
      }
    },
  },
  plugins: [],
};