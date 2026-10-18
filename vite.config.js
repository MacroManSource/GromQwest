import { defineConfig } from 'vite';

// Relative paths work both for user pages and project pages (repo-name subpath).
export default defineConfig({
  base: './',
  build: { outDir: 'dist', emptyOutDir: true }
});
