import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffe7ec",
          200: "#ffcfdc",
          300: "#f7aebe"
        },
        skysoft: {
          50: "#f4fbff",
          100: "#dff3ff",
          200: "#bee6fb",
          300: "#93d3f1"
        },
        cream: "#FFF7EA",
        navy: "#1E2A44",
        ink: "#283653",
        cherry: "#E94D5F",
        butter: "#FFE08A"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 35, 60, 0.12)",
        blush: "0 16px 40px rgba(247, 174, 190, 0.22)"
      },
      borderRadius: {
        soft: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
