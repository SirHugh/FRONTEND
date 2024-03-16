/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  "./src/**/*.{html,js}",
  './pages/**/*.{html,js}',
  './components/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: ['tailwindcss: {}',
    'autoprefixer: {}'],
}