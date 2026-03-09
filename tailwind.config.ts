import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  darkMode: ["selector", "[data-theme=dark]"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // blue-500
        primaryHover: "#2563eb", // blue-600
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#3b82f6", // blue-500
          "primary-content": "#ffffff",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3b82f6", // blue-500
          "primary-content": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
