import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    assetsInclude: "**/*.JPG",
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Allows external access
      port: process.env.PORT || 4200, // Uses dynamic port or defaults to 4200
      proxy: {
        '/api': {
          target: 'https://komita-backend.onrender.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
