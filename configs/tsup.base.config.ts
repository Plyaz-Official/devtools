import { defineConfig, type Options } from 'tsup';

/**
 * Base tsup configuration for all @plyaz packages
 * Provides sensible defaults for dual CJS/ESM output with TypeScript support
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createTsupConfig = (options = {}) => {
  return defineConfig({
    // Entry points - packages should override if needed
    entry: ['src/index.ts'],

    // Dual format output for maximum compatibility
    format: ['cjs', 'esm'],

    // Generate TypeScript declaration files
    dts: true,

    // Source maps for debugging
    sourcemap: true,

    // Clean output directory before build
    clean: true,

    // Output directory
    outDir: 'dist',

    // Target modern environments but maintain compatibility
    target: ['es2022', 'node22'],

    // Platform neutral by default (works in browser and Node.js)
    platform: 'neutral',

    // Don't bundle external dependencies - keep them as peer deps
    external: [
      // React ecosystem
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',

      // Next.js framework
      'next',
      'next/app',
      'next/document',
      'next/head',
      'next/image',
      'next/link',
      'next/router',
      'next/navigation',
      'next/headers',
      'next/server',
      'next/dynamic',

      // NestJS ecosystem
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/platform-express',
      '@nestjs/platform-fastify',
      '@nestjs/swagger',
      '@nestjs/config',
      '@nestjs/typeorm',

      // Node.js built-ins
      'fs',
      'path',
      'crypto',
      'os',
      'util',
      'stream',
      'events',
      'http',
      'https',
      'url',
      'querystring',

      // Common ecosystem packages
      'ethers',
      'viem',
      'wagmi',
      'zustand',
      '@tanstack/react-query',
      'axios',
      'lodash',
      'date-fns',
      'zod',
    ],

    // Code splitting disabled for libraries (better for consumers)
    splitting: false,

    // Don't minify - let consumers decide
    minify: false,

    // Enable tree shaking
    treeshake: true,

    // Keep original names for better debugging
    keepNames: true,

    // Add banner to generated files
    banner: {
      js: '// @plyaz package - Built with tsup',
    },

    // esbuild configuration
    esbuildOptions(opts, context) {
      // UTF-8 encoding
      opts.charset = 'utf8';

      // JSX configuration for React/Next.js support
      opts.jsx = 'automatic';
      opts.jsxImportSource = 'react';

      // Format-specific optimizations
      if (context.format === 'esm') {
        opts.packages = 'external';
        opts.platform = 'neutral';
      }

      if (context.format === 'cjs') {
        opts.platform = 'node'; // CJS requires Node.js platform
      }
    },

    // Merge with user options (user options take precedence)
    ...options,
  });
};

/**
 * Configuration for React/Next.js component packages
 * Optimized for browser environments with JSX support
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createReactConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    platform: 'browser',
    target: ['es2022'],
    external: [
      // React core
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',

      // Next.js modules
      'next',
      'next/app',
      'next/document',
      'next/head',
      'next/image',
      'next/link',
      'next/router',
      'next/navigation',
      'next/headers',
      'next/server',
      'next/dynamic',

      // Common React ecosystem
      '@tanstack/react-query',
      'zustand',
      'react-hook-form',
      'framer-motion',

      // Include any additional externals
      ...(options.external || []),
    ],
    esbuildOptions(opts: { jsx: string; jsxImportSource: string; charset: string; packages: string; platform: string; }, context: { format: string; }) {
      opts.jsx = 'automatic';
      opts.jsxImportSource = 'react';
      opts.charset = 'utf8';

      if (context.format === 'esm') {
        opts.packages = 'external';
        opts.platform = 'browser';
      }

      if (context.format === 'cjs') {
        opts.platform = 'node';
      }
    },
    ...options,
  });
};

/**
 * Configuration for Node.js/NestJS backend packages
 * Optimized for server environments
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createNodeConfig = (options: Options = {}) => {
  return createTsupConfig({
    platform: 'node',
    target: ['node22'],
    external: [
      // Node.js built-ins
      'fs',
      'path',
      'crypto',
      'os',
      'util',
      'stream',
      'events',
      'http',
      'https',
      'url',
      'querystring',
      'buffer',
      'child_process',

      // NestJS ecosystem
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/platform-express',
      '@nestjs/platform-fastify',
      '@nestjs/swagger',
      '@nestjs/config',
      '@nestjs/typeorm',

      // Common backend packages
      'express',
      'fastify',
      'cors',
      'helmet',
      'bcrypt',
      'jsonwebtoken',

      // Include any additional externals
      ...(options.external || []),
    ],
    esbuildOptions(opts: { charset: string; platform: string; packages: string; }, context: { format: string; }) {
      opts.charset = 'utf8';
      opts.platform = 'node';

      if (context.format === 'esm') {
        opts.packages = 'external';
      }
    },
    ...options,
  });
};

/**
 * Configuration for full-stack packages (work in both browser and Node.js)
 * Perfect for shared utilities, types, and isomorphic code
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createIsomorphicConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    platform: 'neutral',
    target: ['es2022', 'node22'],
    external: [
      // React ecosystem (optional peer deps)
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',

      // Next.js (optional peer deps)
      'next',
      'next/app',
      'next/document',
      'next/head',
      'next/image',
      'next/link',
      'next/router',
      'next/navigation',
      'next/headers',
      'next/server',

      // Node.js built-ins (optional)
      'fs',
      'path',
      'crypto',
      'os',
      'util',
      'stream',
      'events',

      // NestJS (optional peer deps)
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/platform-express',

      // Web3 ecosystem
      'ethers',
      'viem',
      'wagmi',

      // Include any additional externals
      ...(options.external || []),
    ],
    esbuildOptions(opts: { jsx: string; jsxImportSource: string; charset: string; packages: string; platform: string; }, context: { format: string; }) {
      opts.jsx = 'automatic';
      opts.jsxImportSource = 'react';
      opts.charset = 'utf8';

      if (context.format === 'esm') {
        opts.packages = 'external';
        opts.platform = 'neutral';
      }

      if (context.format === 'cjs') {
        opts.platform = 'node';
      }
    },
    ...options,
  });
};

/**
 * Configuration for utility packages
 * Optimized for tree-shaking and minimal bundle size
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createUtilsConfig = (options: Partial<Options> = {}) => {
  return createTsupConfig({
    treeshake: 'smallest',
    platform: 'neutral',
    target: ['es2022', 'node22'],
    external: [
      // Keep only essential externals for utils
      'date-fns',
      'lodash',
      'zod',
      'crypto',

      // Include any additional externals
      ...(options.external || []),
    ],
    ...options,
  });
};

/**
 * Configuration for type-only packages
 * No runtime code, just TypeScript definitions
 * @param {import('tsup').Options} options
 * @returns {import('tsup').Options}
 */
export const createTypesConfig = (options = {}) => {
  return createTsupConfig({
    dts: {
      only: true, // Only generate .d.ts files
    },
    format: ['esm'], // Types don't need dual format
    external: [], // Types don't have runtime dependencies
    ...options,
  });
};

// Export the base config as default
export default createTsupConfig;
