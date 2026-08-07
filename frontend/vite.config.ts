import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: '/senns-fortress/',
    server: {
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY,
          changeOrigin: true
        }
      }
    },
  }
})
