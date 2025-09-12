import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devTarget = env.SERVER_ORIGIN || 'http://localhost:5000'
  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: devTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
