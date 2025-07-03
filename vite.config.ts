/// <reference types="vitest" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption } from 'vite';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), tailwindcss(),visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
    filename: "performance/reports/bundle-stats.html",
    exclude: {
        bundle: "storybook-static",
      },
    template: "treemap",
    sourcemap: true,
  }) as PluginOption],

  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
