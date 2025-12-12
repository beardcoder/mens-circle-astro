// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://mens-circle.de",
  output: "static",
  integrations: [],
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
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
  },
});
