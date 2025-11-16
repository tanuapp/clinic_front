/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{css,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": {
          50:  "#e8f1ff",
          100: "#cfe3ff",
          200: "#a0c5ff",
          300: "#70a6ff",
          400: "#4188ff",
          500: "#0a6aff",   // ring-brand-blue-500 
          600: "#0055d6",
          700: "#0042a3",
          800: "#002e70",
          900: "#001b3d",
        },

        "brand-green": {
          50:  "#e9f8f1",
          100: "#c8efd9",
          200: "#91e0b9",
          300: "#5ad199",
          400: "#23c279",
          500: "#00b35d",
          600: "#009349",
          700: "#007335",
          800: "#005421",
          900: "#00340d",
        },
      },
    },
  },
  plugins: [],
};