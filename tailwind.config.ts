import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas-bg)",
        surface: {
          "0": "var(--surface-0)",
          "1": "var(--surface-1)",
          "2": "var(--surface-2)",
          "3": "var(--surface-3)",
          "4": "var(--surface-4)",
        },
        "border-subtle": "var(--border-subtle)",
        "border-default": "var(--border-default)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "node-source": "var(--node-source)",
        "node-transform": "var(--node-transform)",
        "node-ai": "var(--node-ai)",
        "node-output": "var(--node-output)",
        "node-preview": "var(--node-preview)",
        "port-string": "var(--port-string)",
        "port-number": "var(--port-number)",
        "port-boolean": "var(--port-boolean)",
        "port-json": "var(--port-json)",
        "port-array": "var(--port-array)",
        "port-binary": "var(--port-binary)",
        "port-any": "var(--port-any)",
      },
      animation: {
        "flow-dash": "flow-dash 1.5s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
      keyframes: {
        "flow-dash": {
          to: { strokeDashoffset: "-24" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
