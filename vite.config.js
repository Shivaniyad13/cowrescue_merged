import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    const apiUrl = loadEnv(mode, '.', 'VITE_').VITE_API_URL?.trim();
    if (!apiUrl) {
      throw new Error('VITE_API_URL must be set to the deployed backend URL for production builds.');
    }

    let parsedApiUrl;
    try {
      parsedApiUrl = new URL(apiUrl);
    } catch {
      throw new Error('VITE_API_URL must be an absolute HTTPS backend URL in production.');
    }

    if (
      parsedApiUrl.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(parsedApiUrl.hostname)
    ) {
      throw new Error('Production VITE_API_URL must use the HTTPS URL of the deployed backend.');
    }
  }

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
})


