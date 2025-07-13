import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    // Inclure aussi les fichiers JPG (attention à la casse : ici, tu as "**/*.JPG", souvent c'est en minuscules)
    assetsInclude: ["**/*.JPG", "**/*.jpg"],

    build: {
      outDir: 'build',
    },

    plugins: [react()],

    server: {
      host: '0.0.0.0', // Pour accès externe (ex: sur Render)
      port: Number(process.env.PORT) || 4200, // Assure que c'est un nombre
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
