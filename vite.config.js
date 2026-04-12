import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

let commitHash = 'dev'
try { commitHash = execSync('git rev-parse --short HEAD').toString().trim() } catch {}
const buildTime = new Date().toISOString()

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
