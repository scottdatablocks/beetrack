/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef8e7',
          100: '#fcefc3',
          200: '#fae59b',
          300: '#f8db73',
          400: '#f6d154',
          500: '#f4c734', // BeeTrack yellow
          600: '#f2bf2f',
          700: '#f0b527',
          800: '#eeab21',
          900: '#ea9b15',
        },
      },
    },
  },
  plugins: [],
}
