/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#12181f",
          secondary: "#00f6ff",
          dimWhite: "#c2c2cc",
          dimBlue: "rgba(9, 151, 124, 0.1)",
          gray: { 100: "#808080", 200: "#323232", 300: "#212121" },
          white: "#fff",
          cyan: "#14ffec",
          red: "#d6436e",
          green: "#25da72",
          mycolor: "#3c5b8038",
          cards: "#1f2942",
          energybar: "#32374e",
          btn: "#0b62c4",
          btn2: "#0b62c421",
          borders: "#2e3a56",
          borders2: "#3d4a68",
          activeborder: "#0569aa",
          activebg: "#17436e",
        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
          Inter: ["'Inter', sans-serif"],
          outfit: ["'Outfit', sans-serif"],
          RobotoMono: ["'Roboto Mono', monospace"],
          PublicSans: ["'Public Sans', sans-serif"],
          Monserrat: ["'Montserrat', sans-serif"],
          Syne: ["'Syne', sans-serif"],
          Orkney: ["'Orkney', sans-serif"],
          Cerebri: ["'Cerebri Sans', sans-serif"]
        },
      },
      screens: {
        xs: "480px",
        ss: "600px",
        sm: "768px",
        ms: "1024px",
        md: "1140px",
        lg: "1200px",
        xl: "1700px",
      },
    },
    plugins: [require('tailwindcss')],
  };
  