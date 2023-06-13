module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /bg-(00101|00102|00103|00104|texture-green|texture-purple|texture-yellow|texture-pink)/,
    },
  ],
  theme: {
    extend: {
      borderRadius: {},
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "1rem", // 16px
        md: "1.25rem", // 20px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
        "2xl": "2.5rem", // 40px
        "3xl": "80px",
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
          light: "#F1EACF",
          medium: "#e5d9b6",
          dark: "#b8ae91",
        },
        pink: "#e8ada4",
        purple: "#9b85ff",
        yellow: "#edbd56",
      },
      backgroundImage: {
        dotted: "url('/src/assets/dot.png')",
        signboard: "url('/src/assets/images/common/texture-signboard.png')",
        dig: "url('/game/background/dig.png')",
        "00101": "url('/game/background/00101.png')",
        "00102": "url('/game/background/00102.png')",
        "00103": "url('/game/background/00103.png')",
        "00104": "url('/game/background/00104.png')",
        "texture-green": "url('/game/background/green.jpg')",
        "texture-purple": "url('/game/background/purple.jpg')",
        "texture-yellow": "url('/game/background/yellow.jpg')",
        "texture-pink": "url('/game/background/pink.jpg')",
      },
      backgroundSize: {
        "width-full": "100% auto",
      },
    },
  },
  plugins: [],
};
