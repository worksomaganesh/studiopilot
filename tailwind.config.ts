import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/brands/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          subtle: "hsl(var(--surface-subtle))",
          elevated: "hsl(var(--surface-elevated))",
          border: "hsl(var(--surface-border))",
        },
        brand: {
          tes: {
            primary: "#FFD400",
            dark: "#080808",
            surface: "#141414",
            accent: "#FFE14D",
          },
          atw: {
            primary: "#FF5722",
            navy: "#111827",
            warmWhite: "#F5F3EE",
            peach: "#FFB088",
          },
          ca: {
            primary: "#7657FF",
            midnight: "#151426",
            lavender: "#EDE9FF",
            icyBlue: "#8DDCFF",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
