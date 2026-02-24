import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginApi from './vite-plugin-api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '');
    const apiKey = env.GEMINI_API_KEY || env.API_KEY || env.VITE_GEMINI_API_KEY || env.VITE_API_KEY || '';
    return {
      envDir: projectRoot,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), vitePluginApi()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
