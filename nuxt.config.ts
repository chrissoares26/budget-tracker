import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "nuxt-vuefire",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: ["~/assets/styles.css", "vuetify/styles"],
  plugins: ["~/plugins/pinia.js", "~/plugins/vuetify.ts"],
  vuefire: {
    config: {
      apiKey: "AIzaSyD6HvhPMlOS_ps_EnLQ82EzpzAjHlyfoFk",
      authDomain: "budget-tracker-e76ef.firebaseapp.com",
      projectId: "budget-tracker-e76ef",
      storageBucket: "budget-tracker-e76ef.firebasestorage.app",
      messagingSenderId: "1027691027334",
      appId: "1:1027691027334:web:a212f053fa2cb0c3882a07",
      measurementId: "G-LEYJM1Z6DK",
    },
  },
  runtimeConfig: {
    public: {
      FIREBASE_KEY: process.env.FIREBASE_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
