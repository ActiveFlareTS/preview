// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-03',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-auth-utils', 'nitro-cloudflare-dev'],
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  runtimeConfig: {
    public: {
      apiServer:
        process.env.NODE_ENV === "production"
          ? ""
          : process.env.NUXT_PUBLIC_API_BASE || "",
    },
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "default_passwordAJ82uyAJHsjk",
      cookie: {
        secure: false, // Set to true in production

        sameSite: "lax",
      },
    },
  }
})