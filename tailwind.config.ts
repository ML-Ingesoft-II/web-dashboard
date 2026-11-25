import type { Config } from "tailwindcss";

/**
 * Colores del sistema de diseño Tire (tema oscuro). Los valores viven como
 * variables CSS en src/app/globals.css; aquí solo se les da un nombre de clase
 * (por ejemplo `bg-surface`, `text-fg-muted`, `border-border`).
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        border: "var(--border)",
        fg: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-secondary)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          text: "var(--primary-text)",
          border: "var(--primary-border)",
        },
        "on-primary": "var(--on-primary)",
        normal: "var(--status-normal)",
        warning: "var(--status-warning)",
        critical: {
          DEFAULT: "var(--status-critical-text)",
          bg: "var(--status-critical-bg)",
        },
        "on-critical": {
          DEFAULT: "var(--on-critical)",
          muted: "var(--on-critical-muted)",
        },
        offline: "var(--status-offline)",
        // Etiquetas de estado del panel web (tono suave sobre fondo oscuro).
        tag: {
          "normal-fg": "var(--tag-normal-fg)",
          "normal-bg": "var(--tag-normal-bg)",
          "warning-fg": "var(--tag-warning-fg)",
          "warning-bg": "var(--tag-warning-bg)",
          "critical-fg": "var(--tag-critical-fg)",
          "critical-bg": "var(--tag-critical-bg)",
          "offline-fg": "var(--tag-offline-fg)",
          "offline-bg": "var(--tag-offline-bg)",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "system-ui", "sans-serif"],
      },
      borderRadius: {
        control: "12px",
        card: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
