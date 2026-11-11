import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#141414",
        surface: "#1a1a19",
        ink: {
          DEFAULT: "#f0efec",
          secondary: "#c3c2b7",
          muted: "#898781",
        },
        grid: "#2c2c2a",
        baseline: "#383835",
        wine: "#8c2f39",
        gold: "#c9a96e",
        series: {
          blue: "#3987e5",
          orange: "#d95926",
          teal: "#199e70",
        },
        status: {
          ideal: "#0ca30c",
          atencao: "#fab219",
          baixo: "#ec835a",
          critico: "#d03b3b",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "sans-serif"],
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
