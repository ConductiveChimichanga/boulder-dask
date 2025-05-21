import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
