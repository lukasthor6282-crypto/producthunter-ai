/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "ui-monospace", "monospace"],
      },
      colors: {
        obsidian: "#07090d",
        ink: "#05070b",
        graphite: "#10141b",
        glass: "rgba(255,255,255,0.07)",
        line: "rgba(255,255,255,0.12)",
        mist: "#9aa4b2",
        electric: "#62e6ff",
        mint: "#65f0b7",
        ember: "#f8b85c",
        violet: "#8b5cf6",
      },
      boxShadow: {
        glow: "0 0 34px rgba(98, 230, 255, 0.18)",
        card: "0 22px 80px rgba(0, 0, 0, 0.42)",
        premium: "0 24px 110px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
