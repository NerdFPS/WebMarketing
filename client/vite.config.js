import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, as chamadas /api vão para o servidor Node.
    proxy: { '/api': 'http://localhost:3001' },
  },
  test: {
    environment: 'node',
  },
});
