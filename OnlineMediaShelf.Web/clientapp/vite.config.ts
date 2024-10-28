import {
  defineConfig
} from 'vite'
import react
  from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 57687,
    proxy: {
      '/api': {
        target: 'https://localhost:7292',
        changeOrigin: true,
        secure: false,
      },
      '/account': {
        target: 'https://localhost:7292',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
