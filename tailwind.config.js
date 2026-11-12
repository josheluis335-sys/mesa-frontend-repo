/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          100: '#000000',
          200: '#1a1a1a',
          300: '#333333',
          400: '#4d4d4d',
          500: '#666666',
          600: '#808080',
          700: '#999999',
          800: '#b3b3b3',
          800: '#b3b3b3',
          900: '#cccccc',
          950: '#e6e6e6',
          white: '#ffffff',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
