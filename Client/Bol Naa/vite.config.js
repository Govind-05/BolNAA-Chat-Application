import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv';
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/post': {
           target: process.env.REACT_APP_PROXY_DOMAIN,
           changeOrigin: true,
           secure: false,      
           ws: true,
       }
  }
  },
  plugins: [react()],
})
