
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const apiUrl = env.VITE_API_URL?.trim();

  if (!apiUrl) {
    throw new Error('VITE_API_URL must be configured in your .env file.');
  }

  if (mode === 'production') {
    let parsedApiUrl;

    try {
      parsedApiUrl = new URL(apiUrl);
    } catch {
      throw new Error('VITE_API_URL must be a valid absolute URL.');
    }

    const isLocalhost = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
    ].includes(parsedApiUrl.hostname);

    // Allow localhost for local production build testing.
    // All other production URLs must use HTTPS.
    if (
      parsedApiUrl.protocol !== 'https:' &&
      !(parsedApiUrl.protocol === 'http:' && isLocalhost)
    ) {
      throw new Error(
        'Production VITE_API_URL must use HTTPS or localhost for local build testing.'
      );
    }
  }

  return {
    plugins: [react()],

    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});
