/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        soil: {
          DEFAULT: "#3E2F23",
          light: "#6B5540",
          dark: "#26201A",
        },
        maize: {
          DEFAULT: "#E4A73B",
          dark: "#C78A24",
          light: "#F3D998",
        },
        leaf: {
          DEFAULT: "#2F5D3A",
          light: "#4C7C56",
          dark: "#1F3F27",
        },
        sky: {
          DEFAULT: "#3E7C93",
          light: "#6FA6BA",
        },
        clay: {
          DEFAULT: "#A8542F",
          light: "#C97E57",
        },
        paper: {
          DEFAULT: "#F7F3E9",
          deep: "#EFE8D8",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        data: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 14px rgba(62, 47, 35, 0.08)",
        lift: "0 8px 28px rgba(62, 47, 35, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
