import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  assetsInclude: "**/*.JPG",
  build: {
    outDir: 'build',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'Config'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4200,
    proxy: {
      '/api': {
        target: 'https://komita-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
