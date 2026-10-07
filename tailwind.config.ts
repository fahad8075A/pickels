import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#063D29",
          dark: "#0B4A32",
          primary: "#174E37",
          cream: "#FFF9EC",
          ivory: "#F8F1DF",
          botanical: "#EFF1DC",
          gold: "#F5B82E",
          brown: "#76512E",
          text: "#163D2D",
          muted: "#68786B",
          border: "#E9E2CE",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
