module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        abyss: "#0a0f1e",
        midnight: "#0f172a",
        tide: "#082f49",
        glow: "#22d3ee",
        ember: "#f59e0b"
      },
      fontFamily: {
        display: ["Garamond", "Palatino Linotype", "Book Antiqua", "serif"],
        sans: ["Trebuchet MS", "Verdana", "sans-serif"]
      }
    }
  },
  plugins: []
};
