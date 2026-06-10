/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Charpente sombre (slate béton)
        ink: {
          DEFAULT: "#1a1714",
          800: "#262220",
          700: "#332e2a",
        },
        // Accent ocre / brique (signature maçonnerie)
        clay: {
          50: "#fbf6ef",
          100: "#f5e9d7",
          200: "#ead0ad",
          300: "#ddb17e",
          400: "#d09356",
          500: "#c67c3a",
          600: "#b8662f",
          700: "#994f29",
          800: "#7c4127",
          900: "#663722",
        },
        sand: {
          50: "#faf8f5",
          100: "#f2ece4",
          200: "#e6dcce",
        },
      },
      fontFamily: {
        display: ['"Sora"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(26, 23, 20, 0.25)",
        card: "0 20px 50px -20px rgba(26, 23, 20, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards",
      },
    },
  },
  plugins: [],
};
