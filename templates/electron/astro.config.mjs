import { defineConfig } from 'astro/config';
import AutoImport from "unplugin-auto-import/astro";

// https://astro.build/config
export default defineConfig({
  outDir: './dist-static',
  server: { port: 8999 },
  build: {
    targets: ["es2022"],
  },
  integrations: [
    AutoImport({
      resolvers: [],
    }),
  ],
  vite: {
    build: {
      sourcemap: true,
    },
  }
});
