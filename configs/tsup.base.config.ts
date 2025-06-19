import type {Options} from 'tsup';
import { defineConfig } from 'tsup';


export const createTsupConfig = (options: Partial<Options> = {}) => {
  return defineConfig({
    // Entry points
    entry: ['src/index.ts'],

    // Output formats
    format: ['cjs', 'esm'],

    // Generate type definitions
    dts: true,

    // Code splitting for better tree shaking
    splitting: true,

    // Source maps for debugging
    sourcemap: true,

    // Clean output directory
    clean: true,

    // Output directory
    outDir: 'dist',

    // Target environments
    target: 'node18',

    // Bundle external dependencies or keep them external
    external: [
      // Keep peer dependencies external
      'react',
      'react-dom',
      'next',
      '@nestjs/common',
      '@nestjs/core',
      // Add other common peer deps
    ],

    // Minification
    minify: false, // Keep readable for debugging, enable in production

    // Tree shaking
    treeshake: true,

    // Bundle splitting strategy
    experimentalDts: {
      entry: {
        index: 'src/index.ts',
      },
    },

    // Platform specific builds
    platform: 'node',

    // Keep original file names for better debugging
    keepNames: true,

    // Banner for licensing
    banner: {
      js: '// @plyaz package - Built with tsup',
    },

    // Custom esbuild options
    esbuildOptions(options, context) {
      // Add any custom esbuild configurations
      options.charset = 'utf8';

      // Conditional builds based on format
      if (context.format === 'esm') {
        options.packages = 'external';
      }
    },

    // Plugin system
    esbuildPlugins: [],

    // Override any default options with user provided ones
    ...options,
  });
};

// Specific configurations for different package types
export const createLibraryConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    // Library specific defaults
    splitting: false, // Libraries usually don't need splitting
    ...options,
  });
};

export const createUtilsConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    // Utils can be tree-shaken more aggressively
    treeshake: 'smallest',
    ...options,
  });
};

export const createReactConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    // React component specific config
    external: ['react', 'react-dom', ...(options.external as readonly string[]) || []],
    ...options,
  });
};

export const createNodeConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    // Node.js specific config
    platform: 'node',
    target: 'node18',
    format: ['cjs', 'esm'],
    ...options,
  });
};

export default createTsupConfig;
