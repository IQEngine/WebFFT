/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or "media" or "class"
  theme: {
    extend: {
      fontFamily: {
        cyber: ["Orbitron", "sans-serif"],
      },
      colors: {
        "cyber-background1": "hsl(0, 0%, 5%)",
        "cyber-background2": "hsl(0, 0%, 11%)",
        "cyber-primary": "hsla(320, 80%, 50%, 0.8)",
        "cyber-secondary": "hsl(200, 100%, 50%, 0.75)",
        "cyber-accent": "hsla(100, 60%, 40%, 0.7)",
        "cyber-text": "hsla(0, 0%, 80%, 0.9)",
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
