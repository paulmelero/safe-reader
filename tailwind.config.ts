import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue-500
        primaryHover: '#2563eb', // blue-600
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
