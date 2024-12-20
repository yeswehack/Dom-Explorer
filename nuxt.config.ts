// https://nuxt.com/docs/api/configuration/nuxt-config
import env from "./env";

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
  devtools: {
    enabled: true,
  },
  app: {
    baseURL: env.BASE_URL,
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: `${env.BASE_URL}/icon.svg` },
      ],
      title: "Dom-Explorer",
    },
  },
  runtimeConfig: {
    app: {
      baseURL: env.BASE_URL,
    },
    public: {
      withSupabase: !!env.SUPABASE_KEY && !!env.SUPABASE_URL,
      supabaseUrl: env.SUPABASE_URL,
      supabaseKey: env.SUPABASE_KEY,
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
    configPath: "tailwind.config.ts",
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
