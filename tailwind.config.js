let safe = [];

//safelist.push('bg-00101', 'bg-00102', 'bg-00103', 'bg-00104');
for (let i = 1; i < 13; i++) {
  safe.push(`grid-cols-${i}`);
}

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
   safelist: [
     {
       pattern: /bg-(00101|00102|00103|00104)/,
     },
     ...safe
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
        background: "var(--color-background)",
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
        texture: "url('/src/assets/images/common/texture-bg.png')",
        dig: "url('/src/assets/game-data/background/dig.png')",
        "00101": "url('/src/assets/game-data/background/00101.png')",
        "00102": "url('/src/assets/game-data/background/00102.png')",
        "00103": "url('/src/assets/game-data/background/00103.png')",
        "00104": "url('/src/assets/game-data/background/00104.png')",
      },
      backgroundSize: {
        'width-full': '100% auto'
      }
    },
  },
  plugins: [],
};
