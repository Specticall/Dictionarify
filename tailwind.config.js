/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        title: "3rem",
        heading: "1.25rem",
        body: "0.875rem",
      },
      colors: {
        accent: "#0038FF",
        main: "#000000",
        "main-light": "#1C1C1C",
        light: "#767676",
        lighter: "#EFEAE4",
        bg: "#FFFDFB",
        border: "#CECECE",
      },
    },
    screens: {
      "2xl": { max: "1500px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1200px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "900px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "720px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "500px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
};
