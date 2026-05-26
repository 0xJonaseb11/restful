/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#090a0f",
          surface: "rgba(17, 19, 29, 0.7)",
          "surface-hover": "rgba(25, 28, 44, 0.8)",
          primary: "#8b5cf6",
          secondary: "#ec4899",
        },
      },
      boxShadow: {
        premium: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
      },
    },
  },
  plugins: [],
}
