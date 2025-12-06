import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito-sans)", "sans-serif"],
      },
      fontSize: {
        title: ["30px", { lineHeight: "1.2" }],
        subtitle: ["14px", { lineHeight: "1.5" }],
        textnormal: ["12px", { lineHeight: "1.5" }],
      },
      colors: {
        kai: {
          blue: "#0100F5",
          yellow: "#F5E455",
        },
      },
    },
  },
  plugins: [],
};

export default config;
