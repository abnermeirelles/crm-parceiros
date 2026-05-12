import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202124",
        muted: "#667085",
        line: "#D7DDE5",
        brand: "#0F7C67",
        accent: "#D53F3F",
        amber: "#B7791F",
        panel: "#F6F8FA",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
