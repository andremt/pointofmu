import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: "#ff3d8b",
        yellow: "#ffd60a",
        blue: "#2b4bff",
        paper: "#f7f4ed",
        cream: "#fbf8f1",
        ink: "#0e0e10",
        "ink-soft": "#3a3a3f",
        rule: "rgba(14,14,16,.12)",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Times New Roman", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
