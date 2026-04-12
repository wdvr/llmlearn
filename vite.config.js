import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

let commitHash = process.env.VITE_COMMIT_HASH || 'dev'
let buildNum = process.env.VITE_BUILD_NUM || '0'
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
  buildNum = execSync('git rev-list --count HEAD').toString().trim()
} catch {}

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_NUM__: JSON.stringify(buildNum),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
