module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {},
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "1rem", // 16px
        md: "1.25rem", // 20px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        xxl: "2.5rem", // 40px
        "2xl": "80px",
      },
      fontFamily: {
        base: "Quicksand",
        title: "Apfel Grotezk",
        "hand-written": "Belle Allure CE",
      },
      colors: {
        primary: "#4d6b36", // Green
        secondary: "#edbd56", // Yellow
        green: {
          DEFAULT: "#4d6b36",
          medium: "#85a754",
          light: "#e3f0a5",
        },
        red: "#fb6f4a",
        blue: "#2BD885",
        beige: {
          DEFAULT: "#fefbe9",
          medium: "#e5d9b6",
          dark: "#b8ae91",
        },
        pink: "#e8ada4",
        purple: "#9b85ff",
        yellow: "#edbd56",
      },
    },
  },
  plugins: [],
};
