import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#fff8f7",
        blush: "#ffe7ec",
        rose: "#da3a6c",
        roseDark: "#bd2858",
        moss: "#4f6358",
        clay: "#aa6c4d",
        smoke: "#f1efea"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(23, 23, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
