import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Kita tidak perlu lagi mendefinisikan postcss di sini.
  // Vite cukup pintar untuk menemukannya secara otomatis.
})