/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f172a",
        "surface-2": "#1e293b",
        brand: {
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};