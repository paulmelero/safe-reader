import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  theme: {
    extend: {
      colors: {
        primary: colors.blue["500"],
        primaryHover: colors.blue["600"],
      },
    },
  },
} satisfies Config;
