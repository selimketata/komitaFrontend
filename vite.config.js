import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    assetsInclude: "**/*.JPG",
    build: {
      outDir: 'build',
    },
    plugins: [react()],
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
    resolve: {
      alias: {
        '@config': path.resolve(__dirname, 'src/config'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@services': path.resolve(__dirname, 'src/Services'),
        '@context': path.resolve(__dirname, 'src/Context'),
      },
    },
  };
});
