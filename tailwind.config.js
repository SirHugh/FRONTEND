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
    fontFamily: {
      Poppins: "Poppins",
    },
    extend: {
      colors: {
        lightGray: "#D3D3D3",
        purple: "#6842EF",
      },
    },
    // screens: {
    //   xs: "480px",
    //   sm: "768px",
    //   md: "1060px",
    // },
  },
  plugins: ["tailwindcss: {}", "autoprefixer: {}", flowbite.plugin()],
};
