import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'


const fullReloadAlways: PluginOption = {
  name: 'full-reload-always',
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
} as PluginOption

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: false
  },
  plugins: [react(), fullReloadAlways],
})
