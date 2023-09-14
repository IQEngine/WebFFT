/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        cyber: ["Orbitron", "system-ui", "sans-serif"],
        system: ["Segoe UI", "system-ui", "sans-serif"],
      },
      colors: {
        "cyber-background1": "hsl(0, 0%, 5%)",
        "cyber-background2": "hsl(0, 0%, 11%)",
        "cyber-primary": "hsla(320, 80%, 50%, 0.8)",
        "cyber-secondary": "hsl(200, 100%, 50%, 0.75)",
        "cyber-accent": "hsla(100, 60%, 40%, 0.7)",
        "cyber-text": "hsla(0, 0%, 80%, 0.9)",
        "cyber-text-secondary": "hsla(50, 100%, 60%, 0.75)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
