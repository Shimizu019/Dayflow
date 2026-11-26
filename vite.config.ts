import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@app': path.resolve(projectRoot, 'src/app'),
      '@assets': path.resolve(projectRoot, 'src/assets'),
      '@components': path.resolve(projectRoot, 'src/components'),
      '@features': path.resolve(projectRoot, 'src/features'),
      '@database': path.resolve(projectRoot, 'src/database'),
      '@hooks': path.resolve(projectRoot, 'src/hooks'),
      '@services': path.resolve(projectRoot, 'src/services'),
      '@types': path.resolve(projectRoot, 'src/types'),
      '@utils': path.resolve(projectRoot, 'src/utils'),
      '@styles': path.resolve(projectRoot, 'src/styles'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});
