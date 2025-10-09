import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative path for custom domain hosting
export default defineConfig({
  plugins: [react()],
  base: './',
})
