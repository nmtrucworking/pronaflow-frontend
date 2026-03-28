import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = repositoryName ? `/${repositoryName}/` : '/'
const basePath = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/')

export default defineConfig({
  base: basePath,
  plugins: [
    react()
  ],
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'INVALID_ANNOTATION' &&
          typeof warning.id === 'string' &&
          warning.id.includes('gantt-task-react/dist/index.modern.js')
        ) {
          return
        }

        warn(warning)
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    exclude: ['docs']
  }
})