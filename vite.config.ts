import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel"
  },
  vite: {
    server: {
      port: 2001,
    },
  },
  tanstackStart: {
    server: { entry: "src/server" },
  },
});
