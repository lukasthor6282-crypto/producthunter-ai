/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "ui-monospace", "monospace"],
      },
      colors: {
        obsidian: "#07090F",
        ink: "#05070B",
        graphite: "#101720",
        glass: "rgba(255,255,255,0.07)",
        line: "rgba(255,255,255,0.12)",
        mist: "#94A3B8",
        electric: "#67E8F9",
        mint: "#5EF2B0",
        ember: "#F6B35B",
        violet: "#A78BFA",
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
