const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}",
    "./pages/**/*.{html,js}",
    "./components/**/*.{html,js}",
    flowbite.content(),
  ],

  theme: {
    extend: {},
  },
  plugins: ["tailwindcss: {}", "autoprefixer: {}", flowbite.plugin()],
};
