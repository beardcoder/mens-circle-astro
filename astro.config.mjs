// @ts-check
import { defineConfig, envField } from "astro/config";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://mens-circle.de",
  integrations: [svelte()],
  image: {
    domains: ["mens-circle.de"],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  env: {
    schema: {
      PUBLIC_POCKETBASE_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://127.0.0.1:8090",
      }),
    },
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
