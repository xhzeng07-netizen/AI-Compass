import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as yaml from 'js-yaml'

// Manual YAML plugin for Vite
function yamlPlugin() {
  return {
    name: 'vite-plugin-yaml',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (id.endsWith('.yaml') || id.endsWith('.yml')) {
        const parsed = yaml.load(code)
        return `export default ${JSON.stringify(parsed)}`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    yamlPlugin(),
  ],
})
