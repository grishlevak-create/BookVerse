import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeBase(raw: string | undefined): string {
  const t = raw?.trim();
  if (!t || t === '/') return '/';
  const inner = t.replace(/^\/+|\/+$/g, '');
  return inner ? `/${inner}/` : '/';
}

export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_PATH),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/entities': path.resolve(__dirname, 'src/entities'),
      '@/features': path.resolve(__dirname, 'src/features'),
      '@/widgets': path.resolve(__dirname, 'src/widgets'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/app': path.resolve(__dirname, 'src/app'),
    },
  },
});
