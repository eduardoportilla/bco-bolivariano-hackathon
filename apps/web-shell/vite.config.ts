import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation, { type Shared as FederationSharedDeps } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: 'shell',
      remotes: {
        webAccounts: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false },
      } as FederationSharedDeps,
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    cors: true,
  },
  preview: {
    port: 3000,
    cors: true,
  },
});
