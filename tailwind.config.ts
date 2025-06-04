import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sunrise: "#F9A826",
        skyBlue: "#62B6CB",
        deepNavy: "#0B132B",
        softCream: "#FAF3E0",
        mistGrey: "#D9D9D9",
      },
      fontFamily: {
        'heading': ["var(--font-poppins)", "sans-serif"],
        'body': ["var(--font-lora)", "serif"],
        'poppins': ["var(--font-poppins)", "sans-serif"],
        'lora': ["var(--font-lora)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config; 