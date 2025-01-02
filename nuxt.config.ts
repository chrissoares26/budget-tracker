// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/styles.css"],
  plugins: ["~/plugins/firebase.js"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
