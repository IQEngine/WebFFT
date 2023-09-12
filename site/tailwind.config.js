/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "cyber-background1": "#0d0d0d",
        "cyber-background2": "#1c1c1c",
        "cyber-primary": "#ff2fc2",
        "cyber-secondary": "#1c8fff",
        "cyber-accent": "#22ff44",
        "cyber-text": "#e0e0e0",
      },
      backgroundImage: (theme) => ({
        "cyber-gradient": `linear-gradient(45deg, ${theme("colors.cyber-background1")} 60%, ${theme(
          "colors.cyber-primary"
        )})`,
      }),
    },
  },
  plugins: [],
};
