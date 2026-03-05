/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        oref: {
          orange: "#E8922A",
          blue: "#1B4F72",
          "blue-light": "#5B9BD5",
          dark: "#2C3E50",
        },
      },
    },
  },
  plugins: [],
};
