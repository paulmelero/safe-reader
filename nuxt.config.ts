import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    port: 3033,
  },

  features: {
    inlineStyles: true,
  },

  nitro: {
    preset: 'cloudflare_module',
    prerender: {
      autoSubfolderIndex: false,
    },
    alias: {
      canvas: fileURLToPath(
        new URL('./server/mocks/canvas.ts', import.meta.url),
      ),
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    serveStatic: false,
  },

  runtimeConfig: {
    public: {
      APP_NAME: 'SAFEReader',
      APP_URL: '',
    },
  },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    'nuxt-i18n-micro',
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Safe Reader',
      short_name: 'Safe Reader',
      description:
        'A secure way to view shared URLs (in a sandboxed iframe with no JS).',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: 'safereader-192x192.png', // Removed leading slash for relative path
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'safereader-512x512.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
        },
      ],
      share_target: {
        action: process.env.NODE_ENV === 'production' ? '/safe-reader/' : '/',
        enctype: 'application/x-www-form-urlencoded',
        method: 'GET',
        params: {
          text: 'text',
          url: 'url',
        },
      },
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US' },
      { code: 'es', name: 'Español', iso: 'es-ES' },
    ],
    defaultLocale: 'es',
    translationDir: 'app/locales',
  },

  content: {
    database: {
      bindingName: 'D1',
      type: 'd1',
    },
  },
});
