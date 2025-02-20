import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),dts({ // Add the plugin
    entryRoot: "src", // Source directory
    insertTypesEntry: true, // Ensure it adds types entry in package.json
    cleanVueFileName: true,
    tsconfigPath: './tsconfig.app.json',
    include:['src/index.tsx']
  })],
  build: {
    lib: {
      entry: "src/index.tsx", // Your main entry file
      name: "MyChatbotUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
})
