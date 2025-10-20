import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const config = require('./app/config.json');
const configVite = config.VITE_CONFIG;
const configEel = config.EEL_CONFIG;

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'app/web',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/echarts-gl')) {
              return 'vendor-echarts-gl'; 
            }
            if (id.includes('node_modules/echarts')) {
              return 'vendor-echarts';
            }
            if (id.includes('react-grid-layout')) {
              return 'vendor-react-grid-layout';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'; 
            }


            return 'vendor-main';
          }
        },
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      },
    },
  },
  server: {
    port: configVite.PORT,
    proxy: {
      '/eel': { 
        target: 'ws://localhost:'+configEel.PORT_DEV,
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
