import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation, { type Shared as FederationSharedDeps } from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: process.env.REMOTE_WEB_ACCOUNTS_BASE_PATH || '/', // Always include trailing slash (e.g. /accounts/)
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: 'webAccounts',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
        '@tanstack/react-query': { singleton: true, requiredVersion: false },
      } as FederationSharedDeps,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    cors: true,
  },
  preview: {
    port: 3001,
    cors: true,
  },
});
