import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/enhanced-person-card.ts',
      name: 'EnhancedPersonCard',
      fileName: () => 'enhanced-person-card.js',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        entryFileNames: 'enhanced-person-card.js',
        dir: '.',
        inlineDynamicImports: true
      }
    },
    sourcemap: true,
    minify: true
  },
  esbuild: {
    target: 'esnext',
    format: 'esm'
  }
});
