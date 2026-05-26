/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "'SF Pro Display'", "'Helvetica Neue'", "sans-serif"],
        mono: ["'SF Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        glass: {
          bg: "#0a0f1e",
          deep: "#060b18",
          surface: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.10)",
          "border-bright": "rgba(255,255,255,0.18)",
          accent: "#3b82f6",
          "accent-bright": "#60a5fa",
          "accent-glow": "rgba(59,130,246,0.3)",
          text: "#f0f4ff",
          "text-dim": "rgba(240,244,255,0.55)",
          muted: "rgba(240,244,255,0.25)",
        },
      },
      backdropBlur: {
        glass: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-blue": "0 0 20px rgba(59,130,246,0.4)",
        "glow-sm": "0 0 10px rgba(59,130,246,0.2)",
      },
    },
  },
  plugins: [],
};
