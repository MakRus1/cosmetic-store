import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": 'http://45.146.167.188:5000',
      "/uploads/": 'http://45.146.167.188:5000',
    }
  }
})
