import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/anilist-img': {
        target: 'https://s4.anilist.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anilist-img/, ''),
      },
    },
  },
})