// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@vite-pwa/nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-i18n-micro",
  ],

  // GitHub Pages deployment configuration
  app: {
    baseURL: process.env.GITHUB_ACTIONS ? "/safe-reader/" : "/",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Safe Reader",
      short_name: "Safe Reader",
      description:
        "A secure way to view shared URLs (in a sandboxed iframe with no JS).",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: "safereader-192x192.png", // Removed leading slash for relative path
          sizes: "192x192",
          type: "image/png",
        },
      ],
      share_target: {
        action: "/",
        method: "GET",
        enctype: "application/x-www-form-urlencoded",
        params: {
          text: "text",
          url: "url",
        },
      },
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },

  i18n: {
    locales: [
      { code: "en", name: "English", iso: "en-US" },
      { code: "es", name: "Español", iso: "es-ES" },
    ],
    defaultLocale: "es",
  },
});
