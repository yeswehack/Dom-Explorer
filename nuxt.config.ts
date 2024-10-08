// https://nuxt.com/docs/api/configuration/nuxt-config

const baseURL = "/Dom-Explorer/";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    appManifest: false,
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        module: "esnext",
      },
    },
  },
  devtools: { enabled: true },
  app: {
    baseURL,
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: `${baseURL}/icon.svg` },
      ],
      title: "Dom-Explorer",
    },
  },
  runtimeConfig: {
    app: {
      baseURL,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "shadcn-nuxt",
    "nuxt-typed-router",
    "@nuxt/eslint",
  ],
  tailwindcss: {
    configPath: "tailwind.config.js",
    cssPath: "@/assets/style.css",
  },
  imports: {
    dirs: ["~/composables", "~/utils"],
    mergeExisting: false,
  },
  components: {
    dirs: [
      {
        path: "@/components/DomExplorer",
        pathPrefix: false,
      },
      "@/components",
    ],
  },
  shadcn: {
    prefix: "",
    componentDir: "app/components/ui",
  },
});
