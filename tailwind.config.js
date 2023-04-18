module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {},
      borderRadius: {},
      fontSize: {
        xs: "12px",
        sm: "14px",
        md: "20px",
        lg: "24px",
        xl: "32px",
        xxl: "40px",
      },
      fontFamily: {
        base: "Quicksand",
        title: "Apfel Grotezk",
        handwritten: "Belle Allure CE",
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
        blue: "#85a754",
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
