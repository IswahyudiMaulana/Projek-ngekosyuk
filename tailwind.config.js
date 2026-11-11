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
          DEFAULT: '#244C3B',
          50: '#E8F0ED',
          100: '#C5D9CF',
          200: '#9EC0B0',
          300: '#77A791',
          400: '#57917A',
          500: '#244C3B',
          600: '#1E4232',
          700: '#183628',
          800: '#112A1E',
          900: '#091C13',
        },
        secondary: '#A8B9A0',
        accent: '#C58B70',
        background: '#F8F8F4',
        card: '#FFFFFF',
        'primary-text': '#292D2A',
        'secondary-text': '#777D78',
        border: '#E7E9E5',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'hover': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
