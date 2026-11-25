import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Acento principal del panel (botones, enlaces).
        brand: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        // Estados de monitoreo (coinciden con el wireframe).
        estado: {
          normal: "#22c55e",
          precaucion: "#f59e0b",
          critico: "#ef4444",
          sinsenal: "#94a3b8",
          sinviaje: "#64748b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
