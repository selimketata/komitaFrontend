/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/swiper/**/*.js",
  ],
  theme: {
    screens: {
      'xxs': '280px', 
      'xs': '450px',
      'xsx': '500px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

     },
    extend: {
      fontFamily:{
        abc:["Calibri", "Candara", "Segoe"],
        alexBrush: ["Alex Brush", "cursive"],
        poppins: ["Poppins", "sans-serif"],
        calibri: ["Calibri", "sans-serif"],
      },        
      colors: {
        DarkBlue: "#142237",
        gray: '#A8ADB4',
        red: '#E5181D',
        transparent: 'transparent',
        current: 'currentColor',
        white: '#ffffff',
        tahiti: {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
    },
  },
  plugins: [],
}
