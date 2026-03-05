/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Secular One", "Rubik", "sans-serif"],
        sans: ["Rubik", "sans-serif"],
      },
      colors: {
        wolt: {
          blue: "#009DE0",
          dark: "#1B1B1F",
          surface: "#FFFFFF",
          bg: "#F4F4F4",
          orange: "#F5A623",
          red: "#E8222E",
          green: "#1DB954",
          muted: "#6B7280",
        },
        oref: {
          orange: "#E8922A",
          blue: "#1B4F72",
          "blue-light": "#5B9BD5",
          dark: "#2C3E50",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.08)",
        nav: "0 -1px 12px rgba(0,0,0,0.08)",
        alert: "0 8px 32px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};
