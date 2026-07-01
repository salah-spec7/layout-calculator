/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8', // Blue
        secondary: '#000000', // Black
        background: '#FFFFFF', // White
      }
    },
  },
  plugins: [],
};