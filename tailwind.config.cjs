/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F1FE',
          100: '#EAE4FC',
          200: '#D5C9FA',
          300: '#B7A2F6',
          400: '#9170F2',
          500: '#6D42EF',
          600: '#6338E8',
          700: '#5028CE',
          800: '#4222A8',
        },
        ink: {
          900: '#191627',
          700: '#3C3752',
          500: '#7B768F',
          400: '#9E99B0',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 22px -4px rgba(99, 56, 232, 0.06), 0 2px 6px -1px rgba(25, 22, 39, 0.03)',
        hero: '0 14px 28px -6px rgba(99, 56, 232, 0.34)',
        fab: '0 8px 20px -2px rgba(99, 56, 232, 0.45)',
        phone: '0 30px 70px -15px rgba(48, 28, 117, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.8)',
      },
    },
  },
  plugins: [],
};
