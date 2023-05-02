import { defineConfig, type PluginOption } from 'vite'
import { visualizer } from "rollup-plugin-visualizer";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "metastats/treemap.stratosphere.html",
    }) as PluginOption,
    visualizer({
      template: "sunburst",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "metastats/sunburst.stratosphere.html",
    }) as PluginOption,
  ]
})
